import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Platform,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { FeedPost, Job } from '../types';

export default function SavedScreen() {
  const navigation = useNavigation();
  const { posts, jobs } = useApp();
  const [activeTab, setActiveTab] = useState<'posts' | 'jobs'>('posts');

  const savedPosts = posts.filter(post => post.isSaved);
  const savedJobs = jobs.filter(job => job.isSaved);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderPost = ({ item }: { item: FeedPost }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('Feed', { screen: 'PostDetail', params: { post: item } })}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postAuthor}>by {item.author.name}</Text>
      <Text style={styles.postDesc} numberOfLines={2}>{item.description}</Text>
      <View style={styles.postTags}>
        {item.skillTags.slice(0, 3).map((tag, i) => (
          <View key={i} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderJob = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('Jobs', { screen: 'JobDetail', params: { job: item } })}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobLogo}><Ionicons name="business" size={24} color={COLORS.primary} /></View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.jobCompany}>{item.company}</Text>
          <Text style={styles.jobLocation}>{item.location}</Text>
        </View>
      </View>
      <View style={styles.jobMeta}>
        <Text style={styles.jobSalary}>{item.salary}</Text>
        <Text style={styles.jobType}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Items</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === 'posts' && styles.activeTab]} onPress={() => setActiveTab('posts')}>
          <Ionicons name="bookmark" size={18} color={activeTab === 'posts' ? COLORS.primary : COLORS.gray[500]} />
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts ({savedPosts.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'jobs' && styles.activeTab]} onPress={() => setActiveTab('jobs')}>
          <Ionicons name="briefcase" size={18} color={activeTab === 'jobs' ? COLORS.primary : COLORS.gray[500]} />
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>Jobs ({savedJobs.length})</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'posts' ? (
        <FlatList
          data={savedPosts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No saved posts</Text>}
        />
      ) : (
        <FlatList
          data={savedJobs}
          renderItem={renderJob}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No saved jobs</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text, textAlign: 'center', flex: 1 },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray[200] },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.md, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.md, color: COLORS.gray[500], fontWeight: '500' },
  activeTabText: { color: COLORS.primary, fontWeight: '600' },
  listContent: { padding: SPACING.md },
  postCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  postTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  postAuthor: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], marginTop: 2 },
  postDesc: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600], marginTop: SPACING.sm },
  postTags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.sm },
  tag: { backgroundColor: COLORS.accent + '30', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.round },
  tagText: { fontSize: FONTS.sizes.xs, color: COLORS.primary },
  jobCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  jobHeader: { flexDirection: 'row', marginBottom: SPACING.sm },
  jobLogo: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.accent + '30', alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  jobInfo: { flex: 1 },
  jobTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  jobCompany: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600] },
  jobLocation: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  jobMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  jobSalary: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
  jobType: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  emptyText: { color: COLORS.gray[500], textAlign: 'center', padding: SPACING.xl },
});