import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS, COMMITMENT_TYPES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { MessageThread, Commitment, User } from '../types';

type MessagingStackParamList = {
  MessagingMain: undefined;
  Chat: { threadId: string; name: string; participantId: string };
  NewMessage: undefined;
};

export default function MessagingScreen() {
  const [activeSection, setActiveSection] = useState<'commitments' | 'messages'>('commitments');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  
  const navigation = useNavigation<NativeStackNavigationProp<MessagingStackParamList>>();
  const { threads, commitments, users, createThread, completeCommitment, currentUser } = useApp();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'in_progress': return COLORS.info;
      case 'completed': return COLORS.primary;
      case 'expired': return COLORS.error;
      default: return COLORS.gray[500];
    }
  };

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getTimeLeft = (dueDate: Date): string => {
    const seconds = Math.floor((dueDate.getTime() - new Date().getTime()) / 1000);
    if (seconds < 0) return 'Overdue';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m left`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h left`;
    return `${Math.floor(seconds / 86400)}d left`;
  };

  const filteredThreads = useMemo(() => {
    if (!searchQuery) return threads;
    const query = searchQuery.toLowerCase();
    return threads.filter(t => 
      t.participant.name.toLowerCase().includes(query) ||
      t.lastMessage.toLowerCase().includes(query)
    );
  }, [threads, searchQuery]);

  const renderCommitment = ({ item }: { item: Commitment }) => (
    <TouchableOpacity 
      style={styles.commitmentCard}
      onPress={() => {
        const thread = threads.find(t => t.participant.id === item.mentor.id);
        if (thread) {
          navigation.navigate('Chat', { threadId: thread.id, name: item.mentor.name, participantId: item.mentor.id });
        }
      }}
    >
      <Image source={{ uri: item.mentor.avatar }} style={styles.avatar} />
      <View style={styles.commitmentInfo}>
        <View style={styles.commitmentHeader}>
          <Text style={styles.userName}>With {item.mentor.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '30' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status.replace('_', ' ')}</Text>
          </View>
        </View>
        <View style={styles.commitmentMeta}>
          <Ionicons name={COMMITMENT_TYPES[item.type].icon} size={14} color={COLORS.primary} />
          <Text style={styles.commitmentType}>{COMMITMENT_TYPES[item.type].label}</Text>
          {item.status !== 'completed' && item.status !== 'expired' && (
            <>
              <Text style={styles.dot}>•</Text>
              <Ionicons name="time-outline" size={14} color={COLORS.warning} />
              <Text style={styles.dueText}>{getTimeLeft(item.dueDate)}</Text>
            </>
          )}
        </View>
        <Text style={styles.postTitle} numberOfLines={1}>{item.post.title}</Text>
      </View>
      {item.status === 'in_progress' && (
        <TouchableOpacity style={styles.completeBtn} onPress={() => completeCommitment(item.id)}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderThread = ({ item }: { item: MessageThread }) => (
    <TouchableOpacity 
      style={styles.threadCard}
      onPress={() => navigation.navigate('Chat', { threadId: item.id, name: item.participant.name, participantId: item.participant.id })}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.participant.avatar }} style={styles.avatar} />
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
      <View style={styles.threadInfo}>
        <View style={styles.threadHeader}>
          <Text style={styles.userName}>{item.participant.name}</Text>
          <Text style={styles.timeAgo}>{getTimeAgo(item.timestamp)}</Text>
        </View>
        {item.commitmentType && (
          <View style={styles.threadMeta}>
            <Ionicons name={COMMITMENT_TYPES[item.commitmentType].icon} size={12} color={COLORS.primary} />
            <Text style={styles.threadCommitment}>{COMMITMENT_TYPES[item.commitmentType].label}</Text>
          </View>
        )}
        <View style={styles.messagePreview}>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage || 'Start a conversation'}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.gray[500]} />
    </TouchableOpacity>
  );

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => {
        const threadId = createThread(item.id);
        setShowNewMessageModal(false);
        if (threadId) {
          navigation.navigate('Chat', { threadId, name: item.name, participantId: item.id });
        }
      }}
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userTitle}>{item.title}</Text>
      </View>
      <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setShowNewMessageModal(true)}>
            <Ionicons name="create-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor={COLORS.gray[400]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeSection === 'commitments' && styles.activeTab]} onPress={() => setActiveSection('commitments')}>
          <Text style={[styles.tabText, activeSection === 'commitments' && styles.activeTabText]}>Active Commitments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeSection === 'messages' && styles.activeTab]} onPress={() => setActiveSection('messages')}>
          <Text style={[styles.tabText, activeSection === 'messages' && styles.activeTabText]}>All Messages</Text>
        </TouchableOpacity>
      </View>

      {activeSection === 'commitments' ? (
        <FlatList
          data={commitments}
          renderItem={renderCommitment}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color={COLORS.gray[500]} />
              <Text style={styles.emptyTitle}>No active commitments</Text>
              <Text style={styles.emptySubtitle}>Start helping someone to create a commitment!</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredThreads}
          renderItem={renderThread}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No messages yet</Text>}
        />
      )}

      {/* New Message Modal */}
      <Modal visible={showNewMessageModal} animationType="slide" transparent onRequestClose={() => setShowNewMessageModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Message</Text>
              <TouchableOpacity onPress={() => setShowNewMessageModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={COLORS.gray[400]} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search connections..."
                placeholderTextColor={COLORS.gray[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <FlatList
              data={users.filter(u => u.id !== 'current')}
              renderItem={renderUser}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.cardBg, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.inputBg },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.primary },
  headerActions: { flexDirection: 'row', gap: SPACING.sm },
  iconButton: { padding: SPACING.xs },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBg, marginHorizontal: SPACING.md, marginTop: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg },
  searchInput: { flex: 1, marginLeft: SPACING.sm, fontSize: FONTS.sizes.md, color: COLORS.primary },
  tabContainer: { flexDirection: 'row', backgroundColor: COLORS.cardBg, paddingHorizontal: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.inputBg },
  tab: { flex: 1, paddingVertical: SPACING.md, borderBottomWidth: 2, borderBottomColor: 'transparent', alignItems: 'center' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.md, color: COLORS.gray[500], fontWeight: '500' },
  activeTabText: { color: COLORS.primary, fontWeight: '600' },
  listContent: { padding: SPACING.md, paddingBottom: 100 },
  commitmentCard: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, flexDirection: 'row', alignItems: 'center', ...SHADOWS.small },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: SPACING.md, borderWidth: 2, borderColor: COLORS.accent },
  commitmentInfo: { flex: 1 },
  commitmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  userName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.round, gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: '600', textTransform: 'capitalize' },
  commitmentMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  commitmentType: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '500' },
  dot: { color: COLORS.gray[600], marginHorizontal: 4 },
  dueText: { fontSize: FONTS.sizes.sm, color: COLORS.warning, fontWeight: '500' },
  postTitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray[400] },
  completeBtn: { padding: SPACING.xs },
  threadCard: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, flexDirection: 'row', alignItems: 'center', ...SHADOWS.small },
  avatarContainer: { position: 'relative', marginRight: SPACING.md },
  unreadBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: COLORS.primary, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  unreadText: { color: COLORS.background, fontSize: 10, fontWeight: '600' },
  threadInfo: { flex: 1 },
  threadHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  timeAgo: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  threadMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  threadCommitment: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '500' },
  messagePreview: { flexDirection: 'row', alignItems: 'center' },
  lastMessage: { fontSize: FONTS.sizes.sm, color: COLORS.gray[400] },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: '600', color: COLORS.gray[400], marginTop: SPACING.md },
  emptySubtitle: { fontSize: FONTS.sizes.md, color: COLORS.gray[500], marginTop: SPACING.xs, textAlign: 'center' },
  emptyText: { color: COLORS.gray[500], textAlign: 'center', padding: SPACING.xl },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.cardBg, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.inputBg },
  userAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: SPACING.md, borderWidth: 2, borderColor: COLORS.accent },
  userInfo: { flex: 1 },
  userTitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray[400] },
});
