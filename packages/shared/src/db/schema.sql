-- ====================================================================
-- DOCLY DATABASE SCHEMA (Supabase PostgreSQL + pgvector)
-- ====================================================================

-- 1. Enable pgvector for embeddings and semantic search
create extension if not exists vector;

-- 2. Documents Table
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- Core Visual & Identification
  title text not null,
  emoji text default '📄',
  bg_color text default '#E8E1FF',
  
  -- Categorization & Filing
  category text not null check (category in ('Bills', 'Vehicle', 'Finance', 'Home', 'Insurance', 'Purchases', 'Other')),
  subcategory text,
  path text not null, -- e.g. 'Insurance / Vehicle'
  
  -- File Details
  file_type text not null check (file_type in ('PDF', 'IMG', 'DOCX')),
  file_name text not null,
  file_size bigint,
  file_hash text, -- SHA-256 for deduplication detection
  
  -- Google Drive Reference (drive.file scope)
  drive_file_id text,
  drive_web_link text,
  gdrive_folder text default 'My Drive / Docly',
  
  -- Ingestion & Confidence Status
  -- status: 'organized' (>=0.90 confidence), 'inbox' (<0.90 or duplicate), 'archived'
  status text not null default 'organized' check (status in ('organized', 'inbox', 'archived')),
  confidence float not null default 0.95,
  
  -- Extracted Dates & Expiry
  document_date date,
  expiry_date date,
  expiry_notice text,
  
  -- Structured Extracted Entities (JSON)
  tags text[] default array[]::text[],
  facts jsonb default '[]'::jsonb, -- e.g. [{"label": "Validity", "value": "..."}, {"label": "Amount", "value": "₹18,450"}]
  metadata jsonb default '{}'::jsonb,
  details jsonb default '{}'::jsonb, -- {company, type, policyNo, vehicleNo, amount, confidenceLabel}
  
  -- Full OCR Text & Search
  raw_text text,
  tsv tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(category, '') || ' ' || coalesce(subcategory, '') || ' ' || coalesce(raw_text, ''))
  ) stored,
  
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes for lightning fast queries
create index if not exists idx_documents_user_id on public.documents(user_id);
create index if not exists idx_documents_status on public.documents(user_id, status);
create index if not exists idx_documents_category on public.documents(user_id, category);
create index if not exists idx_documents_expiry on public.documents(user_id, expiry_date) where expiry_date is not null;
create index if not exists idx_documents_tsv on public.documents using gin(tsv);
create index if not exists idx_documents_hash on public.documents(user_id, file_hash);

-- 3. Document Chunks Table (for RAG & Vector Search)
create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  page_number int default 1 not null,
  chunk_index int default 0 not null,
  chunk_text text not null,
  citation text, -- e.g. 'Page 1 · Policy schedule'
  embedding vector(768), -- Gemini text-embedding-004 standard dimension
  created_at timestamptz default now() not null
);

create index if not exists idx_chunks_document_id on public.document_chunks(document_id);
create index if not exists idx_chunks_user_id on public.document_chunks(user_id);

-- HNSW Vector Index for fast cosine similarity search
create index if not exists idx_chunks_embedding on public.document_chunks using hnsw (embedding vector_cosine_ops);

-- 4. Reminders Table
create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  expiry_date date not null,
  reminder_date date not null, -- typically expiry_date - 30 days
  sent boolean default false not null,
  created_at timestamptz default now() not null
);

create index if not exists idx_reminders_pending on public.reminders(reminder_date, sent) where sent = false;

-- 5. Row-Level Security (RLS)
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.reminders enable row level security;

-- Documents RLS policies
create policy "Users can view their own documents"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Users can insert their own documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own documents"
  on public.documents for update
  using (auth.uid() = user_id);

create policy "Users can delete their own documents"
  on public.documents for delete
  using (auth.uid() = user_id);

-- Document Chunks RLS policies
create policy "Users can view their own document chunks"
  on public.document_chunks for select
  using (auth.uid() = user_id);

create policy "Users can manage their own document chunks"
  on public.document_chunks for all
  using (auth.uid() = user_id);

-- Reminders RLS policies
create policy "Users can view their own reminders"
  on public.reminders for select
  using (auth.uid() = user_id);

create policy "Users can manage their own reminders"
  on public.reminders for all
  using (auth.uid() = user_id);

-- 6. RPC: Semantic Search / Match Document Chunks
create or replace function public.match_document_chunks (
  query_embedding vector(768),
  match_count int default 5,
  p_document_id uuid default null
)
returns table (
  id uuid,
  document_id uuid,
  page_number int,
  chunk_text text,
  citation text,
  similarity float
)
language plpgsql
security invoker
as $$
begin
  return query
  select
    c.id,
    c.document_id,
    c.page_number,
    c.chunk_text,
    c.citation,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.document_chunks c
  where
    c.user_id = auth.uid()
    and (p_document_id is null or c.document_id = p_document_id)
  order by c.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 7. RPC: Delete AI Data (Privacy Promise)
-- Wipes raw OCR text, embeddings, and chunks while leaving the document records in place
create or replace function public.delete_user_ai_data ()
returns void
language plpgsql
security invoker
as $$
begin
  -- Delete all vector chunks and embeddings
  delete from public.document_chunks where user_id = auth.uid();
  
  -- Clear raw OCR text from documents
  update public.documents
  set raw_text = null
  where user_id = auth.uid();
end;
$$;
