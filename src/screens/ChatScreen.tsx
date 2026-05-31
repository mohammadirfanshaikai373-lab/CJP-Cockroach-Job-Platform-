import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Message } from '../types';

type ChatParams = {
  Chat: {
    threadId: string;
    name: string;
    participantId: string;
  };
};

export default function ChatScreen() {
  const route = useRoute<RouteProp<ChatParams, 'Chat'>>();
  const navigation = useNavigation();
  const { threadId, name, participantId } = route.params;
  const { threads, users, sendMessage, sendVoiceNote, posts, completeCommitment, commitments, addNotification } = useApp();
  
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const participant = users.find(u => u.id === participantId);
  const activeCommitment = commitments.find(c => c.mentor.id === participantId && c.status === 'in_progress');

  useEffect(() => {
    // Load initial demo messages
    setMessages([
      { id: 'm1', senderId: participantId, text: `Hi! I'm ${name}. How can I help you today?`, timestamp: new Date(Date.now() - 5 * 60 * 1000) },
    ]);
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'current',
      text: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    sendMessage(threadId, message);
    setMessage('');
    
    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: `m${Date.now() + 1}`,
        senderId: participantId,
        text: getAutoResponse(),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  const getAutoResponse = () => {
    const responses = [
      "That's a great question! Let me help you with that.",
      "I'd be happy to assist. Here's what I suggest...",
      "Thanks for reaching out! Let's schedule a call to discuss further.",
      "I understand. Let me review this and get back to you.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleVoiceNote = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const duration = `0:${Math.floor(Math.random() * 59) + 10}`;
      const voiceMessage: Message = {
        id: `m${Date.now()}`,
        senderId: 'current',
        text: '',
        isVoiceNote: true,
        voiceDuration: duration,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, voiceMessage]);
      sendVoiceNote(threadId, duration);
    }, 2000);
  };

  const handleCompleteCommitment = () => {
    if (activeCommitment) {
      completeCommitment(activeCommitment.id);
      setShowCompletionModal(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === 'current';
    
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
        {item.isVoiceNote ? (
          <View style={styles.voiceNoteContainer}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <View style={styles.voiceWaveform}>
              {[...Array(12)].map((_, i) => (
                <View key={i} style={[styles.waveformBar, { height: Math.random() * 20 + 8 }]} />
              ))}
            </View>
            <Text style={styles.voiceDuration}>{item.voiceDuration}</Text>
          </View>
        ) : (
          <Text style={[styles.messageText, isCurrentUser && styles.currentUserText]}>{item.text}</Text>
        )}
        <Text style={[styles.timestamp, isCurrentUser && styles.currentUserTimestamp]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      {activeCommitment && (
        <View style={styles.commitmentBanner}>
          <View style={styles.commitmentInfo}>
            <Ionicons name="people" size={18} color={COLORS.success} />
            <View>
              <Text style={styles.commitmentTitle}>Active Commitment</Text>
              <Text style={styles.commitmentDue}>Tap to mark complete</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.completeButton} onPress={() => setShowCompletionModal(true)}>
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={isTyping ? (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>{name} is typing...</Text>
          </View>
        ) : null}
      />

      <View style={styles.aiNudge}>
        <Ionicons name="shield-checkmark" size={16} color={COLORS.info} />
        <Text style={styles.aiNudgeText}>Keep the conversation respectful and constructive</Text>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add-circle-outline" size={24} color={COLORS.gray[400]} />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.gray[400]}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={[styles.voiceButton, isRecording && styles.recordingButton]} 
          onPress={handleVoiceNote}
          disabled={isRecording}
        >
          <Ionicons name={isRecording ? 'radio' : 'mic-outline'} size={24} color={isRecording ? COLORS.error : COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons name="send" size={20} color={COLORS.background} />
        </TouchableOpacity>
      </View>

      {/* Completion Modal */}
      {showCompletionModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
            <Text style={styles.modalTitle}>Complete Commitment?</Text>
            <Text style={styles.modalDesc}>This will mark your commitment as completed and award reputation points to both parties.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelModalButton} onPress={() => setShowCompletionModal(false)}>
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmModalButton} onPress={handleCompleteCommitment}>
                <Text style={styles.confirmModalText}>Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  commitmentBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.cardBg, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.inputBg },
  commitmentInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  commitmentTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
  commitmentDue: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  completeButton: { backgroundColor: COLORS.success + '30', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.md },
  completeButtonText: { color: COLORS.success, fontWeight: '600', fontSize: FONTS.sizes.sm },
  messagesList: { padding: SPACING.md, paddingBottom: SPACING.sm },
  messageContainer: { maxWidth: '80%', marginBottom: SPACING.sm, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg },
  currentUserMessage: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  otherUserMessage: { alignSelf: 'flex-start', backgroundColor: COLORS.cardBg, borderBottomLeftRadius: 4, ...SHADOWS.small },
  messageText: { fontSize: FONTS.sizes.md, color: COLORS.primary, lineHeight: 22 },
  currentUserText: { color: COLORS.background },
  timestamp: { fontSize: FONTS.sizes.xs, color: COLORS.gray[500], marginTop: 4, alignSelf: 'flex-end' },
  currentUserTimestamp: { color: COLORS.background + '80' },
  voiceNoteContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  playButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.accent + '50', alignItems: 'center', justifyContent: 'center' },
  voiceWaveform: { flexDirection: 'row', alignItems: 'center', gap: 2, flex: 1 },
  waveformBar: { width: 3, backgroundColor: COLORS.primary, borderRadius: 2, opacity: 0.6 },
  voiceDuration: { fontSize: FONTS.sizes.sm, color: COLORS.gray[400] },
  typingIndicator: { alignSelf: 'flex-start', marginBottom: SPACING.sm },
  typingText: { fontSize: FONTS.sizes.sm, color: COLORS.success, fontStyle: 'italic' },
  aiNudge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.info + '20', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, gap: SPACING.xs },
  aiNudgeText: { fontSize: FONTS.sizes.sm, color: COLORS.info },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: COLORS.cardBg, padding: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.inputBg, gap: SPACING.xs },
  attachButton: { padding: SPACING.xs },
  textInput: { flex: 1, backgroundColor: COLORS.inputBg, borderRadius: BORDER_RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, fontSize: FONTS.sizes.md, color: COLORS.primary, maxHeight: 100 },
  voiceButton: { padding: SPACING.xs },
  recordingButton: { backgroundColor: COLORS.error + '20', borderRadius: BORDER_RADIUS.round },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled: { backgroundColor: COLORS.gray[600] },
  modalOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  modalContent: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, width: '100%', alignItems: 'center' },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.md },
  modalDesc: { color: COLORS.gray[400], textAlign: 'center', marginTop: SPACING.sm, marginBottom: SPACING.lg },
  modalButtons: { flexDirection: 'row', gap: SPACING.md },
  cancelModalButton: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', backgroundColor: COLORS.inputBg },
  cancelModalText: { color: COLORS.gray[400], fontWeight: '600' },
  confirmModalButton: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', backgroundColor: COLORS.success },
  confirmModalText: { color: COLORS.background, fontWeight: '600' },
});
