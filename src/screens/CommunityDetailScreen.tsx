import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Community } from '../types';

type CommunityDetailParams = {
  CommunityDetail: { community: Community };
};

const voiceRooms = [
  { id: 'vr1', name: 'React Best Practices Discussion', host: 'Afifa Khan', speakers: 3, listeners: 24, isLive: true },
  { id: 'vr2', name: 'Career Advice for Juniors', host: 'Sadiya Begum', speakers: 2, listeners: 12, isLive: true },
];

const leaderboard = [
  { rank: 1, name: 'Afifa Khan', title: 'Senior Developer', points: 1250, badge: '🏆' },
  { rank: 2, name: 'Kiran Reddy', title: 'ML Engineer', points: 1180, badge: '🥈' },
  { rank: 3, name: 'Sadiya Begum', title: 'DevOps Engineer', points: 950, badge: '🥉' },
  { rank: 4, name: 'Aleem Ahmed', title: 'Backend Architect', points: 720, badge: '' },
  { rank: 5, name: 'Sai Prakash', title: 'Frontend Developer', points: 580, badge: '' },
];

const tasks = [
  { id: 't1', title: 'Review React documentation', points: 50, completed: false },
  { id: 't2', title: 'Help 3 community members', points: 100, completed: true },
  { id: 't3', title: 'Share a learning resource', points: 30, completed: false },
];

export default function CommunityDetailScreen() {
  const route = useRoute<RouteProp<CommunityDetailParams, 'CommunityDetail'>>();
  const { community } = route.params;
  const { addNotification } = useApp();
  
  const [activeTab, setActiveTab] = useState<'voice' | 'tasks' | 'leaderboard'>('voice');
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [joinedRooms, setJoinedRooms] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>(tasks.filter(t => t.completed).map(t => t.id));

  const handleJoinRoom = (roomId: string) => {
    if (joinedRooms.includes(roomId)) {
      setJoinedRooms(prev => prev.filter(id => id !== roomId));
    } else {
      setJoinedRooms(prev => [...prev, roomId]);
      addNotification('You joined a voice room!', 'success');
    }
  };

  const handleCompleteTask = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks(prev => [...prev, taskId]);
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        addNotification(`Task completed! +${task.points} points`, 'success');
      }
    }
  };

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      Alert.alert('Error', 'Please enter a room name');
      return;
    }
    addNotification('Voice room created!', 'success');
    setRoomName('');
    setShowCreateRoomModal(false);
  };

  const renderVoiceRoom = ({ item }: { item: typeof voiceRooms[0] }) => {
    const isJoined = joinedRooms.includes(item.id);
    return (
      <View style={styles.voiceRoomCard}>
        <View style={styles.voiceRoomHeader}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.listenerCount}>{item.listeners} listening</Text>
        </View>
        <Text style={styles.voiceRoomName}>{item.name}</Text>
        <View style={styles.speakersRow}>
          <Text style={styles.hostInfo}>🎤 {item.host} (host)</Text>
          <Text style={styles.speakerCount}>{item.speakers} speakers</Text>
        </View>
        <TouchableOpacity 
          style={[styles.joinRoomButton, isJoined && styles.leaveRoomButton]} 
          onPress={() => handleJoinRoom(item.id)}
        >
          <Ionicons name={isJoined ? 'exit-outline' : 'mic-outline'} size={18} color={COLORS.background} />
          <Text style={styles.joinRoomText}>{isJoined ? 'Leave' : 'Join Room'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTask = ({ item }: { item: typeof tasks[0] }) => {
    const isCompleted = completedTasks.includes(item.id);
    return (
      <View style={styles.taskCard}>
        <TouchableOpacity 
          style={[styles.taskCheckbox, isCompleted && styles.taskCheckboxCompleted]} 
          onPress={() => handleCompleteTask(item.id)}
        >
          {isCompleted && <Ionicons name="checkmark" size={16} color={COLORS.background} />}
        </TouchableOpacity>
        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}>{item.title}</Text>
          <Text style={styles.taskPoints}>+{item.points} points</Text>
        </View>
        {!isCompleted && (
          <TouchableOpacity style={styles.taskButton} onPress={() => handleCompleteTask(item.id)}>
            <Text style={styles.taskButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderLeaderboardItem = ({ item }: { item: typeof leaderboard[0] }) => (
    <View style={styles.leaderboardCard}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankNumber}>{item.rank}</Text>
        {item.badge ? <Text style={styles.rankBadge}>{item.badge}</Text> : null}
      </View>
      <View style={styles.leaderboardInfo}>
        <Text style={styles.leaderboardName}>{item.name}</Text>
        <Text style={styles.leaderboardTitle}>{item.title}</Text>
      </View>
      <View style={styles.pointsContainer}>
        <Ionicons name="star" size={16} color={COLORS.warning} />
        <Text style={styles.pointsText}>{item.points}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.communityIcon}>
          <Ionicons name="people" size={32} color={COLORS.primary} />
        </View>
        <View style={styles.communityInfo}>
          <Text style={styles.communityName}>{community.name}</Text>
          <View style={styles.communityMeta}>
            <Ionicons name="location-outline" size={14} color={COLORS.gray[500]} />
            <Text style={styles.communityMetaText}>{community.city}</Text>
            <Text style={styles.dot}>•</Text>
            <Ionicons name="people-outline" size={14} color={COLORS.gray[500]} />
            <Text style={styles.communityMetaText}>{community.members.toLocaleString()} members</Text>
          </View>
        </View>
      </View>

      <View style={styles.sprintBanner}>
        <View style={styles.sprintContent}>
          <Ionicons name="flash" size={20} color={COLORS.warning} />
          <View>
            <Text style={styles.sprintTitle}>Weekly Help Sprint</Text>
            <Text style={styles.sprintDesc}>Top mentors get exclusive badges!</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {(['voice', 'tasks', 'leaderboard'] as const).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Ionicons name={tab === 'voice' ? 'radio' : tab === 'tasks' ? 'list' : 'trophy'} size={18} color={activeTab === tab ? COLORS.primary : COLORS.gray[500]} />
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab === 'voice' ? 'Voice Rooms' : tab === 'tasks' ? 'Tasks' : 'Leaderboard'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'voice' ? (
        <FlatList
          data={voiceRooms}
          renderItem={renderVoiceRoom}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <TouchableOpacity style={styles.createRoomButton} onPress={() => setShowCreateRoomModal(true)}>
              <Ionicons name="add" size={20} color={COLORS.primary} />
              <Text style={styles.createRoomText}>Create New Room</Text>
            </TouchableOpacity>
          }
        />
      ) : activeTab === 'tasks' ? (
        <FlatList data={tasks} renderItem={renderTask} keyExtractor={item => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />
      ) : (
        <FlatList data={leaderboard} renderItem={renderLeaderboardItem} keyExtractor={item => item.rank.toString()} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />
      )}

      <Modal visible={showCreateRoomModal} animationType="slide" transparent onRequestClose={() => setShowCreateRoomModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Voice Room</Text>
              <TouchableOpacity onPress={() => setShowCreateRoomModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Room name" placeholderTextColor={COLORS.gray[400]} value={roomName} onChangeText={setRoomName} />
            <TouchableOpacity style={styles.createButton} onPress={handleCreateRoom}>
              <Text style={styles.createButtonText}>Create Room</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, backgroundColor: COLORS.cardBg },
  communityIcon: { width: 56, height: 56, borderRadius: BORDER_RADIUS.lg, backgroundColor: COLORS.accent + '30', alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  communityInfo: { flex: 1 },
  communityName: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  communityMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  communityMetaText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  dot: { color: COLORS.gray[600] },
  sprintBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.warning + '20', margin: SPACING.md, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.warning + '30' },
  sprintContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  sprintTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
  sprintDesc: { fontSize: FONTS.sizes.sm, color: COLORS.gray[400] },
  tabContainer: { flexDirection: 'row', backgroundColor: COLORS.cardBg, paddingHorizontal: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.inputBg },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.md, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], fontWeight: '500' },
  activeTabText: { color: COLORS.primary, fontWeight: '600' },
  listContent: { padding: SPACING.md, paddingBottom: 100 },
  createRoomButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, backgroundColor: COLORS.cardBg, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed', marginBottom: SPACING.md },
  createRoomText: { fontSize: FONTS.sizes.md, color: COLORS.primary, fontWeight: '600' },
  voiceRoomCard: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  voiceRoomHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  liveText: { fontSize: FONTS.sizes.sm, color: COLORS.error, fontWeight: '700' },
  listenerCount: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  voiceRoomName: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.primary, marginBottom: SPACING.sm },
  speakersRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  hostInfo: { fontSize: FONTS.sizes.sm, color: COLORS.gray[300] },
  speakerCount: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  joinRoomButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, gap: SPACING.xs },
  leaveRoomButton: { backgroundColor: COLORS.error },
  joinRoomText: { color: COLORS.background, fontWeight: '600', fontSize: FONTS.sizes.md },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBg, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.sm, ...SHADOWS.small },
  taskCheckbox: { width: 24, height: 24, borderRadius: BORDER_RADIUS.sm, borderWidth: 2, borderColor: COLORS.gray[500], marginRight: SPACING.md, alignItems: 'center', justifyContent: 'center' },
  taskCheckboxCompleted: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: FONTS.sizes.md, fontWeight: '500', color: COLORS.primary },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: COLORS.gray[500] },
  taskPoints: { fontSize: FONTS.sizes.sm, color: COLORS.success, fontWeight: '600', marginTop: 2 },
  taskButton: { backgroundColor: COLORS.primary + '20', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.md },
  taskButtonText: { color: COLORS.primary, fontWeight: '600', fontSize: FONTS.sizes.sm },
  leaderboardCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBg, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.sm, ...SHADOWS.small },
  rankContainer: { width: 40, alignItems: 'center' },
  rankNumber: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.gray[400] },
  rankBadge: { fontSize: FONTS.sizes.lg },
  leaderboardInfo: { flex: 1 },
  leaderboardName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
  leaderboardTitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  pointsContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pointsText: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.warning },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.cardBg, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary },
  input: { backgroundColor: COLORS.inputBg, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.primary, marginBottom: SPACING.md },
  createButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center' },
  createButtonText: { color: COLORS.background, fontWeight: '600', fontSize: FONTS.sizes.lg },
});
