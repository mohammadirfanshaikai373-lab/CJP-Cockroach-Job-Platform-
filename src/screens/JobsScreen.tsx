import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Modal, TextInput, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Challenge, User } from '../types';

type JobsStackParamList = {
  JobsMain: undefined;
  JobDetail: { jobId: string };
};

export default function JobsScreen() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'challenges'>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  
  const navigation = useNavigation<NativeStackNavigationProp<JobsStackParamList>>();
  const { jobs, challenges, users, applyToJob, saveJob, submitChallenge, sendConnectionRequest } = useApp();

  const talentPool = users.filter(u => u.id !== 'current');

  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;
    const query = searchQuery.toLowerCase();
    return jobs.filter(j => j.title.toLowerCase().includes(query) || j.company.toLowerCase().includes(query) || j.skills.some(s => s.toLowerCase().includes(query)));
  }, [jobs, searchQuery]);

  const filteredChallenges = useMemo(() => {
    if (!searchQuery) return challenges;
    const query = searchQuery.toLowerCase();
    return challenges.filter(c => c.title.toLowerCase().includes(query) || c.company.toLowerCase().includes(query) || c.techStack.some(s => s.toLowerCase().includes(query)));
  }, [challenges, searchQuery]);

  const handleSubmitChallenge = () => {
    if (!submissionLink.trim()) {
      Alert.alert('Error', 'Please provide a repository URL');
      return;
    }
    if (selectedChallenge) {
      submitChallenge(selectedChallenge.id, { link: submissionLink, notes: submissionNotes });
    }
    setSubmissionLink('');
    setSubmissionNotes('');
    setShowSubmissionModal(false);
    setSelectedChallenge(null);
  };

  const renderJob = ({ item }: { item: typeof jobs[0] }) => (
    <TouchableOpacity style={styles.jobCard} onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}>
      <View style={styles.jobHeader}>
        <View style={styles.companyLogo}><Ionicons name="business" size={24} color={COLORS.primary} /></View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.jobCompany}>{item.company}</Text>
          <View style={styles.jobMeta}>
            <Ionicons name="location-outline" size={14} color={COLORS.gray[500]} />
            <Text style={styles.jobMetaText}>{item.location}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.jobMetaText}>{item.type}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={() => saveJob(item.id)}>
          <Ionicons name={item.isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color={item.isSaved ? COLORS.primary : COLORS.gray[400]} />
        </TouchableOpacity>
      </View>
      <View style={styles.jobSkills}>
        {item.skills.map((skill, i) => (<View key={i} style={styles.skillTag}><Text style={styles.skillText}>{skill}</Text></View>))}
      </View>
      <View style={styles.jobFooter}>
        <Text style={styles.jobSalary}>{item.salary}</Text>
        <Text style={styles.jobApplicants}>{item.applicants} applicants</Text>
      </View>
    </TouchableOpacity>
  );

  const renderChallenge = ({ item }: { item: Challenge }) => (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeLogo}><Ionicons name="rocket" size={24} color={COLORS.accent} /></View>
        <View style={styles.challengeInfo}>
          <Text style={styles.challengeCompany}>{item.company}</Text>
          <Text style={styles.challengeTitle}>{item.title}</Text>
        </View>
        <View style={styles.timeBadge}>
          <Ionicons name="time-outline" size={14} color={COLORS.warning} />
          <Text style={styles.timeText}>{item.timeLeft}</Text>
        </View>
      </View>
      <View style={styles.techStack}>
        {item.techStack.map((tech, i) => (<View key={i} style={styles.techTag}><Text style={styles.techText}>{tech}</Text></View>))}
      </View>
      <View style={styles.challengeFooter}>
        <View style={styles.prizeContainer}>
          <Ionicons name="trophy" size={18} color={COLORS.warning} />
          <Text style={styles.prizeText}>{item.prize}</Text>
        </View>
        <Text style={styles.submissionsText}>{item.submissions} submissions</Text>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={() => { setSelectedChallenge(item); setShowSubmissionModal(true); }}>
        <Ionicons name="cloud-upload-outline" size={18} color={COLORS.white} />
        <Text style={styles.submitButtonText}>Submit Solution</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jobs</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray[400]} />
        <TextInput style={styles.searchInput} placeholder={activeTab === 'jobs' ? 'Search jobs...' : 'Search challenges...'} placeholderTextColor={COLORS.gray[400]} value={searchQuery} onChangeText={setSearchQuery} />
        {searchQuery.length > 0 && (<TouchableOpacity onPress={() => setSearchQuery('')}><Ionicons name="close-circle" size={20} color={COLORS.gray[400]} /></TouchableOpacity>)}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'jobs' && styles.activeTab]} onPress={() => setActiveTab('jobs')}>
          <Ionicons name="briefcase-outline" size={18} color={activeTab === 'jobs' ? COLORS.primary : COLORS.gray[500]} />
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'challenges' && styles.activeTab]} onPress={() => setActiveTab('challenges')}>
          <Ionicons name="rocket-outline" size={18} color={activeTab === 'challenges' ? COLORS.primary : COLORS.gray[500]} />
          <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>Challenges</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'jobs' ? (
        <FlatList data={filteredJobs} renderItem={renderJob} keyExtractor={item => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<Text style={styles.emptyText}>No jobs found</Text>} />
      ) : (
        <FlatList data={filteredChallenges} renderItem={renderChallenge} keyExtractor={item => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListHeaderComponent={
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>Complete challenges to skip HR rounds and go directly to technical interviews!</Text>
          </View>
        } ListEmptyComponent={<Text style={styles.emptyText}>No challenges found</Text>} />
      )}

      {/* Submission Modal */}
      <Modal visible={showSubmissionModal} animationType="slide" transparent onRequestClose={() => setShowSubmissionModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Solution</Text>
              <TouchableOpacity onPress={() => setShowSubmissionModal(false)}><Ionicons name="close" size={24} color={COLORS.primary} /></TouchableOpacity>
            </View>
            {selectedChallenge && (
              <>
                <Text style={styles.challengeName}>{selectedChallenge.title}</Text>
                <Text style={styles.challengeCompany}>{selectedChallenge.company}</Text>
              </>
            )}
            <TextInput style={styles.input} placeholder="Repository URL *" placeholderTextColor={COLORS.gray[400]} value={submissionLink} onChangeText={setSubmissionLink} autoCapitalize="none" />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Notes (optional)" placeholderTextColor={COLORS.gray[400]} value={submissionNotes} onChangeText={setSubmissionNotes} multiline numberOfLines={4} />
            <TouchableOpacity style={styles.submitModalButton} onPress={handleSubmitChallenge}>
              <Text style={styles.submitModalButtonText}>Submit Challenge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.white, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray[200] },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.text },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: SPACING.md, marginTop: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.gray[200] },
  searchInput: { flex: 1, marginLeft: SPACING.sm, fontSize: FONTS.sizes.md, color: COLORS.text },
  tabContainer: { flexDirection: 'row', backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray[200] },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.md, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.md, color: COLORS.gray[500], fontWeight: '500' },
  activeTabText: { color: COLORS.primary, fontWeight: '600' },
  listContent: { padding: SPACING.md, paddingBottom: 100 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.info + '15', padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.md, gap: SPACING.sm },
  infoText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.info, fontWeight: '500' },
  jobCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  jobHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.sm },
  companyLogo: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.accent + '30', alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  jobInfo: { flex: 1 },
  jobTitle: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.text },
  jobCompany: { fontSize: FONTS.sizes.md, color: COLORS.gray[600], marginTop: 2 },
  jobMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  jobMetaText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  dot: { color: COLORS.gray[400] },
  saveButton: { padding: SPACING.xs },
  jobSkills: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.sm },
  skillTag: { backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.round },
  skillText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '500' },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.gray[100] },
  jobSalary: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
  jobApplicants: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  challengeCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  challengeHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.sm },
  challengeLogo: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.accent + '30', alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  challengeInfo: { flex: 1 },
  challengeCompany: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  challengeTitle: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.text },
  timeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.warning + '20', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.round, gap: 4 },
  timeText: { fontSize: FONTS.sizes.sm, color: COLORS.warning, fontWeight: '600' },
  techStack: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.sm },
  techTag: { backgroundColor: COLORS.accent + '30', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.round },
  techText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '500' },
  challengeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  prizeContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  prizeText: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  submissionsText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, gap: SPACING.xs },
  submitButtonText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.md },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text },
  challengeName: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  challengeCompany: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], marginBottom: SPACING.md },
  input: { backgroundColor: COLORS.gray[100], borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.text, marginBottom: SPACING.sm },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  submitModalButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', marginTop: SPACING.md },
  submitModalButtonText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.lg },
  emptyText: { color: COLORS.gray[500], textAlign: 'center', padding: SPACING.xl },
});
