import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SectionList,
  StatusBar,
  Platform,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Community, User } from '../types';

type NetworkStackParamList = {
  NetworkMain: undefined;
  CommunityDetail: { community: Community };
  UserProfile: { user: User };
};

export default function NetworkScreen() {
  const [activeTab, setActiveTab] = useState<'connections' | 'communities'>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  
  const navigation = useNavigation<NativeStackNavigationProp<NetworkStackParamList>>();
  const { 
    connections, 
    users, 
    communities, 
    sendConnectionRequest, 
    acceptConnection, 
    removeConnection,
    joinCommunity,
    leaveCommunity,
    addNotification
  } = useApp();

  const pendingInvites = connections.filter(c => c.status === 'pending');
  const acceptedConnections = connections.filter(c => c.status === 'accepted');
  const sentRequests = connections.filter(c => c.status === 'sent');
  
  const usersNotConnected = useMemo(() => {
    const connectedIds = connections.map(c => c.user.id);
    return users.filter(u => !connectedIds.includes(u.id) && u.id !== 'current');
  }, [users, connections]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return usersNotConnected;
    const query = searchQuery.toLowerCase();
    return usersNotConnected.filter(u => 
      u.name.toLowerCase().includes(query) ||
      u.title.toLowerCase().includes(query) ||
      u.skills.some(s => s.toLowerCase().includes(query))
    );
  }, [usersNotConnected, searchQuery]);

  const filteredCommunities = useMemo(() => {
    if (!searchQuery) return communities;
    const query = searchQuery.toLowerCase();
    return communities.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.skill.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query)
    );
  }, [communities, searchQuery]);

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    addNotification(`Invitation sent to ${inviteEmail}`, 'connection');
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const renderConnection = ({ item }: { item: typeof connections[0] }) => (
    <View style={styles.connectionCard}>
      <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: item.user })}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      </TouchableOpacity>
      <View style={styles.connectionInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <View style={[styles.roleBadge, { backgroundColor: item.user.role === 'Mentor' ? COLORS.primary : COLORS.accent }]}>
            <Text style={styles.roleText}>{item.user.role}</Text>
          </View>
        </View>
        <Text style={styles.userTitle}>{item.user.title}</Text>
        {item.user.company && <Text style={styles.userCompany}>{item.user.company}</Text>}
        <View style={styles.mutualRow}>
          <Ionicons name="git-compare" size={12} color={COLORS.gray[500]} />
          <Text style={styles.mutualText}>{item.mutualSkills} mutual skills</Text>
        </View>
      </View>
      {item.status === 'pending' ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.acceptButton} onPress={() => acceptConnection(item.id)}>
            <Ionicons name="checkmark" size={20} color={COLORS.success} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={() => removeConnection(item.id)}>
            <Ionicons name="close" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      ) : item.status === 'sent' ? (
        <TouchableOpacity style={styles.pendingButton} onPress={() => removeConnection(item.id)}>
          <Text style={styles.pendingButtonText}>Cancel</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.messageButton}>
          <Ionicons name="chatbubble-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCommunity = ({ item }: { item: Community }) => (
    <TouchableOpacity style={styles.communityCard} onPress={() => navigation.navigate('CommunityDetail', { community: item })}>
      <View style={styles.communityHeader}>
        <View style={styles.communityIcon}>
          <Ionicons name="people" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.communityInfo}>
          <Text style={styles.communityName}>{item.name}</Text>
          <View style={styles.communityMeta}>
            <Ionicons name="location-outline" size={14} color={COLORS.gray[500]} />
            <Text style={styles.communityMetaText}>{item.city}</Text>
            <Text style={styles.dot}>•</Text>
            <Ionicons name="people-outline" size={14} color={COLORS.gray[500]} />
            <Text style={styles.communityMetaText}>{item.members.toLocaleString()} members</Text>
          </View>
        </View>
      </View>
      <View style={styles.communityFooter}>
        <View style={styles.voiceRoomIndicator}>
          <Ionicons name={item.activeVoiceRooms > 0 ? 'radio' : 'radio-outline'} size={16} color={item.activeVoiceRooms > 0 ? COLORS.success : COLORS.gray[500]} />
          <Text style={[styles.voiceRoomText, { color: item.activeVoiceRooms > 0 ? COLORS.success : COLORS.gray[500] }]}>
            {item.activeVoiceRooms > 0 ? `${item.activeVoiceRooms} live rooms` : 'No active rooms'}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.joinButton, item.isJoined && styles.joinedButton]} 
          onPress={() => item.isJoined ? leaveCommunity(item.id) : joinCommunity(item.id)}
        >
          {item.isJoined ? (
            <>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.joinedText}>Joined</Text>
            </>
          ) : (
            <Text style={styles.joinButtonText}>Join</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={[styles.roleBadge, { backgroundColor: item.role === 'Mentor' ? COLORS.primary : COLORS.accent }]}>
            <Text style={styles.roleText}>{item.role}</Text>
          </View>
        </View>
        <Text style={styles.userTitle}>{item.title}</Text>
        <View style={styles.skillsRow}>
          {item.skills.slice(0, 3).map((skill, i) => (
            <View key={i} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.connectButton} onPress={() => sendConnectionRequest(item.id)}>
        <Ionicons name="person-add" size={18} color={COLORS.background} />
        <Text style={styles.connectText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );

  const sections = [
    { title: 'Pending Invites', data: pendingInvites },
    { title: 'Your Connections', data: acceptedConnections },
    { title: 'Sent Requests', data: sentRequests },
  ].filter(s => s.data.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Network</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setShowSearchModal(true)}>
            <Ionicons name="search-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setShowInviteModal(true)}>
            <Ionicons name="person-add-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'connections' && styles.activeTab]} onPress={() => setActiveTab('connections')}>
          <Text style={[styles.tabText, activeTab === 'connections' && styles.activeTabText]}>Connections</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'communities' && styles.activeTab]} onPress={() => setActiveTab('communities')}>
          <Text style={[styles.tabText, activeTab === 'communities' && styles.activeTabText]}>Communities</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'connections' ? (
        <SectionList
          sections={sections}
          renderItem={renderConnection}
          renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          ListFooterComponent={
            usersNotConnected.length > 0 ? (
              <View style={styles.suggestSection}>
                <Text style={styles.sectionHeader}>People You May Know</Text>
                <FlatList
                  data={usersNotConnected}
                  renderItem={renderUser}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            ) : null
          }
        />
      ) : (
        <FlatList
          data={filteredCommunities}
          renderItem={renderCommunity}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={COLORS.gray[400]} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search communities..."
                placeholderTextColor={COLORS.gray[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          }
        />
      )}

      {/* Search Modal */}
      <Modal visible={showSearchModal} animationType="slide" transparent onRequestClose={() => setShowSearchModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Find People</Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={COLORS.gray[400]} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, title, or skill..."
                placeholderTextColor={COLORS.gray[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
            <FlatList
              data={filteredUsers}
              renderItem={renderUser}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<Text style={styles.emptyText}>No users found</Text>}
            />
          </View>
        </View>
      </Modal>

      {/* Invite Modal */}
      <Modal visible={showInviteModal} animationType="slide" transparent onRequestClose={() => setShowInviteModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.inviteModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite to CJP Connect</Text>
              <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.inviteDesc}>Invite your colleagues and friends to join the professional network</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              placeholderTextColor={COLORS.gray[400]}
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.sendInviteButton} onPress={handleSendInvite}>
              <Ionicons name="send" size={20} color={COLORS.background} />
              <Text style={styles.sendInviteText}>Send Invitation</Text>
            </TouchableOpacity>
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
  tabContainer: { flexDirection: 'row', backgroundColor: COLORS.cardBg, paddingHorizontal: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.inputBg },
  tab: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.md, color: COLORS.gray[500], fontWeight: '500' },
  activeTabText: { color: COLORS.primary, fontWeight: '600' },
  listContent: { padding: SPACING.md, paddingBottom: 100 },
  sectionHeader: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.gray[400], marginTop: SPACING.md, marginBottom: SPACING.sm },
  suggestSection: { marginTop: SPACING.lg },
  connectionCard: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, flexDirection: 'row', alignItems: 'center', ...SHADOWS.small },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: SPACING.md, borderWidth: 2, borderColor: COLORS.accent },
  connectionInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  userName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
  roleBadge: { paddingHorizontal: SPACING.xs, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  roleText: { fontSize: FONTS.sizes.xs, color: COLORS.background, fontWeight: '600' },
  userTitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray[400], marginTop: 2 },
  userCompany: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  mutualRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.xs },
  mutualText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  actionButtons: { flexDirection: 'row', gap: SPACING.sm },
  acceptButton: { padding: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.success + '20' },
  rejectButton: { padding: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.error + '20' },
  pendingButton: { backgroundColor: COLORS.inputBg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md },
  pendingButtonText: { color: COLORS.gray[400], fontWeight: '500', fontSize: FONTS.sizes.sm },
  messageButton: { padding: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary + '20' },
  communityCard: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  communityHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  communityIcon: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.accent + '30', alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  communityInfo: { flex: 1 },
  communityName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary, marginBottom: 4 },
  communityMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  communityMetaText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  dot: { color: COLORS.gray[600] },
  communityFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.inputBg },
  voiceRoomIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  voiceRoomText: { fontSize: FONTS.sizes.sm, fontWeight: '500' },
  joinButton: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.md, flexDirection: 'row', alignItems: 'center', gap: 4 },
  joinedButton: { backgroundColor: COLORS.success + '20' },
  joinButtonText: { color: COLORS.background, fontWeight: '600', fontSize: FONTS.sizes.sm },
  joinedText: { color: COLORS.success, fontWeight: '500', fontSize: FONTS.sizes.sm },
  userCard: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, flexDirection: 'row', alignItems: 'center', ...SHADOWS.small },
  userInfo: { flex: 1 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.xs },
  skillTag: { backgroundColor: COLORS.accent + '30', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.round },
  skillText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '500' },
  connectButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, gap: SPACING.xs },
  connectText: { color: COLORS.background, fontWeight: '600', fontSize: FONTS.sizes.sm },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: BORDER_RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.md },
  searchInput: { flex: 1, marginLeft: SPACING.sm, fontSize: FONTS.sizes.md, color: COLORS.primary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.cardBg, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, maxHeight: '80%' },
  inviteModal: { backgroundColor: COLORS.cardBg, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginHorizontal: SPACING.md },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary },
  inviteDesc: { color: COLORS.gray[400], marginBottom: SPACING.md },
  input: { backgroundColor: COLORS.inputBg, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.primary, marginBottom: SPACING.md },
  sendInviteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, gap: SPACING.sm },
  sendInviteText: { color: COLORS.background, fontWeight: '600', fontSize: FONTS.sizes.lg },
  emptyText: { color: COLORS.gray[500], textAlign: 'center', padding: SPACING.xl },
});
