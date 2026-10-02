<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Docly — Web</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Karla:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --cream:#FFF6E6; --card:#FFFDF6; --ink:#143A32; --muted:#6E8078; --line:#EFE2C6;
  --marigold:#FFB700; --marigold-d:#D89A00;
  --coral:#FF6B57; --coral-d:#E04E3C;
  --mint:#2EC27E; --mint-d:#1FA165;
  --sky:#3FB5F2; --grape:#8B7CF6;
  --disp:'Fredoka',system-ui,sans-serif; --body:'Karla',system-ui,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%}
body{
  font-family:var(--body);color:var(--ink);background:var(--cream);
  background-image:
    radial-gradient(700px 400px at 90% -10%, rgba(255,183,0,.10), transparent 60%),
    radial-gradient(700px 500px at -5% 100%, rgba(46,194,126,.08), transparent 60%),
    radial-gradient(rgba(20,58,50,.045) 1px, transparent 1.4px);
  background-size:auto,auto,22px 22px;
  display:flex;flex-direction:column;overflow:hidden;
}
::selection{background:var(--marigold);color:var(--ink)}
button{font-family:inherit;cursor:pointer}
/* ---------- buttons ---------- */
.btn{font-family:var(--disp);font-weight:600;border:none;border-radius:14px;padding:12px 20px;font-size:15px;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;color:var(--ink);
  transition:transform .08s,box-shadow .08s}
.btn.primary{background:var(--marigold);box-shadow:0 4px 0 var(--marigold-d)}
.btn.primary:active{transform:translateY(3px);box-shadow:0 1px 0 var(--marigold-d)}
.btn.green{background:var(--mint);color:#06301E;box-shadow:0 4px 0 var(--mint-d)}
.btn.green:active{transform:translateY(3px);box-shadow:0 1px 0 var(--mint-d)}
.btn.ghost{background:#FFFDF6;border:2px solid var(--line);box-shadow:0 4px 0 var(--line)}
.btn.ghost:active{transform:translateY(3px);box-shadow:0 1px 0 var(--line)}
.btn.small{padding:9px 15px;font-size:13.5px;border-radius:12px}
kbd{font-family:var(--body);font-size:11px;font-weight:800;background:#F2E7CB;border:1.5px solid #E0CFA5;
  border-bottom-width:3px;border-radius:6px;padding:2px 7px;color:#8A6A1A}
/* ---------- topbar ---------- */
.topbar{height:66px;flex-shrink:0;display:flex;align-items:center;gap:18px;padding:0 22px;
  background:#FFFDF6;border-bottom:2px solid var(--line);z-index:40;position:relative}
.brand{display:flex;align-items:center;gap:10px;font-family:var(--disp);font-weight:700;font-size:21px;min-width:120px}
.brand .mark{width:38px;height:38px;background:var(--marigold);border-radius:12px;display:grid;place-items:center;
  box-shadow:0 3px 0 var(--marigold-d);transform:rotate(-3deg)}
.searchwrap{flex:1;max-width:640px;margin:0 auto;display:flex;align-items:center;gap:10px;background:var(--cream);
  border:2px solid var(--line);border-radius:16px;padding:11px 16px;box-shadow:inset 0 2px 0 rgba(20,58,50,.04);transition:border-color .2s}
.searchwrap:focus-within{border-color:var(--marigold)}
.searchwrap input{flex:1;border:none;background:none;outline:none;font-family:var(--body);font-size:15px;font-weight:700;color:var(--ink)}
.searchwrap input::placeholder{color:#A9B8AE;font-weight:600}
.topbtns{display:flex;align-items:center;gap:12px;min-width:120px;justify-content:flex-end}
.addwrap{position:relative}
.iconbtn{width:42px;height:42px;border-radius:13px;background:var(--cream);border:2px solid var(--line);
  display:grid;place-items:center;position:relative;box-shadow:0 3px 0 var(--line);transition:transform .1s;color:var(--ink)}
.iconbtn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--line)}
.iconbtn .badge,.avatar .badge{position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;border-radius:10px;
  background:var(--coral);color:#fff;font-size:11px;font-weight:800;display:grid;place-items:center;
  padding:0 5px;box-shadow:0 2px 0 var(--coral-d)}
.avatar{width:42px;height:42px;border-radius:50%;background:var(--grape);color:#fff;display:grid;place-items:center;
  font-family:var(--disp);font-weight:700;font-size:18px;box-shadow:0 3px 0 rgba(20,58,50,.25);cursor:pointer;position:relative}
/* add popover */
.pop{position:absolute;top:52px;right:0;width:264px;background:var(--card);border:2px solid var(--line);border-radius:18px;
  box-shadow:0 14px 34px rgba(20,58,50,.16);padding:10px;z-index:60;opacity:0;pointer-events:none;transform:translateY(-8px);transition:all .2s}
.pop.show{opacity:1;pointer-events:auto;transform:translateY(0)}
.pop .opt{display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:none;border:none;border-radius:12px;
  padding:10px 11px;font-family:var(--body)}
.pop .opt:hover{background:var(--cream)}
.pop .opt .em{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;font-size:18px;flex-shrink:0}
.pop .opt b{font-family:var(--disp);font-weight:600;font-size:14px;display:block;color:var(--ink)}
.pop .opt span{font-size:11px;color:var(--muted);font-weight:700}
/* ---------- app frame ---------- */
.app{flex:1;display:grid;grid-template-columns:238px 1fr;min-height:0}
/* ---------- sidebar ---------- */
.sidebar{border-right:2px solid var(--line);padding:18px 14px;display:flex;flex-direction:column;gap:4px;
  overflow-y:auto;background:rgba(255,253,246,.6)}
.snav{display:flex;align-items:center;gap:11px;border:none;background:none;border-radius:13px;padding:11px 13px;
  font-family:var(--disp);font-weight:600;font-size:15.5px;color:var(--ink);position:relative;text-align:left;width:100%}
.snav:hover{background:#FBF1D9}
.snav.on{background:var(--marigold);box-shadow:0 3px 0 var(--marigold-d)}
.snav .badge{margin-left:auto;background:var(--coral);color:#fff;font-size:11.5px;font-weight:800;min-width:22px;height:22px;
  border-radius:11px;display:grid;place-items:center;padding:0 6px;box-shadow:0 2px 0 var(--coral-d)}
.slabel{font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#A9B8AE;margin:16px 13px 6px}
.scat{display:flex;align-items:center;gap:10px;border:none;background:none;border-radius:11px;padding:8px 13px;
  font-size:13.5px;font-weight:800;color:#3F5A51;text-align:left;width:100%;transition:background .15s}
.scat:hover{background:#FBF1D9}
.scat.on{background:#FFE9B8;color:#8A5A00}
.scat .cnt{margin-left:auto;font-size:11.5px;color:#B4A98A;font-weight:800}
.scat.on .cnt{color:#C08A10}
.snew{margin:6px 13px 0;background:none;border:2px dashed var(--line);border-radius:11px;padding:8px;
  font-size:12px;font-weight:800;color:#A9B8AE;width:calc(100% - 26px)}
.snew:hover{border-color:var(--marigold);color:#8A6A1A}
.spacer{flex:1}
.drivecard{background:var(--card);border:2px solid var(--line);border-radius:15px;padding:12px 13px;margin-top:14px}
.drivecard b{font-size:13px;display:flex;align-items:center;gap:7px}
.drivecard .ok{color:var(--mint-d)}
.drivecard small{font-size:11px;color:var(--muted);font-weight:700;display:block;margin:6px 0 5px}
.sbar{height:8px;background:#F2E7CB;border-radius:99px;overflow:hidden}
.sbar i{display:block;height:100%;width:41%;background:var(--sky);border-radius:99px}
.kbdhint{margin-top:12px;font-size:11px;color:#A9B8AE;font-weight:700;line-height:2}
/* ---------- main / views ---------- */
main{overflow-y:auto;padding:30px 36px 60px;min-width:0}
.view{display:none}
.view.active{display:block;animation:fadeUp .35s both}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}}
.hello{font-family:var(--disp);font-weight:700;font-size:30px;line-height:1.15}
.sub{font-size:14px;color:var(--muted);font-weight:600;margin-top:4px}
.hrow{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;flex-wrap:wrap}
.datechip{background:var(--card);border:2px solid var(--line);border-radius:99px;padding:8px 16px;font-size:13px;
  font-weight:800;color:var(--muted);box-shadow:0 3px 0 var(--line)}
/* ---------- dropzone ---------- */
.dropzone{margin-top:22px;background:var(--card);border:3px dashed #E0CFA5;border-radius:26px;padding:40px 30px;
  text-align:center;position:relative;transition:all .2s;overflow:hidden}
.dropzone::before,.dropzone::after{content:"✦";position:absolute;font-size:18px;color:var(--marigold);animation:twinkle 2.4s infinite}
.dropzone::before{top:22px;left:34px}
.dropzone::after{bottom:22px;right:38px;animation-delay:1.2s}
@keyframes twinkle{50%{transform:scale(1.3) rotate(20deg);opacity:.5}}
.dropzone.drag{border-color:var(--marigold);background:#FFF3D1;transform:scale(1.01)}
.dropzone.drag .dzicon{transform:scale(1.12) rotate(-4deg)}
.dzicon{width:74px;height:74px;margin:0 auto 14px;background:var(--marigold);border-radius:22px;display:grid;place-items:center;
  box-shadow:0 5px 0 var(--marigold-d);transition:transform .2s}
.dropzone h2{font-family:var(--disp);font-size:26px}
.dropzone p{font-size:14px;color:var(--muted);font-weight:600;max-width:480px;margin:8px auto 20px;line-height:1.55}
.dzbtns{display:flex;gap:11px;justify-content:center;flex-wrap:wrap}
/* ---------- home cols ---------- */
.cols{display:grid;grid-template-columns:1fr 300px;gap:26px;margin-top:30px;align-items:start}
.section-h{display:flex;justify-content:space-between;align-items:baseline;margin:0 2px 12px;
  font-family:var(--disp);font-weight:600;font-size:18px}
.section-h a{font-family:var(--body);font-size:12.5px;font-weight:800;color:#2492CE;cursor:pointer;text-decoration:none}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.chip{font-size:12.5px;font-weight:800;background:var(--card);border:2px solid var(--line);border-radius:999px;
  padding:7px 14px;color:var(--ink);box-shadow:0 2px 0 var(--line);transition:transform .1s}
.chip:hover{transform:translateY(-2px);border-color:var(--marigold)}
.chip.on{background:var(--ink);color:var(--cream);border-color:var(--ink);box-shadow:0 2px 0 rgba(20,58,50,.4)}
/* doc cards grid */
.dgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:14px}
.dcard{background:var(--card);border:2px solid var(--line);border-radius:18px;padding:13px;cursor:pointer;
  box-shadow:0 4px 0 var(--line);transition:transform .13s,box-shadow .13s}
.dcard:hover{transform:translateY(-4px);box-shadow:0 8px 0 var(--line)}
.dcard.pop-in{animation:popin .5s cubic-bezier(.3,1.6,.5,1)}
@keyframes popin{from{transform:scale(.6);opacity:0}}
.dthumb{height:96px;border-radius:12px;display:grid;place-items:center;font-size:38px;position:relative;margin-bottom:10px}
.dthumb .ft{position:absolute;right:8px;bottom:8px;font-size:9.5px;font-weight:800;background:#FFFDF6;
  border-radius:6px;padding:3px 7px;color:#8A6A1A}
.dcard b{font-family:var(--disp);font-weight:600;font-size:14.5px;display:block;line-height:1.25;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dcard span{font-size:11.5px;color:var(--muted);font-weight:700;display:block;margin-top:3px}
/* rail */
.railcard{background:var(--card);border:2px solid var(--line);border-radius:18px;padding:16px;box-shadow:0 4px 0 var(--line);margin-bottom:16px}
.railcard h4{font-family:var(--disp);font-size:15.5px;margin-bottom:11px;display:flex;align-items:center;gap:7px}
.due{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:2px solid #F7EFDC}
.due:last-child{border-bottom:none}
.due .em{font-size:19px}
.due b{font-size:13px;display:block}
.due small{font-size:11px;color:var(--muted);font-weight:700}
.duepill{margin-left:auto;font-size:11px;font-weight:800;border-radius:99px;padding:4px 10px;white-space:nowrap}
.duepill.warn{background:#FFE9B8;color:#8A5A00}
.duepill.ok{background:#D6F5E3;color:#0B7A50}
.prompt{display:block;width:100%;text-align:left;background:var(--cream);border:2px solid var(--line);border-radius:12px;
  padding:10px 12px;font-size:12.5px;font-weight:700;color:var(--ink);margin-bottom:8px;transition:all .15s}
.prompt:hover{border-color:var(--grape);transform:translateX(3px)}
/* ---------- search view ---------- */
.nl-line{display:flex;align-items:center;gap:10px;background:#EFE9FB;border:2px solid #DCD3F8;border-radius:14px;
  padding:11px 16px;font-size:13px;font-weight:700;color:#5B4BC4;margin:16px 0}
.resrow{display:flex;align-items:center;gap:15px;background:var(--card);border:2px solid var(--line);border-radius:16px;
  padding:14px 18px;margin-bottom:11px;cursor:pointer;box-shadow:0 3px 0 var(--line);transition:transform .12s}
.resrow:hover{transform:translateX(5px)}
.resrow .em{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;font-size:25px;flex-shrink:0}
.resrow b{font-family:var(--disp);font-size:16px;display:block}
.resrow .meta{font-size:12.5px;color:var(--muted);font-weight:700;margin-top:2px}
.resrow .right{margin-left:auto;text-align:right;display:flex;flex-direction:column;gap:6px;align-items:flex-end}
.ftag{font-size:10.5px;font-weight:800;border-radius:7px;padding:4px 9px;display:inline-block}
.ftag.pdf{background:#FFE9B8;color:#8A5A00}
.ftag.img{background:#D7EEFF;color:#0F6AA8}
.resrow .exp{font-size:11.5px;font-weight:800;color:var(--coral-d)}
.rescount{font-size:13px;font-weight:800;color:var(--muted);margin:14px 2px 12px;letter-spacing:.4px}
/* ---------- inbox ---------- */
.icard{display:flex;gap:16px;background:var(--card);border:2px solid var(--line);border-radius:18px;padding:18px;
  margin-bottom:14px;box-shadow:0 4px 0 var(--line);transition:transform .35s,opacity .35s;align-items:flex-start}
.icard.bye{transform:translateX(120%) rotate(3deg);opacity:0}
.icard .em{width:52px;height:52px;border-radius:15px;display:grid;place-items:center;font-size:26px;flex-shrink:0}
.icard .mid{flex:1;min-width:0}
.icard b{font-family:var(--disp);font-size:16.5px}
.icard .meta{font-size:12px;color:var(--muted);font-weight:700;margin-top:1px}
.ailine{display:flex;gap:8px;margin:10px 0;font-size:13.5px;color:#3F5A51;font-weight:600;background:#FFF6E0;
  border-radius:11px;padding:10px 13px;line-height:1.45;align-items:flex-start}
.icard .side{display:flex;flex-direction:column;gap:9px;align-items:flex-end;flex-shrink:0}
.conf{font-size:11px;font-weight:800;border-radius:99px;padding:4px 11px}
.conf.hi{background:#D6F5E3;color:#0B7A50}
.conf.lo{background:#FFE9B8;color:#8A5A00}
.rowbtns{display:flex;gap:8px}
.catpick{display:none;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:11px}
.catpick.show{display:grid}
.catpick button{border:2px solid var(--line);background:#FFFDF6;border-radius:11px;padding:8px 2px;
  font-size:11px;font-weight:800;color:var(--ink);display:flex;flex-direction:column;align-items:center;gap:3px}
.catpick button span{font-size:17px}
.catpick button:hover{border-color:var(--marigold);transform:translateY(-2px)}
.inboxempty{text-align:center;padding:70px 20px;display:none}
.inboxempty .big{font-size:52px}
.inboxempty h3{font-family:var(--disp);font-size:23px;margin-top:12px}
.inboxempty p{color:var(--muted);font-weight:600;margin-top:4px}
/* ---------- doc view ---------- */
.docbar{display:flex;align-items:center;gap:13px;margin-bottom:20px;flex-wrap:wrap}
.backbtn{height:40px;padding:0 16px;border-radius:13px;background:var(--card);border:2px solid var(--line);
  box-shadow:0 3px 0 var(--line);font-weight:800;font-size:14px;color:var(--ink)}
.docbar h2{font-family:var(--disp);font-size:21px;flex:1;min-width:200px}
.docgrid{display:grid;grid-template-columns:1fr 360px;gap:26px;align-items:start}
.preview{background:var(--card);border:2px solid var(--line);border-radius:20px;padding:22px;box-shadow:0 4px 0 var(--line)}
.pager{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:16px;font-weight:800;font-size:13px;color:var(--muted)}
.pager button{width:32px;height:32px;border-radius:10px;border:2px solid var(--line);background:#FFFDF6;
  box-shadow:0 2px 0 var(--line);font-weight:800;color:var(--ink)}
.pdfpage{background:#fff;border:2px solid var(--line);border-radius:12px;padding:30px;position:relative;overflow:hidden;
  box-shadow:0 8px 22px rgba(20,58,50,.09);min-height:540px}
.pdfpage::after{content:"";position:absolute;top:0;right:0;border-style:solid;border-width:0 34px 34px 0;
  border-color:var(--card) var(--card) var(--line) transparent}
.phead{display:flex;gap:12px;align-items:center}
.plogo{width:44px;height:44px;border-radius:12px;background:var(--coral);color:#fff;display:grid;place-items:center;
  font-family:var(--disp);font-weight:700;font-size:15px}
.phead b{font-size:17px;letter-spacing:1.5px;color:#B3401F;display:block}
.phead span{font-size:10.5px;color:var(--muted);font-weight:700;letter-spacing:.8px}
.ptitle{font-family:var(--disp);font-size:19px;margin:22px 0 14px}
.pline{height:9px;border-radius:5px;background:#EFEAD9;margin-bottom:9px}
.pgrid{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:20px}
.pcell{background:#FBF7EC;border-radius:10px;padding:11px 13px}
.pcell span{font-size:9.5px;font-weight:800;letter-spacing:1px;color:#A79C7C;display:block}
.pcell b{font-size:14px}
.stamp{position:absolute;right:30px;bottom:26px;width:86px;height:86px;border:4px solid rgba(46,194,126,.5);border-radius:50%;
  display:grid;place-items:center;color:rgba(31,161,101,.7);font-family:var(--disp);font-size:13px;font-weight:700;
  transform:rotate(-13deg);letter-spacing:1px}
/* doc meta / ask */
.docmeta{background:var(--card);border:2px solid var(--line);border-radius:20px;padding:20px;box-shadow:0 4px 0 var(--line)}
.docmeta h3{font-family:var(--disp);font-size:19px}
.docmeta .path{font-size:12px;font-weight:800;color:#5B4BC4;background:#EFE9FB;border-radius:8px;padding:4px 10px;display:inline-block;margin-top:6px}
.facts{display:flex;flex-wrap:wrap;gap:7px;margin:13px 0}
.fact{font-size:12px;font-weight:800;background:var(--cream);border:2px solid var(--line);border-radius:99px;padding:6px 12px}
.fact.hl{background:#FFE9B8;border-color:#F3D389;color:#8A5A00}
.dlist{border:2px solid var(--line);border-radius:14px;overflow:hidden;margin-bottom:13px}
.drow{display:flex;justify-content:space-between;padding:9px 14px;font-size:13px;border-bottom:2px solid #F7EFDC}
.drow:last-child{border-bottom:none}
.drow span{color:var(--muted);font-weight:700}
.drow b{color:var(--ink)}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:15px}
.tag{font-size:11px;font-weight:800;background:#D7EEFF;color:#0F6AA8;border-radius:7px;padding:4px 10px}
.askbox{border:2px solid #DCD3F8;background:#FBFAFF;border-radius:16px;padding:13px}
.askbox h4{font-family:var(--disp);font-size:14.5px;color:#5B4BC4;margin-bottom:9px}
.chat{max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:9px;margin-bottom:9px}
.bub{max-width:88%;padding:9px 13px;border-radius:14px;font-size:13px;line-height:1.5;font-weight:600}
.bub.user{align-self:flex-end;background:var(--marigold);color:var(--ink);border-bottom-right-radius:4px}
.bub.ai{align-self:flex-start;background:#fff;border:2px solid #E8E2F8;border-bottom-left-radius:4px}
.cite{display:inline-block;margin-top:7px;font-size:10px;font-weight:800;background:#D6F5E3;color:#0B7A50;border-radius:6px;padding:3px 8px}
.typing{display:flex;gap:4px;padding:11px 13px}
.typing i{width:6px;height:6px;border-radius:50%;background:#B7A9E0;animation:blink 1s infinite}
.typing i:nth-child(2){animation-delay:.18s}.typing i:nth-child(3){animation-delay:.36s}
@keyframes blink{50%{opacity:.25;transform:translateY(-3px)}}
.askchips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:9px}
.askchips .chip{font-size:11px;padding:5px 11px}
.askinput{display:flex;gap:8px}
.askinput input{flex:1;border:2px solid #E8E2F8;border-radius:99px;padding:9px 15px;font-family:var(--body);
  font-weight:700;font-size:12.5px;outline:none;background:#fff;color:var(--ink)}
.askinput input:focus{border-color:var(--grape)}
.askinput button{width:38px;height:38px;border-radius:50%;background:var(--grape);border:none;color:#fff;font-size:14px;
  box-shadow:0 3px 0 #6F5EDB;flex-shrink:0}
/* ---------- modals ---------- */
.dim{position:fixed;inset:0;background:rgba(13,43,37,.45);opacity:0;pointer-events:none;transition:opacity .25s;z-index:80}
.dim.show{opacity:1;pointer-events:auto}
.modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-46%) scale(.96);width:480px;max-width:92vw;
  background:var(--cream);border-radius:26px;padding:28px;z-index:90;opacity:0;pointer-events:none;
  transition:all .28s cubic-bezier(.3,1.3,.4,1);box-shadow:0 30px 70px rgba(13,43,37,.4);max-height:88vh;overflow-y:auto;
  background-image:radial-gradient(rgba(20,58,50,.04) 1px, transparent 1.4px);background-size:18px 18px}
.modal.show{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}
.modal h3{font-family:var(--disp);font-size:23px;text-align:center}
.msub{text-align:center;font-size:13px;color:var(--muted);font-weight:600;margin-top:4px}
.procfile{display:inline-flex;align-items:center;gap:9px;background:#FFFDF6;border:2px solid var(--line);
  border-radius:13px;padding:10px 15px;font-weight:800;font-size:13px;box-shadow:0 3px 0 var(--line);
  max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mcenter{text-align:center}
.procspark{font-size:32px;margin:16px 0 2px;display:inline-block;animation:twinkle 1.4s infinite}
.steps{margin-top:18px;text-align:left}
.step{display:flex;align-items:center;gap:12px;padding:8px 4px;font-size:14.5px;font-weight:700;color:#C4B691;transition:color .3s}
.step .dot{width:24px;height:24px;border-radius:50%;border:2.5px solid #E3D5B6;display:grid;place-items:center;
  font-size:12px;flex-shrink:0;background:#FFFDF6;transition:all .3s}
.step.active{color:var(--ink)}
.step.active .dot{border-color:var(--marigold);border-top-color:transparent;background:var(--marigold);animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.step.done{color:var(--ink)}
.step.done .dot{border-color:var(--mint);background:var(--mint);color:#06301E}
.pbar{height:12px;background:#F2E7CB;border-radius:99px;margin-top:16px;overflow:hidden}
.pbar i{display:block;height:100%;width:0;background:var(--marigold);border-radius:99px;transition:width .45s}
.pct{font-size:12px;font-weight:800;color:var(--muted);margin-top:7px}
.mcancel{display:block;margin:14px auto 0;background:none;border:none;font-size:12.5px;font-weight:800;color:#A9B8AE}
.mcancel:hover{color:var(--coral-d)}
/* result phase */
.resbig{font-family:var(--disp);font-size:31px;text-align:center}
.resbig em{font-style:normal;display:inline-block;animation:wig 1.2s}
@keyframes wig{25%{transform:rotate(14deg)}50%{transform:rotate(-10deg)}75%{transform:rotate(7deg)}}
.heroline{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:14px}
.heroline .fact{font-size:12.5px}
.savedto{display:flex;align-items:center;justify-content:center;gap:8px;font-size:13px;font-weight:700;color:var(--muted);margin-top:14px;flex-wrap:wrap}
.fold{background:#EFE9FB;color:#5B4BC4;border-radius:8px;padding:4px 11px;font-weight:800;font-size:12px}
.drv{background:#D6F5E3;color:#0B7A50;border-radius:8px;padding:4px 11px;font-weight:800;font-size:12px}
.mbtns{display:flex;gap:9px;margin-top:18px}
.mbtns .btn{flex:1}
/* QR */
.qr{display:grid;grid-template-columns:repeat(19,9px);grid-auto-rows:9px;gap:0;width:fit-content;margin:18px auto 6px;
  background:#fff;padding:12px;border-radius:14px;border:2px solid var(--line);box-shadow:0 4px 0 var(--line)}
.qr i{background:#fff}.qr i.d{background:var(--ink);border-radius:1.5px}
/* settings */
.setrow{display:flex;align-items:center;gap:13px;background:#FFFDF6;border:2px solid var(--line);border-radius:15px;
  padding:13px 15px;margin-top:10px;box-shadow:0 3px 0 var(--line)}
.setrow .em{font-size:20px}
.setrow b{font-size:14px;display:block}
.setrow small{font-size:11.5px;color:var(--muted);font-weight:700}
.setrow .end{margin-left:auto}
.okpill{background:#D6F5E3;color:#0B7A50;font-size:11.5px;font-weight:800;border-radius:99px;padding:5px 12px}
.switch{width:46px;height:27px;border-radius:99px;background:#E3D5B6;position:relative;cursor:pointer;transition:background .2s;flex-shrink:0}
.switch::after{content:"";position:absolute;top:3px;left:3px;width:21px;height:21px;border-radius:50%;background:#fff;
  transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.switch.on{background:var(--mint)}.switch.on::after{left:22px}
.privnote{font-size:12px;color:var(--muted);font-weight:700;line-height:1.6;background:#FFF6E0;border-radius:12px;padding:12px 14px;margin-top:14px}
/* drop veil */
.veil{position:fixed;inset:0;z-index:95;background:rgba(255,246,230,.92);display:none;place-items:center;pointer-events:none}
.veil.show{display:grid}
.veilbox{border:4px dashed var(--marigold);border-radius:34px;padding:70px 110px;text-align:center;background:#FFF3D1;
  animation:pulse .8s infinite alternate}
@keyframes pulse{to{transform:scale(1.02)}}
.veilbox .big{font-size:60px}
.veilbox h2{font-family:var(--disp);font-size:34px;margin-top:8px}
.veilbox p{font-weight:700;color:#8A6A1A}
/* toast & confetti */
.toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(24px);background:var(--ink);color:var(--cream);
  font-size:13.5px;font-weight:800;padding:12px 22px;border-radius:99px;opacity:0;transition:all .3s;z-index:100;
  white-space:nowrap;box-shadow:0 10px 26px rgba(13,43,37,.35);pointer-events:none}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.cfbox{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:110}
.cf{position:absolute;width:10px;height:14px;top:-18px;border-radius:2px;animation:fall linear forwards}
@keyframes fall{to{transform:translateY(105vh) rotate(600deg)}}
/* mock pill */
.mockpill{position:fixed;right:18px;bottom:18px;background:var(--card);border:2px solid var(--line);border-radius:99px;
  padding:9px 17px;font-size:12px;font-weight:800;color:var(--muted);box-shadow:0 4px 0 var(--line);z-index:70;cursor:pointer;transition:transform .15s}
.mockpill:hover{transform:translateY(-3px);color:var(--ink)}
/* responsive */
@media(max-width:1120px){.cols{grid-template-columns:1fr}.docgrid{grid-template-columns:1fr}}
@media(max-width:960px){
  .app{grid-template-columns:66px 1fr}
  .snav span.lbl,.scat span.lbl,.scat .cnt,.slabel,.snew,.drivecard,.kbdhint{display:none}
  .snav{justify-content:center}.scat{justify-content:center;font-size:18px}
}
</style>
</head>
<body>

<!-- ================= TOPBAR ================= -->
<header class="topbar">
  <div class="brand">
    <div class="mark">
      <svg width="22" height="22" viewBox="0 0 26 26"><path d="M4 2h13l5 5v17H4z" fill="#FFFDF6"/><path d="M17 2v5h5" fill="#E8B400"/><circle cx="9.5" cy="13" r="1.4" fill="#143A32"/><circle cx="16.5" cy="13" r="1.4" fill="#143A32"/><path d="M9 17.5q4 3.4 8 0" stroke="#143A32" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>
    </div>
    Docly
  </div>
  <div class="searchwrap">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E8078" stroke-width="2.4"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>
    <input id="q" placeholder="What are you looking for? Try “car insurance”…" autocomplete="off">
    <kbd>/</kbd>
  </div>
  <div class="topbtns">
    <div class="addwrap">
      <button class="btn primary small" id="addBtn" onclick="toggleAdd(event)">＋ Add</button>
      <div class="pop" id="addPop">
        <button class="opt" onclick="closeAdd();filepick.click()"><span class="em" style="background:#FFE9B8">📁</span><div><b>Upload files</b><span>PDFs, images, anything</span></div></button>
        <button class="opt" onclick="closeAdd();toast('Picking from your Google Drive… ☁️');setTimeout(()=>startOrganize('Tata_AIG_policy.pdf'),900)"><span class="em" style="background:#D6F5E3">☁️</span><div><b>Import from Google Drive</b><span>Files already in your Drive</span></div></button>
        <button class="opt" onclick="closeAdd();openModal('qrModal')"><span class="em" style="background:#D7EEFF">📱</span><div><b>Scan with phone</b><span>Camera lives there — pair it</span></div></button>
      </div>
    </div>
    <button class="iconbtn" onclick="showView('inbox')" title="Inbox">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3.5 13 6 4.5h12L20.5 13"/><path d="M3.5 13v5.5h17V13"/><path d="M3.5 13h5l1.6 2.5h3.8L15.5 13h5"/></svg>
      <span class="badge" id="badgeTop">3</span>
    </button>
    <div class="avatar" onclick="openModal('setModal')">A</div>
  </div>
</header>

<div class="app">
  <!-- ================= SIDEBAR ================= -->
  <nav class="sidebar">
    <button class="snav on" id="nav-home" onclick="showView('home')">🏠 <span class="lbl">Home</span></button>
    <button class="snav" id="nav-inbox" onclick="showView('inbox')">📥 <span class="lbl">Inbox</span><span class="badge" id="badgeSide">3</span></button>
    <div class="slabel">Your documents</div>
    <button class="scat" data-cat="Bills" onclick="filterCat('Bills')">🧾 <span class="lbl">Bills</span><span class="cnt">24</span></button>
    <button class="scat" data-cat="Finance" onclick="filterCat('Finance')">🏦 <span class="lbl">Finance</span><span class="cnt">18</span></button>
    <button class="scat" data-cat="Vehicle" onclick="filterCat('Vehicle')">🚗 <span class="lbl">Vehicle</span><span class="cnt">8</span></button>
    <button class="scat" data-cat="Home" onclick="filterCat('Home')">🏠 <span class="lbl">Home</span><span class="cnt">12</span></button>
    <button class="scat" data-cat="Insurance" onclick="filterCat('Insurance')">🛡️ <span class="lbl">Insurance</span><span class="cnt">6</span></button>
    <button class="scat" data-cat="Purchases" onclick="filterCat('Purchases')">🛒 <span class="lbl">Purchases</span><span class="cnt">7</span></button>
    <button class="scat" data-cat="Other" onclick="filterCat('Other')">📦 <span class="lbl">Other</span><span class="cnt">9</span></button>
    <button class="snew" onclick="toast('Custom categories — coming soon 🏷️')">＋ New category</button>
    <div class="spacer"></div>
    <div class="drivecard">
      <b>☁️ Google Drive <span class="ok">✓</span></b>
      <small>My Drive / Docly · 6.2 GB of 15 GB</small>
      <div class="sbar"><i></i></div>
    </div>
    <div class="kbdhint">Press <kbd>/</kbd> to search<br><kbd>Esc</kbd> closes anything</div>
  </nav>

  <!-- ================= MAIN ================= -->
  <main>
    <!-- HOME -->
    <section class="view active" id="view-home">
      <div class="hrow">
        <div>
          <h1 class="hello">Good evening, Anirudh 👋</h1>
          <p class="sub">128 documents — every single one findable.</p>
        </div>
        <span class="datechip">Saturday, 3 October · 20:16</span>
      </div>

      <div class="dropzone" id="dropzone">
        <div class="dzicon">
          <svg width="34" height="34" viewBox="0 0 26 26"><path d="M4 2h13l5 5v17H4z" fill="#FFFDF6"/><path d="M17 2v5h5" fill="#E8B400"/><path d="M8 12h10M8 16h10M8 20h6" stroke="#143A32" stroke-width="1.9" stroke-linecap="round"/></svg>
        </div>
        <h2>Drop anything here</h2>
        <p>PDFs, photos, scans — Docly reads them, names them, and files them. The file itself stays in <b>your</b> Google Drive. Seriously, drag a file onto this page and watch.</p>
        <div class="dzbtns">
          <button class="btn primary" onclick="filepick.click()">📁 Browse files</button>
          <button class="btn ghost" onclick="toast('Picking from your Google Drive… ☁️');setTimeout(()=>startOrganize('Tata_AIG_policy.pdf'),900)">☁️ From Google Drive</button>
          <button class="btn ghost" onclick="openModal('qrModal')">📱 Scan with phone</button>
        </div>
      </div>

      <div class="cols">
        <div>
          <div class="section-h">Recently added <a onclick="toast('That’s everything — 128 and counting')">See all</a></div>
          <div class="chips" id="chips"></div>
          <div class="dgrid" id="dgrid"></div>
        </div>
        <aside>
          <div class="railcard">
            <h4>⏰ Coming up</h4>
            <div class="due"><span class="em">🌫️</span><div><b>PUC certificate</b><small>Expires 12 Dec 2026</small></div><span class="duepill warn">2 months</span></div>
            <div class="due"><span class="em">🚗</span><div><b>Car insurance</b><small>Renews 23 Sep 2027</small></div><span class="duepill ok">11 months</span></div>
            <div class="due"><span class="em">📄</span><div><b>Passport</b><small>Expires 14 Jun 2034</small></div><span class="duepill ok">8 years</span></div>
          </div>
          <div class="railcard">
            <h4>✨ Ask across everything</h4>
            <button class="prompt" onclick="toast('✨ Cross-document answers arrive in V2 — the mock says hi!')">“How much did I spend on insurance this year?”</button>
            <button class="prompt" onclick="toast('✨ Coming in V2 — one question, your whole car history.')">“Show me everything about my car”</button>
            <button class="prompt" onclick="toast('✨ V2 — but imagine it: every receipt, summed.')">“All Amazon purchases last month?”</button>
          </div>
        </aside>
      </div>
    </section>

    <!-- SEARCH -->
    <section class="view" id="view-search">
      <h1 class="hello">Search 🔍</h1>
      <div class="nl-line">✨ I search <b>&nbsp;meanings, OCR text, filenames and your Drive&nbsp;</b> — not just keywords.</div>
      <div class="chips">
        <span class="chip" onclick="chip('car insurance')">car insurance</span>
        <span class="chip" onclick="chip('expiring')">expiring</span>
        <span class="chip" onclick="chip('HDFC statement')">HDFC statement</span>
        <span class="chip" onclick="chip('Amazon')">Amazon</span>
        <span class="chip" onclick="chip('passport')">passport</span>
      </div>
      <div class="rescount" id="rescount"></div>
      <div id="results"></div>
    </section>

    <!-- INBOX -->
    <section class="view" id="view-inbox">
      <h1 class="hello">Inbox 📥</h1>
      <p class="sub" id="inboxSub">3 things need your attention — I didn’t want to guess.</p>
      <div style="height:18px"></div>

      <div class="icard" id="ic1">
        <span class="em" style="background:#FFE9B8">🧾</span>
        <div class="mid">
          <b>Electricity bill — BESCOM</b>
          <div class="meta">September · ₹1,240 · shared from WhatsApp</div>
          <div class="ailine">✨<div>Pretty sure this is a bill. Save it to <b>&nbsp;Bills / Utilities&nbsp;</b>?</div></div>
          <div class="rowbtns">
            <button class="btn green small" onclick="resolve('ic1','Saved to Bills ✓')">✓ Looks right</button>
            <button class="btn ghost small" onclick="togglePick('pk1')">Change</button>
          </div>
          <div class="catpick" id="pk1"></div>
        </div>
        <div class="side"><span class="conf hi">98% sure</span></div>
      </div>

      <div class="icard" id="ic2">
        <span class="em" style="background:#EFEAD9">📄</span>
        <div class="mid">
          <b>Unknown document</b>
          <div class="meta">scan_0042.pdf · scanned today</div>
          <div class="ailine">🤔<div>I couldn’t identify this one. Where should it live?</div></div>
          <button class="btn ghost small" onclick="togglePick('pk2')">Choose category</button>
          <div class="catpick" id="pk2"></div>
        </div>
        <div class="side"><span class="conf lo">63% sure</span></div>
      </div>

      <div class="icard" id="ic3">
        <span class="em" style="background:#FFE9B8">🧾</span>
        <div class="mid">
          <b>Amazon Invoice (again?)</b>
          <div class="meta">shared from Chrome</div>
          <div class="ailine">👀<div>This looks like a duplicate of <b>&nbsp;“Amazon Invoice — Sep 2026”</b>. Keep both?</div></div>
          <div class="rowbtns">
            <button class="btn green small" onclick="resolve('ic3','Kept both — linked together 🔗')">Keep both</button>
            <button class="btn ghost small" onclick="resolve('ic3','Duplicate skipped 🗑️')">Skip</button>
          </div>
        </div>
        <div class="side"><span class="conf hi">dupe?</span></div>
      </div>

      <div class="inboxempty" id="inboxEmpty">
        <div class="big">🎉</div><h3>All clear!</h3><p>Nothing needs you right now. Back to your evening.</p>
      </div>
    </section>

    <!-- DOCUMENT -->
    <section class="view" id="view-doc">
      <div class="docbar">
        <button class="backbtn" onclick="showView('home')">← Back</button>
        <h2>Tata AIG Car Insurance</h2>
        <button class="btn ghost small" onclick="toast('Opening in Google Drive… ☁️')">☁️ Open in Drive</button>
        <button class="btn ghost small" onclick="toast('Downloading… (it comes straight from your Drive)')">⬇ Download</button>
        <button class="iconbtn" onclick="toast('Move · Rename · Archive · Delete AI data…')">⋮</button>
      </div>
      <div class="docgrid">
        <div class="preview">
          <div class="pager">
            <button onclick="page(-1)">‹</button><span id="pgnum">Page 1 of 3</span><button onclick="page(1)">›</button>
          </div>
          <div class="pdfpage">
            <div class="phead"><div class="plogo">TA</div><div><b>TATA AIG</b><span>GENERAL INSURANCE CO. LTD.</span></div></div>
            <div class="ptitle" id="ptitle">Motor Insurance Policy — Schedule</div>
            <div id="plines"></div>
            <div class="pgrid" id="pgridbox"></div>
            <div class="stamp">ACTIVE ✓</div>
          </div>
        </div>
        <aside class="docmeta">
          <h3>Tata AIG Car Insurance</h3>
          <span class="path">🛡️ Insurance / Vehicle</span>
          <div class="facts">
            <span class="fact hl">🗓 24 Sep 2026 → 23 Sep 2027</span>
            <span class="fact">🚙 23 BH 764</span>
            <span class="fact">💰 ₹18,450</span>
          </div>
          <div class="dlist">
            <div class="drow"><span>Company</span><b>Tata AIG</b></div>
            <div class="drow"><span>Type</span><b>Insurance</b></div>
            <div class="drow"><span>Policy №</span><b>TAG-88231</b></div>
            <div class="drow"><span>Confidence</span><b>98% ✨</b></div>
          </div>
          <div class="tags"><span class="tag">#car</span><span class="tag">#insurance</span><span class="tag">#2026</span><span class="tag">#tata-aig</span></div>
          <div class="askbox">
            <h4>✨ Ask this document</h4>
            <div class="chat" id="chat"></div>
            <div class="askchips">
              <span class="chip" onclick="askQA(0)">Expiry date?</span>
              <span class="chip" onclick="askQA(1)">Insured amount?</span>
              <span class="chip" onclick="askQA(2)">Roadside help?</span>
            </div>
            <div class="askinput">
              <input id="askText" placeholder="Ask anything about this policy…" onkeydown="if(event.key==='Enter')freeAsk()">
              <button onclick="freeAsk()">➤</button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </main>
</div>

<!-- ================= MODALS ================= -->
<div class="dim" id="dim" onclick="closeAll()"></div>

<div class="modal" id="orgModal">
  <div id="ophase1">
    <h3>✨ Organising…</h3>
    <p class="msub">You can carry on — I’ll ping you when I’m done.</p>
    <div class="mcenter" style="margin-top:16px"><span class="procfile" id="orgFile">📄 document.pdf</span></div>
    <div class="procspark">✨</div>
    <div class="steps" id="steps">
      <div class="step"><span class="dot"></span>Reading document</div>
      <div class="step"><span class="dot"></span>Identifying document</div>
      <div class="step"><span class="dot"></span>Extracting details</div>
      <div class="step"><span class="dot"></span>Finding dates</div>
      <div class="step"><span class="dot"></span>Organizing</div>
    </div>
    <div class="pbar"><i id="pfill"></i></div>
    <div class="pct mcenter" id="pct">0%</div>
    <button class="mcancel" onclick="closeAll();toast('Running in the background — I’ll finish it anyway 😉')">Do this in the background</button>
  </div>
  <div id="ophase2" style="display:none">
    <div class="resbig">Got it! <em>🎉</em></div>
    <p class="msub" id="resSub">I know exactly what this is.</p>
    <div class="mcenter" style="margin-top:16px">
      <div style="font-size:52px" id="resEmoji">🚗</div>
      <h3 style="margin-top:6px" id="resTitle">Car Insurance — Tata AIG</h3>
      <p class="msub" id="resRename">Renamed to “Tata AIG Car Insurance — 2026.pdf”</p>
    </div>
    <div class="heroline" id="resFacts"></div>
    <div class="savedto">Saved to <span class="fold" id="resFold">🛡 Insurance / Vehicle</span><span class="drv">☁️ in your Google Drive</span></div>
    <div class="savedto" style="margin-top:8px;font-size:12px">Everything looks right?</div>
    <div class="mbtns">
      <button class="btn green" onclick="confirmOrg()">✓ Yes, perfect</button>
      <button class="btn ghost" onclick="notQuite()">Not quite…</button>
    </div>
    <button class="btn ghost" style="width:100%;margin-top:9px" onclick="closeAll();openDoc()">Open document</button>
  </div>
</div>

<div class="modal" id="qrModal">
  <h3>Scan with your phone 📱</h3>
  <p class="msub">The camera lives in your pocket — pair it once, scan forever.</p>
  <div class="qr" id="qr"></div>
  <p class="msub">Open Docly on your phone → it picks this session up automatically.<br>Scans appear here the moment you finish.</p>
  <div class="mbtns"><button class="btn primary" onclick="closeAll()">Done</button></div>
</div>

<div class="modal" id="setModal">
  <h3>Settings</h3>
  <div class="setrow"><span class="em">☁️</span><div><b>Google Drive</b><small>anirudh@gmail.com · My Drive / Docly</small></div><span class="end okpill">Connected ✓</span></div>
  <div class="setrow"><span class="em">🤖</span><div><b>Auto-organise new documents</b><small>High confidence → filed silently</small></div><span class="end"><div class="switch on" onclick="this.classList.toggle('on')"></div></span></div>
  <div class="setrow"><span class="em">🔔</span><div><b>Expiry reminders</b><small>30 days before a date hits</small></div><span class="end"><div class="switch on" onclick="this.classList.toggle('on')"></div></span></div>
  <div class="setrow"><span class="em">🔐</span><div><b>Delete AI data</b><small>Clears OCR text, embeddings & summaries</small></div><span class="end"><button class="btn ghost small" onclick="toast('AI data cleared — files stay in Drive 🔒')">Clear</button></span></div>
  <div class="privnote">🔒 <b>Privacy by design:</b> Docly uses the narrow <b>drive.file</b> scope — it only ever sees files you hand it. Index my whole Drive is an explicit opt-in, off by default.</div>
  <div class="mbtns"><button class="btn primary" onclick="closeAll()">Done</button></div>
</div>

<div class="veil" id="veil"><div class="veilbox"><div class="big">🎯</div><h2>Drop it!</h2><p>I’ll read it, name it, and file it ✨</p></div></div>
<div class="toast" id="toast"></div>
<div class="cfbox" id="cfbox"></div>
<div class="mockpill" id="mockpill" onclick="this.remove()">HTML mock · drag any file onto the page ✨ · press / to search</div>
<input type="file" id="filepick" hidden onchange="if(this.files[0])startOrganize(this.files[0].name);this.value=''">

<script>
/* ---------- data ---------- */
const DOCS=[
 {e:'🚗',bg:'#D7EEFF',t:'Tata AIG Car Insurance',path:'Insurance / Vehicle',time:'2 hrs ago',type:'PDF',cat:'Insurance',k:'car insurance tata vehicle policy',note:'Expires 23 Sep 2027'},
 {e:'🏦',bg:'#D6F5E3',t:'HDFC Statement — Sep 2026',path:'Finance / Bank',time:'Yesterday',type:'PDF',cat:'Finance',k:'hdfc statement bank finance'},
 {e:'🧾',bg:'#FFE9B8',t:'Amazon Invoice — ANC Headphones',path:'Purchases / Invoice',time:'Yesterday',type:'PDF',cat:'Purchases',k:'amazon invoice purchase shopping headphones',note:'₹7,999'},
 {e:'🌫️',bg:'#EFEAD9',t:'PUC Certificate',path:'Vehicle / Certificates',time:'3 days ago',type:'PDF',cat:'Vehicle',k:'puc pollution certificate vehicle expiring',note:'Expires 12 Dec 2026'},
 {e:'⚡',bg:'#FFE0D6',t:'BESCOM Electricity Bill',path:'Bills / Utilities',time:'4 days ago',type:'IMG',cat:'Bills',k:'bescom electricity bill utilities expiring'},
 {e:'🪪',bg:'#D7EEFF',t:'Car RC — 23 BH 764',path:'Vehicle / Registration',time:'Last week',type:'IMG',cat:'Vehicle',k:'car rc registration vehicle 23bh'},
 {e:'📄',bg:'#E8E1FF',t:'Passport',path:'Personal / Identity',time:'Last week',type:'IMG',cat:'Other',k:'passport personal travel identity expiring',note:'Expires 2034'},
 {e:'🏠',bg:'#FFE0D6',t:'Rent Agreement 2026–27',path:'Home / Legal',time:'2 weeks ago',type:'PDF',cat:'Home',k:'rent agreement home legal lease'},
 {e:'🚗',bg:'#D7EEFF',t:'Previous Car Insurance — ICICI',path:'Insurance / Vehicle',time:'3 weeks ago',type:'PDF',cat:'Insurance',k:'car insurance icici lombard vehicle previous old',note:'Expired'},
 {e:'📶',bg:'#FFE9B8',t:'ACT Fibernet Bill — Aug',path:'Bills / Utilities',time:'1 month ago',type:'PDF',cat:'Bills',k:'act fibernet wifi bill internet utilities'},
];
const CHIPS=['All','Bills','Finance','Vehicle','Home','Insurance','Purchases','Other'];
const CATS=[['🧾','Bills'],['🏦','Finance'],['🚗','Vehicle'],['🏠','Home'],['🛡️','Insurance'],['💼','Work'],['📜','Legal'],['📦','Other']];
let activeCat='All', curView='home', inboxCount=3;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

/* ---------- toast & confetti ---------- */
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2300);}
function confetti(n=80){const box=$('#cfbox'),c=['#FFB700','#FF6B57','#2EC27E','#3FB5F2','#8B7CF6'];
 for(let i=0;i<n;i++){const p=document.createElement('i');p.className='cf';p.style.left=Math.random()*100+'vw';
 p.style.background=c[i%c.length];p.style.animationDuration=(1+Math.random())+'s';p.style.animationDelay=(Math.random()*.4)+'s';
 box.appendChild(p);setTimeout(()=>p.remove(),2600);}}

/* ---------- views ---------- */
function showView(v){curView=v;$$('.view').forEach(x=>x.classList.remove('active'));$('#view-'+v).classList.add('active');
 $('#nav-home').classList.toggle('on',v==='home'||v==='doc'||v==='search');
 $('#nav-inbox').classList.toggle('on',v==='inbox');
 if(v!=='search'&&!$('#q').value)$('#q').blur();
 document.querySelector('main').scrollTo({top:0});}
function openDoc(){showView('doc');renderPage();if(!$('#chat').children.length)setTimeout(()=>askQA(0),500);}

/* ---------- home grid ---------- */
function renderChips(){$('#chips').innerHTML=CHIPS.map(c=>`<span class="chip ${c===activeCat?'on':''}" onclick="filterCat('${c}')">${c}</span>`).join('');}
function renderGrid(){
 const list=activeCat==='All'?DOCS:DOCS.filter(d=>d.cat===activeCat);
 $('#dgrid').innerHTML=list.map(d=>`<article class="dcard" onclick="openDoc()">
   <div class="dthumb" style="background:${d.bg}">${d.e}<span class="ft">${d.type}</span></div>
   <b>${d.t}</b><span>${d.path} · ${d.time}</span></article>`).join('');}
function filterCat(c){activeCat=c;$$('.scat').forEach(b=>b.classList.toggle('on',b.dataset.cat===c));
 renderChips();renderGrid();showView('home');}

/* ---------- search ---------- */
$('#q').addEventListener('input',e=>{const v=e.target.value.trim();
 if(v){showView('search');runSearch(v);}else if(curView==='search'){showView('home');}});
$('#q').addEventListener('keydown',e=>{if(e.key==='Escape'){e.target.value='';e.target.blur();showView('home');}});
function chip(v){$('#q').value=v;showView('search');runSearch(v);}
function runSearch(q){
 q=q.toLowerCase();const toks=q.split(/\s+/);
 const list=DOCS.map(d=>({...d,score:toks.filter(t=>(d.t+' '+d.path+' '+d.k).toLowerCase().includes(t)).length}))
   .filter(d=>d.score>0).sort((a,b)=>b.score-a.score);
 $('#rescount').textContent=list.length?('✨ '+list.length+' result'+(list.length>1?'s':'')+' — searched meanings, OCR text & Drive'):'No matches — yet';
 $('#results').innerHTML=list.map(d=>`<div class="resrow" onclick="openDoc()">
   <span class="em" style="background:${d.bg}">${d.e}</span>
   <div><b>${d.t}</b><div class="meta">${d.path} · ${d.time}</div></div>
   <div class="right"><span class="ftag ${d.type==='PDF'?'pdf':'img'}">${d.type}</span>${d.note?`<span class="exp">${d.note}</span>`:''}</div></div>`).join('')
 ||'<div class="ailine">🤷<div>Nothing found. Try plainer words — “car stuff”, “money things” — I speak human.</div></div>';}

/* ---------- add popover & modals ---------- */
function toggleAdd(e){e.stopPropagation();$('#addPop').classList.toggle('show');}
function closeAdd(){$('#addPop').classList.remove('show');}
document.addEventListener('click',e=>{if(!e.target.closest('.addwrap'))closeAdd();});
function openModal(id){$('#dim').classList.add('show');$('#'+id).classList.add('show');}
function closeAll(){$('#dim').classList.remove('show');$$('.modal').forEach(m=>m.classList.remove('show'));}

/* ---------- organize flow ---------- */
let procToken=0, orgName='document.pdf';
const RESULTS={
 ins:{e:'🚗',t:'Car Insurance — Tata AIG',ren:'Renamed to “Tata AIG Car Insurance — 2026.pdf”',fold:'🛡️ Insurance / Vehicle',
      facts:['🗓 24 Sep 2026 → 23 Sep 2027','💰 ₹18,450','🚙 23 BH 764'],
      card:{e:'🚗',bg:'#D7EEFF',t:'Tata AIG Car Insurance',path:'Insurance / Vehicle',cat:'Insurance'}},
 bill:{e:'⚡',t:'Electricity Bill — BESCOM',ren:'Renamed to “BESCOM Electricity Bill — Sep 2026.pdf”',fold:'🧾 Bills / Utilities',
      facts:['🗓 September 2026','💰 ₹1,240','⏰ Due 15 Oct'],
      card:{e:'⚡',bg:'#FFE0D6',t:'BESCOM Electricity Bill — Sep',path:'Bills / Utilities',cat:'Bills'}}};
function pickResult(n){n=n.toLowerCase();return /(bill|bescom|electric|invoice|receipt)/.test(n)?RESULTS.bill:RESULTS.ins;}
function startOrganize(name){
 orgName=name;$('#orgFile').textContent='📄 '+name;
 $('#ophase1').style.display='block';$('#ophase2').style.display='none';
 openModal('orgModal');runSteps();}
function runSteps(){
 procToken++;const tk=procToken;const steps=$$('#steps .step');
 steps.forEach(s=>{s.classList.remove('active','done');s.querySelector('.dot').textContent='';});
 $('#pfill').style.width='0%';$('#pct').textContent='0%';
 const durs=[700,800,900,700,800];let t=350,done=0;
 durs.forEach((d,i)=>{
  setTimeout(()=>{if(tk!==procToken)return;steps[i].classList.add('active');},t);t+=d;
  setTimeout(()=>{if(tk!==procToken)return;steps[i].classList.remove('active');steps[i].classList.add('done');
   steps[i].querySelector('.dot').textContent='✓';done++;
   const p=Math.round(done/5*100);$('#pfill').style.width=p+'%';$('#pct').textContent=p+'%';
   if(done===5)setTimeout(()=>{if(tk===procToken)showResult();},500);},t);});}
function showResult(){const r=pickResult(orgName);
 $('#resEmoji').textContent=r.e;$('#resTitle').textContent=r.t;$('#resRename').textContent=r.ren;
 $('#resFacts').innerHTML=r.facts.map(f=>`<span class="fact">${f}</span>`).join('');
 $('#resFold').textContent=r.fold;
 $('#ophase1').style.display='none';$('#ophase2').style.display='block';}
function confirmOrg(){
 const r=pickResult(orgName);confetti();closeAll();toast('Saved to '+r.fold.replace(/^[^\s]+\s/,'')+' ✓');
 DOCS.unshift({...r.card,time:'Just now',type:'PDF',k:r.card.t.toLowerCase()});
 activeCat='All';renderChips();renderGrid();
 const first=$('#dgrid .dcard');if(first)first.classList.add('pop-in');showView('home');}
function notQuite(){closeAll();inboxCount++;setBadges();toast('Moved to Inbox — tell me where it goes 📥');}

/* ---------- inbox ---------- */
function setBadges(){$('#badgeTop').textContent=inboxCount;$('#badgeSide').textContent=inboxCount;
 $('#badgeTop').style.display=$('#badgeSide').style.display=inboxCount?'grid':'none';
 $('#inboxSub').textContent=inboxCount?inboxCount+' things need your attention — I didn’t want to guess.':'All clear 🎉';}
function resolve(id,msg){const c=document.getElementById(id);c.classList.add('bye');
 setTimeout(()=>{c.style.display='none';inboxCount--;setBadges();toast(msg);
  if(inboxCount<=0)$('#inboxEmpty').style.display='block';},360);}
function togglePick(id){$('#'+id).classList.toggle('show');}
function pickCat(btn,cat){resolve(btn.closest('.icard').id,'Saved to '+cat+' ✓');}
$$('.catpick').forEach(pk=>{pk.innerHTML=CATS.map(c=>`<button onclick="pickCat(this,'${c[1]}')"><span>${c[0]}</span>${c[1]}</button>`).join('');});

/* ---------- doc pager ---------- */
let pg=1;
const PGTITLE=['Motor Insurance Policy — Schedule','Add-on Covers & Roadside Assistance','Premium Breakdown & Terms'];
const PGCELLS=[[['POLICY №','TAG-88231'],['VEHICLE','23 BH 764'],['PERIOD','24/09/26 – 23/09/27'],['IDV','₹6,40,000']],
 [['COVER','24×7 Roadside'],['TOWING','Up to 50 km'],['ENGINE PROTECT','Included'],['KEY LOSS','₹5,000']],
 [['PREMIUM','₹18,450'],['NCD','20%'],['GST','Included'],['MODE','Annual']]];
function renderPage(){
 $('#pgnum').textContent='Page '+pg+' of 3';$('#ptitle').textContent=PGTITLE[pg-1];
 const seed=pg*7;$('#plines').innerHTML=[0,1,2,3,4].map(i=>`<div class="pline" style="width:${62+((seed*i+13)%34)}%"></div>`).join('');
 $('#pgridbox').innerHTML=PGCELLS[pg-1].map(c=>`<div class="pcell"><span>${c[0]}</span><b>${c[1]}</b></div>`).join('');}
function page(d){pg=Math.min(3,Math.max(1,pg+d));renderPage();}

/* ---------- ask ---------- */
const QA=[
 {q:'What is the expiry date?',a:'Your Tata AIG policy expires on <b>23 September 2027</b> — about 11 months away. I can remind you 30 days before. 🔔',c:'Page 1 · Policy schedule'},
 {q:'What’s the insured amount?',a:'The IDV is <b>₹6,40,000</b>; annual premium <b>₹18,450</b> with a 20% no-claim discount.',c:'Page 3 · Premium breakdown'},
 {q:'Is roadside assistance included?',a:'Yes ✅ <b>24×7 roadside assistance</b> with towing up to 50 km is included.',c:'Page 2 · Add-on covers'}];
function askQA(i){pushQA(QA[i].q,QA[i].a,QA[i].c);}
function pushQA(q,a,c){const chat=$('#chat');
 chat.insertAdjacentHTML('beforeend',`<div class="bub user">${q}</div>`);
 const id='t'+Date.now();chat.insertAdjacentHTML('beforeend',`<div class="bub ai typing" id="${id}"><i></i><i></i><i></i></div>`);
 chat.scrollTo({top:chat.scrollHeight});
 setTimeout(()=>{const el=document.getElementById(id);if(!el)return;el.classList.remove('typing');
  el.innerHTML=a+(c?`<br><span class="cite">📎 ${c}</span>`:'');chat.scrollTo({top:chat.scrollHeight});},850);}
function freeAsk(){const i=$('#askText');const v=i.value.trim();if(!v)return;i.value='';
 pushQA(v,'Good question! In the real app I’d answer straight from this document — with page citations. (Still a mock here 🤖)',null);}

/* ---------- keyboard ---------- */
document.addEventListener('keydown',e=>{
 const typing=/INPUT|TEXTAREA/.test(document.activeElement.tagName);
 if(e.key==='/'&&!typing){e.preventDefault();$('#q').focus();}
 if(e.key==='Escape'){closeAll();closeAdd();}});

/* ---------- drag & drop ---------- */
let depth=0;
window.addEventListener('dragenter',e=>{e.preventDefault();depth++;$('#veil').classList.add('show');$('#dropzone').classList.add('drag');});
window.addEventListener('dragleave',e=>{e.preventDefault();depth=Math.max(0,depth-1);if(!depth){$('#veil').classList.remove('show');$('#dropzone').classList.remove('drag');}});
window.addEventListener('dragover',e=>e.preventDefault());
window.addEventListener('drop',e=>{e.preventDefault();depth=0;$('#veil').classList.remove('show');$('#dropzone').classList.remove('drag');
 const f=e.dataTransfer.files[0];startOrganize(f?f.name:'Shared document.pdf');});
$('#dropzone').addEventListener('dragenter',()=>$('#dropzone').classList.add('drag'));

/* ---------- fake QR ---------- */
(function(){const el=$('#qr');let h='';
 const finder=(r,c)=>{const zones=[[0,0],[0,12],[12,0]];
  for(const[zr,zc]of zones){if(r>=zr&&r<zr+7&&c>=zc&&c<zc+7){
   const rr=r-zr,cc=c-zc;return(rr===0||rr===6||cc===0||cc===6||(rr>=2&&rr<=4&&cc>=2&&cc<=4));}}return null;};
 for(let r=0;r<19;r++)for(let c=0;c<19;c++){const f=finder(r,c);
  const d=f!==null?f:((r*31+c*17+r*c)%7<3);h+=`<i class="${d?'d':''}"></i>`;}
 el.innerHTML=h;})();

/* ---------- init & ambience ---------- */
renderChips();renderGrid();setBadges();renderPage();
setTimeout(()=>toast('📱 “Aadhaar-card.jpg” shared from Pixel 8 — organised ✓'),9000);
</script>
</body>
</html>
