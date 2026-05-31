import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, TextInput, StatusBar, Platform, Modal, Alert,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS, URGENCY_COLORS, COMMITMENT_TYPES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { FeedPost, CommitmentType } from '../types';

const APP_LOGO = require('../../assets/logo.png');

type FeedStackParamList = { FeedMain: undefined; PostDetail: { post: FeedPost }; UserProfile: { userId: string } };

export default function FeedScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'requests' | 'offers'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDesc, setNewPostDesc] = useState('');
  const [newPostSkills, setNewPostSkills] = useState('');
  const [newPostType, setNewPostType] = useState<CommitmentType>('15min_call');
  const [newPostUrgency, setNewPostUrgency] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [newPostIsOffer, setNewPostIsOffer] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<FeedStackParamList>>();
  const { posts, addPost, likePost, thankPost, savePost, notifications, markNotificationRead, clearNotifications } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const openDrawer = () => {
    const drawerNav = navigation.getParent()?.getParent();
    if (drawerNav) {
      drawerNav.dispatch(DrawerActions.openDrawer());
    }
  };

  const LogoComponent = useMemo(() => (
    <Image
      source={APP_LOGO}
      style={[styles.logo, { opacity: logoLoaded ? 1 : 0 }]}
      contentFit="contain"
      onLoad={() => setLogoLoaded(true)}
      transition={0}
      cachePolicy="memory-disk"
    />
  ), [logoLoaded]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.skillTags.some(s => s.toLowerCase().includes(query)) || p.author.name.toLowerCase().includes(query));
    }
    if (activeFilter === 'requests') { filtered = filtered.filter(p => !p.isHelpOffer); }
    else if (activeFilter === 'offers') { filtered = filtered.filter(p => p.isHelpOffer); }
    return filtered;
  }, [posts, searchQuery, activeFilter]);

  const onRefresh = useCallback(() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }, []);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostDesc.trim() || !newPostSkills.trim()) { Alert.alert('Error', 'Please fill in all required fields'); return; }
    addPost({ title: newPostTitle, description: newPostDesc, skillTags: newPostSkills.split(',').map(s => s.trim()).filter(Boolean), commitmentType: newPostType, urgency: newPostUrgency, isHelpOffer: newPostIsOffer });
    setNewPostTitle(''); setNewPostDesc(''); setNewPostSkills(''); setNewPostType('15min_call'); setNewPostUrgency('medium'); setNewPostIsOffer(false);
    setShowCreateModal(false);
  };

  const renderPost = ({ item }: { item: FeedPost }) => (
    <TouchableOpacity style={styles.postCard} onPress={() => navigation.navigate('PostDetail', { post: item })} activeOpacity={0.8}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: item.author.id })}>
          <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.authorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.authorName}>{item.author.name}</Text>
            <View style={[styles.roleBadge, { backgroundColor: item.author.role === 'Mentor' ? COLORS.primary : COLORS.accent }]}><Text style={styles.roleText}>{item.author.role}</Text></View>
          </View>
          <Text style={styles.authorTitle}>{item.author.title}</Text>
        </View>
        <View style={[styles.urgencyBadge, { backgroundColor: URGENCY_COLORS[item.urgency] + '20' }]}>
          <View style={[styles.urgencyDot, { backgroundColor: URGENCY_COLORS[item.urgency] }]} />
          <Text style={[styles.urgencyText, { color: URGENCY_COLORS[item.urgency] }]}>{item.urgency}</Text>
        </View>
      </View>
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDescription} numberOfLines={3}>{item.description}</Text>
      </View>
      <View style={styles.skillsContainer}>{item.skillTags.map((skill, index) => (<View key={index} style={styles.skillTag}><Text style={styles.skillText}>{skill}</Text></View>))}</View>
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.offerHelpButton} onPress={() => navigation.navigate('PostDetail', { post: item })}><Ionicons name="hand-left" size={16} color={COLORS.white} /><Text style={styles.offerHelpText}>Offer Help</Text></TouchableOpacity>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton} onPress={() => likePost(item.id)}><Ionicons name={item.isLiked ? 'heart' : 'heart-outline'} size={18} color={item.isLiked ? COLORS.error : COLORS.gray[500]} /><Text style={styles.socialText}>{item.likes}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => thankPost(item.id)}><Ionicons name={item.isThanked ? 'star' : 'star-outline'} size={18} color={item.isThanked ? COLORS.warning : COLORS.gray[500]} /><Text style={styles.socialText}>{item.thanks}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => savePost(item.id)}><Ionicons name={item.isSaved ? 'bookmark' : 'bookmark-outline'} size={18} color={item.isSaved ? COLORS.primary : COLORS.gray[500]} /></TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={openDrawer}>
            <Ionicons name="menu" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            {LogoComponent}
            <Text style={styles.headerTitle}>CJP Connect</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} onPress={() => setShowNotifications(true)}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
              {unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setShowCreateModal(true)}>
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.gray[400]} />
          <TextInput style={styles.searchInput} placeholder="Search posts, skills, people..." placeholderTextColor={COLORS.gray[400]} value={searchQuery} onChangeText={setSearchQuery} />
          {searchQuery.length > 0 && (<TouchableOpacity onPress={() => setSearchQuery('')}><Ionicons name="close-circle" size={20} color={COLORS.gray[400]} /></TouchableOpacity>)}
        </View>
        <View style={styles.filterTabs}>
          {(['all', 'requests', 'offers'] as const).map((tab) => (
            <TouchableOpacity key={tab} style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]} onPress={() => setActiveFilter(tab)}><Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text></TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList data={filteredPosts} renderItem={renderPost} keyExtractor={item => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary} />} ListEmptyComponent={<View style={styles.emptyState}><Ionicons name="document-text-outline" size={64} color={COLORS.gray[300]} /><Text style={styles.emptyTitle}>No posts found</Text></View>} />
      <TouchableOpacity style={styles.fab} onPress={() => setShowCreateModal(true)}><Ionicons name="add" size={28} color={COLORS.white} /></TouchableOpacity>

      {/* Create Post Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent onRequestClose={() => setShowCreateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Create Post</Text><TouchableOpacity onPress={() => setShowCreateModal(false)}><Ionicons name="close" size={24} color={COLORS.primary} /></TouchableOpacity></View>
            <View style={styles.typeToggle}>
              <TouchableOpacity style={[styles.typeToggleBtn, !newPostIsOffer && styles.typeToggleBtnActive]} onPress={() => setNewPostIsOffer(false)}><Text style={[styles.typeToggleText, !newPostIsOffer && styles.typeToggleTextActive]}>Request Help</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.typeToggleBtn, newPostIsOffer && styles.typeToggleBtnActive]} onPress={() => setNewPostIsOffer(true)}><Text style={[styles.typeToggleText, newPostIsOffer && styles.typeToggleTextActive]}>Offer Help</Text></TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Title" placeholderTextColor={COLORS.gray[400]} value={newPostTitle} onChangeText={setNewPostTitle} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Description" placeholderTextColor={COLORS.gray[400]} value={newPostDesc} onChangeText={setNewPostDesc} multiline numberOfLines={4} />
            <TextInput style={styles.input} placeholder="Skills (comma separated)" placeholderTextColor={COLORS.gray[400]} value={newPostSkills} onChangeText={setNewPostSkills} />
            <Text style={styles.inputLabel}>Commitment Type</Text>
            <View style={styles.optionsRow}>{(Object.keys(COMMITMENT_TYPES) as CommitmentType[]).map((type) => (<TouchableOpacity key={type} style={[styles.optionChip, newPostType === type && styles.optionChipActive]} onPress={() => setNewPostType(type)}><Text style={[styles.optionChipText, newPostType === type && styles.optionChipTextActive]}>{COMMITMENT_TYPES[type].label}</Text></TouchableOpacity>))}</View>
            <Text style={styles.inputLabel}>Urgency</Text>
            <View style={styles.optionsRow}>{(['low', 'medium', 'high', 'urgent'] as const).map((u) => (<TouchableOpacity key={u} style={[styles.optionChip, newPostUrgency === u && styles.optionChipActive]} onPress={() => setNewPostUrgency(u)}><Text style={[styles.optionChipText, newPostUrgency === u && styles.optionChipTextActive]}>{u}</Text></TouchableOpacity>))}</View>
            <TouchableOpacity style={styles.createButton} onPress={handleCreatePost}><Text style={styles.createButtonText}>Post</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={showNotifications} animationType="slide" transparent onRequestClose={() => setShowNotifications(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Notifications</Text><View style={styles.headerActions}>{notifications.some(n => !n.read) && (<TouchableOpacity onPress={clearNotifications}><Text style={styles.markAllText}>Mark all read</Text></TouchableOpacity>)}<TouchableOpacity onPress={() => setShowNotifications(false)}><Ionicons name="close" size={24} color={COLORS.primary} /></TouchableOpacity></View></View>
            <FlatList data={notifications} keyExtractor={item => item.id} renderItem={({ item }) => (<TouchableOpacity style={[styles.notificationItem, !item.read && styles.notificationUnread]} onPress={() => markNotificationRead(item.id)}><Ionicons name={item.type === 'connection' ? 'person' : item.type === 'job' ? 'briefcase' : 'notifications'} size={24} color={COLORS.primary} /><View style={styles.notificationContent}><Text style={styles.notificationText}>{item.message}</Text><Text style={styles.notificationTime}>{getTimeAgo(item.timestamp)}</Text></View></TouchableOpacity>)} ListEmptyComponent={<Text style={styles.emptyNotifications}>No notifications</Text>} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.white, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.gray[200] },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  logoContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: SPACING.sm },
  logo: { width: 32, height: 32, resizeMode: 'contain', marginRight: SPACING.sm },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text },
  headerActions: { flexDirection: 'row', gap: SPACING.sm },
  iconButton: { padding: SPACING.xs, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: COLORS.error, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: '600' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.gray[100], borderRadius: BORDER_RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.sm },
  searchInput: { flex: 1, marginLeft: SPACING.sm, fontSize: FONTS.sizes.md, color: COLORS.text },
  filterTabs: { flexDirection: 'row', gap: SPACING.sm },
  filterTab: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.round, backgroundColor: COLORS.gray[100] },
  filterTabActive: { backgroundColor: COLORS.primary },
  filterTabText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], fontWeight: '500' },
  filterTabTextActive: { color: COLORS.white },
  listContent: { padding: SPACING.md, paddingBottom: 100 },
  postCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.medium },
  postHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.md },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: SPACING.sm, borderWidth: 2, borderColor: COLORS.accent },
  authorInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  authorName: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.text },
  roleBadge: { paddingHorizontal: SPACING.xs, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  roleText: { fontSize: FONTS.sizes.xs, color: COLORS.white, fontWeight: '600' },
  authorTitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600], marginTop: 2 },
  urgencyBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.xs, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm, gap: 4 },
  urgencyDot: { width: 6, height: 6, borderRadius: 3 },
  urgencyText: { fontSize: FONTS.sizes.xs, fontWeight: '600', textTransform: 'capitalize' },
  postContent: { marginBottom: SPACING.md },
  postTitle: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  postDescription: { fontSize: FONTS.sizes.md, color: COLORS.gray[700], lineHeight: 22 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  skillTag: { backgroundColor: COLORS.accent + '40', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.round },
  skillText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '500' },
  postFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  offerHelpButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg, gap: SPACING.xs },
  offerHelpText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.md },
  socialRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  socialButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.xs, gap: 4 },
  socialText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: '600', color: COLORS.gray[400], marginTop: SPACING.md },
  fab: { position: 'absolute', bottom: 80, right: SPACING.md, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', ...SHADOWS.large },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text },
  typeToggle: { flexDirection: 'row', backgroundColor: COLORS.gray[100], borderRadius: BORDER_RADIUS.lg, padding: 4, marginBottom: SPACING.md },
  typeToggleBtn: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: BORDER_RADIUS.md },
  typeToggleBtnActive: { backgroundColor: COLORS.primary },
  typeToggleText: { color: COLORS.gray[500], fontWeight: '500' },
  typeToggleTextActive: { color: COLORS.white, fontWeight: '600' },
  input: { backgroundColor: COLORS.gray[100], borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.text, marginBottom: SPACING.sm },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  inputLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600], marginBottom: SPACING.xs, marginTop: SPACING.sm },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  optionChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.round, backgroundColor: COLORS.gray[100] },
  optionChipActive: { backgroundColor: COLORS.primary },
  optionChipText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600] },
  optionChipTextActive: { color: COLORS.white, fontWeight: '600' },
  createButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', marginTop: SPACING.md },
  createButtonText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.lg },
  notificationItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray[100], gap: SPACING.md },
  notificationUnread: { backgroundColor: COLORS.primary + '10' },
  notificationContent: { flex: 1 },
  notificationText: { color: COLORS.text, fontSize: FONTS.sizes.md },
  notificationTime: { color: COLORS.gray[500], fontSize: FONTS.sizes.sm, marginTop: 2 },
  emptyNotifications: { color: COLORS.gray[500], textAlign: 'center', padding: SPACING.xl },
  markAllText: { color: COLORS.primary, fontSize: FONTS.sizes.sm, marginRight: SPACING.md },
});