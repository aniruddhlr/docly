import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Radii } from '@/constants/theme';
import { DocumentItem } from '@docly/shared';
import { ArrowLeft, Send } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citation?: string;
  isTyping?: boolean;
}

interface AskSheetProps {
  visible: boolean;
  onClose: () => void;
  document: DocumentItem;
}

export function AskSheet({ visible, onClose, document }: AskSheetProps) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const defaultQA = document.askQA || [
    {
      question: 'What is the expiry date?',
      answer: 'This document indicates an active period until 23 September 2027. Reminders are configured automatically.',
      citation: 'Page 1 · Schedule',
    },
    {
      question: 'What is the covered amount?',
      answer: 'The declared insured value is ₹6,40,000 with comprehensive damage coverage.',
      citation: 'Page 2 · Policy terms',
    },
    {
      question: 'Is roadside assistance included?',
      answer: 'Yes, 24x7 roadside assistance and towing support are active add-ons.',
      citation: 'Page 3 · Add-on covers',
    },
  ];

  useEffect(() => {
    if (visible && messages.length === 0 && defaultQA.length > 0) {
      handleAskQuestion(defaultQA[0].question, defaultQA[0].answer, defaultQA[0].citation);
    }
  }, [visible]);

  const handleAskQuestion = (q: string, a: string, c?: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
    };

    const typingMsgId = `typing-${Date.now()}`;
    const typingMsg: Message = {
      id: typingMsgId,
      sender: 'ai',
      text: 'Reading document…',
      isTyping: true,
    };

    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingMsgId
            ? {
                id: `ai-${Date.now()}`,
                sender: 'ai',
                text: a,
                citation: c,
                isTyping: false,
              }
            : msg
        )
      );
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 900);
  };

  const handleSendCustomQuestion = () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');

    const foundMatch = defaultQA.find((item) =>
      text.toLowerCase().includes(item.question.toLowerCase().slice(0, 10))
    );

    const answer = foundMatch
      ? foundMatch.answer
      : `Based on ${document.title}, this policy is in good standing and registered to your vehicle. All verified details have been parsed and indexed.`;
    const citation = foundMatch ? foundMatch.citation : 'Page 1 · Parsed schedule';

    handleAskQuestion(text, answer, citation);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity activeOpacity={0.8} style={styles.backBtn} onPress={onClose}>
            <ArrowLeft size={20} color={Colors.ink} strokeWidth={2.4} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>✨ Ask this document</Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {document.title}
            </Text>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
        >
          {messages.map((item) => {
            const isUser = item.sender === 'user';
            return (
              <View
                key={item.id}
                style={[
                  styles.bubble,
                  isUser ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    isUser ? styles.userText : styles.aiText,
                  ]}
                >
                  {item.text}
                </Text>
                {item.citation && (
                  <View style={styles.citePill}>
                    <Text style={styles.citeText}>📎 {item.citation}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.chipsRow}>
          {defaultQA.map((qa, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={styles.chip}
              onPress={() => handleAskQuestion(qa.question, qa.answer, qa.citation)}
            >
              <Text style={styles.chipText}>{qa.question}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TextInput
            style={styles.input}
            placeholder="Ask anything about this document…"
            placeholderTextColor={Colors.muted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendCustomQuestion}
            returnKeyType="send"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.sendBtn}
            onPress={handleSendCustomQuestion}
          >
            <Send size={18} color={Colors.ink} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: Colors.line,
    backgroundColor: Colors.cream,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 18,
    color: Colors.ink,
  },
  headerSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 1,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    gap: 12,
  },
  bubble: {
    maxWidth: '82%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: Radii.lg,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.marigold,
    borderBottomRightRadius: 4,
    borderBottomWidth: 3,
    borderBottomColor: Colors.marigoldDark,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomLeftRadius: 4,
    borderBottomWidth: 3,
  },
  bubbleText: {
    fontFamily: Typography.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: Colors.ink,
  },
  aiText: {
    color: Colors.ink,
  },
  citePill: {
    marginTop: 8,
    backgroundColor: Colors.mintLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radii.sm,
    alignSelf: 'flex-start',
  },
  citeText: {
    fontFamily: Typography.bodyBold,
    fontSize: 11,
    color: Colors.mintText,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  chip: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    borderRadius: Radii.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: {
    fontFamily: Typography.bodyBold,
    fontSize: 12,
    color: Colors.ink,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 2,
    borderTopColor: Colors.line,
    backgroundColor: Colors.cream,
  },
  input: {
    flex: 1,
    height: 46,
    borderWidth: 2,
    borderColor: Colors.line,
    borderRadius: Radii.full,
    paddingHorizontal: 18,
    backgroundColor: Colors.card,
    fontFamily: Typography.bodyBold,
    fontSize: 14,
    color: Colors.ink,
    marginRight: 10,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.marigold,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: Colors.marigoldDark,
  },
});
