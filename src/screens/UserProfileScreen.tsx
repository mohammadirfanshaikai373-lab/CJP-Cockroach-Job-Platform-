import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput, Modal, Platform,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { User, FeedPost } from '../types';

type UserProfileParams = { UserProfile: { userId: string } };

export default function UserProfileScreen() {
  const route = useRoute<RouteProp<UserProfileParams, 'UserProfile'>>();
  const navigation = useNavigation<any>();
  const { users, posts, currentUser, sendConnectionRequest, connections, endorseSkill } = useApp();
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'experience' | 'skills'>('posts');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  const user = users.find(u => u.id === route.params?.userId) || currentUser;
  const isCurrentUser = user.id === 'current';
  const userPosts = posts.filter(p => p.author.id === user.id);
  const connectionStatus = connections.find(c => c.user.id === user.id)?.status;

  const handleConnect = () => { if (!isCurrentUser) sendConnectionRequest(user.id); };
  const handleMessage = () => { setShowMessageModal(true); };
  const handleEndorse = (skill: string) => { endorseSkill(user.id, skill); };

  const renderPost = ({ item }: { item: FeedPost }) => (
    <View style={styles.postCard}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postDesc} numberOfLines={3}>{item.description}</Text>
      <View style={styles.postStats}>
        <View style={styles.statItem}><Ionicons name="heart-outline" size={16} color={COLORS.gray[500]} /><Text style={styles.statText}>{item.likes}</Text></View>
        <View style={styles.statItem}><Ionicons name="chatbubble-outline" size={16} color={COLORS.gray[500]} /><Text style={styles.statText}>{item.comments.length}</Text></View>
        <View style={styles.statItem}><Ionicons name="share-outline" size={16} color={COLORS.gray[500]} /><Text style={styles.statText}>{item.shares}</Text></View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover & Avatar */}
        <View style={styles.coverSection}>
          <View style={styles.coverImage} />
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.editButton} onPress={() => isCurrentUser && navigation.navigate('EditProfile')}>
            <Ionicons name={isCurrentUser ? 'pencil' : 'ellipsis-horizontal'} size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.headline}>{user.headline}</Text>
          <Text style={styles.location}>{user.location}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.connections}>{user.connections} connections</Text>
            <Text style={styles.viewers}>{user.profileViews} profile views</Text>
          </View>

          {!isCurrentUser && (
            <View style={styles.actionButtons}>
              {connectionStatus === 'accepted' ? (
                <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
                  <Ionicons name="chatbubble-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
              ) : connectionStatus === 'sent' ? (
                <View style={styles.pendingButton}><Text style={styles.pendingText}>Pending</Text></View>
              ) : (
                <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
                  <Ionicons name="person-add" size={18} color={COLORS.white} />
                  <Text style={styles.connectButtonText}>Connect</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.gray[600]} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['posts', 'about', 'experience', 'skills'].map((tab) => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab as any)}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'posts' && (
            userPosts.length > 0 ? (
              <FlatList data={userPosts} renderItem={renderPost} keyExtractor={item => item.id} scrollEnabled={false} />
            ) : (
              <View style={styles.emptyState}><Text style={styles.emptyText}>No posts yet</Text></View>
            )
          )}

          {activeTab === 'about' && (
            <View style={styles.aboutCard}>
              <Text style={styles.aboutText}>{user.about}</Text>
              {user.email && <View style={styles.contactRow}><Ionicons name="mail-outline" size={18} color={COLORS.gray[500]} /><Text style={styles.contactText}>{user.email}</Text></View>}
              {user.phone && <View style={styles.contactRow}><Ionicons name="call-outline" size={18} color={COLORS.gray[500]} /><Text style={styles.contactText}>{user.phone}</Text></View>}
            </View>
          )}

          {activeTab === 'experience' && (
            user.experience.length > 0 ? user.experience.map((exp) => (
              <View key={exp.id} style={styles.experienceCard}>
                <View style={styles.expIcon}><Ionicons name="briefcase" size={24} color={COLORS.primary} /></View>
                <View style={styles.expInfo}>
                  <Text style={styles.expTitle}>{exp.title}</Text>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  <Text style={styles.expDate}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
                  <Text style={styles.expLocation}>{exp.location}</Text>
                  <Text style={styles.expDesc}>{exp.description}</Text>
                </View>
              </View>
            )) : <View style={styles.emptyState}><Text style={styles.emptyText}>No experience added</Text></View>
          )}

          {activeTab === 'skills' && (
            <View style={styles.skillsContainer}>
              {user.skills.map((skill, index) => (
                <TouchableOpacity key={index} style={styles.skillItem} onPress={() => handleEndorse(skill)}>
                  <Text style={styles.skillName}>{skill}</Text>
                  <View style={styles.endorsementRow}>
                    <Text style={styles.endorsementCount}>{user.endorsements.find(e => e.skill === skill)?.count || 0}</Text>
                    <Text style={styles.endorsementLabel}>endorsements</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Message Modal */}
      <Modal visible={showMessageModal} animationType="slide" transparent onRequestClose={() => setShowMessageModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Message {user.name}</Text>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}><Ionicons name="close" size={24} color={COLORS.primary} /></TouchableOpacity>
            </View>
            <TextInput style={styles.messageInput} placeholder="Write your message..." placeholderTextColor={COLORS.gray[400]} value={messageText} onChangeText={setMessageText} multiline numberOfLines={4} />
            <TouchableOpacity style={styles.sendButton}><Text style={styles.sendButtonText}>Send Message</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  coverSection: { height: 180, backgroundColor: COLORS.primary, position: 'relative' },
  coverImage: { flex: 1, backgroundColor: COLORS.primary },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: COLORS.white, position: 'absolute', bottom: -60, left: SPACING.lg },
  editButton: { position: 'absolute', top: SPACING.md, right: SPACING.md, padding: SPACING.sm, backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.round },
  infoSection: { backgroundColor: COLORS.white, padding: SPACING.lg, paddingTop: SPACING.xxl + SPACING.sm, marginBottom: SPACING.sm },
  name: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.text },
  headline: { fontSize: FONTS.sizes.md, color: COLORS.gray[600], marginTop: SPACING.xs },
  location: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], marginTop: SPACING.xs },
  statsRow: { flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.md },
  connections: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '500' },
  viewers: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  actionButtons: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
  connectButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg, gap: SPACING.xs },
  connectButtonText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.md },
  messageButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg, gap: SPACING.xs },
  messageButtonText: { color: COLORS.primary, fontWeight: '600', fontSize: FONTS.sizes.md },
  pendingButton: { flex: 1, alignItems: 'center', backgroundColor: COLORS.gray[200], paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg },
  pendingText: { color: COLORS.gray[600], fontWeight: '500' },
  moreButton: { padding: SPACING.sm, backgroundColor: COLORS.gray[100], borderRadius: BORDER_RADIUS.md },
  tabsContainer: { flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray[200] },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], fontWeight: '500' },
  activeTabText: { color: COLORS.primary, fontWeight: '600' },
  tabContent: { padding: SPACING.md },
  postCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  postTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  postDesc: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600], marginTop: SPACING.xs },
  postStats: { flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.md },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  emptyState: { padding: SPACING.xl, alignItems: 'center' },
  emptyText: { color: COLORS.gray[500] },
  aboutCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, ...SHADOWS.small },
  aboutText: { fontSize: FONTS.sizes.md, color: COLORS.text, lineHeight: 24 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.md },
  contactText: { fontSize: FONTS.sizes.md, color: COLORS.gray[600] },
  experienceCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  expIcon: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.accent + '30', alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  expInfo: { flex: 1 },
  expTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  expCompany: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600] },
  expDate: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  expLocation: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  expDesc: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600], marginTop: SPACING.xs },
  skillsContainer: { gap: SPACING.sm },
  skillItem: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, ...SHADOWS.small },
  skillName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  endorsementRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xs },
  endorsementCount: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.primary },
  endorsementLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text },
  messageInput: { backgroundColor: COLORS.gray[100], borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.text, minHeight: 120, textAlignVertical: 'top' },
  sendButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', marginTop: SPACING.md },
  sendButtonText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.lg },
});
