import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  Platform, Switch, Modal, TextInput, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';

type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
};

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { currentUser, updateProfile, addNotification } = useApp();
  const [isAnonymousMode, setIsAnonymousMode] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddProofModal, setShowAddProofModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Add proof form (UI only – will not crash)
  const [proofTitle, setProofTitle] = useState('');
  const [proofWhatBuilt, setProofWhatBuilt] = useState('');
  const [proofWhatLearned, setProofWhatLearned] = useState('');
  const [proofNextGoal, setProofNextGoal] = useState('');
  const [proofLink, setProofLink] = useState('');
  const [proofType, setProofType] = useState<'github' | 'loom' | 'other'>('github');

  // Guard: if currentUser is null, show a loading placeholder
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Loading profile...</Text>
      </View>
    );
  }

  const calculateReputation = () => {
    const rep = currentUser.reputation || { completedCommitments: 0, thanks: 0, expired: 0, disputesLost: 0 };
    return (rep.completedCommitments * 10) + (rep.thanks * 2) - (rep.expired * 15) - (rep.disputesLost * 30);
  };

  const handleAddProof = () => {
    Alert.alert('Coming Soon', 'Project proof feature will be added soon.');
    setShowAddProofModal(false);
  };

  const renderProgressBar = (label: string, value: number, color: string) => (
    <View style={styles.progressItem}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressValue}>{value}%</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBar, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

  const renderBadge = (badge: string, index: number) => (
    <View key={index} style={styles.badge}>
      <Ionicons name="ribbon" size={16} color={COLORS.warning} />
      <Text style={styles.badgeText}>{badge}</Text>
    </View>
  );

  const renderProjectProof = (proof: any) => (
    <View key={proof.id} style={styles.proofCard}>
      <View style={styles.proofHeader}>
        <Ionicons name={proof.type === 'github' ? 'logo-github' : 'videocam'} size={20} color={COLORS.primary} />
        <Text style={styles.proofTitle}>{proof.title}</Text>
      </View>
      <View style={styles.proofDetails}>
        <View style={styles.proofDetail}>
          <Text style={styles.proofLabel}>What I Built:</Text>
          <Text style={styles.proofValue}>{proof.whatBuilt}</Text>
        </View>
        {proof.whatLearned && (
          <View style={styles.proofDetail}>
            <Text style={styles.proofLabel}>What I Learned:</Text>
            <Text style={styles.proofValue}>{proof.whatLearned}</Text>
          </View>
        )}
        {proof.nextGoal && (
          <View style={styles.proofDetail}>
            <Text style={styles.proofLabel}>Next Goal:</Text>
            <Text style={styles.proofValue}>{proof.nextGoal}</Text>
          </View>
        )}
      </View>
      {proof.link && (
        <TouchableOpacity style={styles.proofLink}>
          <Ionicons name="link-outline" size={16} color={COLORS.primary} />
          <Text style={styles.proofLinkText}>View Project</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettingsModal(true)}>
          <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image source={{ uri: currentUser.avatar || 'https://via.placeholder.com/72' }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{currentUser.name || 'User'}</Text>
              <View style={[styles.roleBadge, { backgroundColor: currentUser.role === 'Mentor' ? COLORS.primary : COLORS.accent }]}>
                <Text style={styles.roleText}>{currentUser.role || 'Seeker'}</Text>
              </View>
            </View>
            <Text style={styles.userTitle}>{currentUser.title || 'No title'}</Text>
            {currentUser.company && <Text style={styles.userCompany}>{currentUser.company}</Text>}
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="pencil" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={20} color={COLORS.warning} />
            <Text style={styles.sectionTitle}>Reputation Score</Text>
            <Text style={styles.reputationValue}>{calculateReputation()}</Text>
          </View>
          {renderProgressBar('Resilience Score', currentUser.reputation?.resilience || 0, COLORS.success)}
          {renderProgressBar('Speed Score', currentUser.reputation?.speed || 0, COLORS.info)}
          {renderProgressBar('Authenticity Badge', currentUser.reputation?.authenticity || 0, COLORS.accent)}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{currentUser.reputation?.completedCommitments || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{currentUser.reputation?.thanks || 0}</Text>
            <Text style={styles.statLabel}>Thanks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{currentUser.skills?.length || 0}</Text>
            <Text style={styles.statLabel}>Skills</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {(currentUser.skills || []).map((skill: string, index: number) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {(currentUser.badges || []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <View style={styles.badgesContainer}>{currentUser.badges!.map(renderBadge)}</View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Project Proofs</Text>
            <TouchableOpacity onPress={() => setShowAddProofModal(true)}>
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          {(currentUser.projectProofs || []).length > 0 ? (
            currentUser.projectProofs!.map(renderProjectProof)
          ) : (
            <TouchableOpacity style={styles.addProofButton} onPress={() => setShowAddProofModal(true)}>
              <Ionicons name="add" size={24} color={COLORS.primary} />
              <Text style={styles.addProofText}>Add Project Proof</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.anonymousToggle}>
            <View style={styles.anonymousInfo}>
              <Ionicons name="eye-off-outline" size={20} color={COLORS.gray[400]} />
              <View>
                <Text style={styles.anonymousTitle}>Anonymous Mode</Text>
                <Text style={styles.anonymousDesc}>Hide your identity for sensitive questions</Text>
              </View>
            </View>
            <Switch
              value={isAnonymousMode}
              onValueChange={setIsAnonymousMode}
              trackColor={{ false: COLORS.inputBg, true: COLORS.accent }}
              thumbColor={isAnonymousMode ? COLORS.primary : COLORS.gray[300]}
            />
          </View>
        </View>

        {!currentUser.isPremium && (
          <TouchableOpacity style={styles.premiumBanner} onPress={() => setShowPremiumModal(true)}>
            <View style={styles.premiumContent}>
              <Ionicons name="star" size={24} color={COLORS.warning} />
              <View>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumDesc}>₹49/month • Featured profile & analytics</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.warning} />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Settings Modal */}
      <Modal visible={showSettingsModal} animationType="slide" transparent onRequestClose={() => setShowSettingsModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray[400]} />
              <Text style={styles.settingText}>Privacy Settings</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[500]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.gray[400]} />
              <Text style={styles.settingText}>GDPR Preferences</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[500]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.gray[400]} />
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[500]} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingItem, styles.logoutItem]} onPress={() => setShowLogoutModal(true)}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              <Text style={[styles.settingText, { color: COLORS.error }]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Proof Modal */}
      <Modal visible={showAddProofModal} animationType="slide" transparent onRequestClose={() => setShowAddProofModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Project Proof</Text>
              <TouchableOpacity onPress={() => setShowAddProofModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Project Title *" placeholderTextColor={COLORS.gray[400]} value={proofTitle} onChangeText={setProofTitle} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="What I Built *" placeholderTextColor={COLORS.gray[400]} value={proofWhatBuilt} onChangeText={setProofWhatBuilt} multiline numberOfLines={3} />
            <TextInput style={styles.input} placeholder="What I Learned" placeholderTextColor={COLORS.gray[400]} value={proofWhatLearned} onChangeText={setProofWhatLearned} />
            <TextInput style={styles.input} placeholder="Next Goal" placeholderTextColor={COLORS.gray[400]} value={proofNextGoal} onChangeText={setProofNextGoal} />
            <TextInput style={styles.input} placeholder="Project Link" placeholderTextColor={COLORS.gray[400]} value={proofLink} onChangeText={setProofLink} autoCapitalize="none" />
            <Text style={styles.inputLabel}>Type</Text>
            <View style={styles.typeRow}>
              {(['github', 'loom', 'other'] as const).map((t) => (
                <TouchableOpacity key={t} style={[styles.typeBtn, proofType === t && styles.typeBtnActive]} onPress={() => setProofType(t)}>
                  <Text style={[styles.typeBtnText, proofType === t && styles.typeBtnTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddProof}>
              <Text style={styles.addButtonText}>Add Project</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Premium Modal */}
      <Modal visible={showPremiumModal} animationType="slide" transparent onRequestClose={() => setShowPremiumModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Go Premium</Text>
              <TouchableOpacity onPress={() => setShowPremiumModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <Ionicons name="star" size={64} color={COLORS.warning} style={styles.premiumIcon} />
            <Text style={styles.premiumModalTitle}>Unlock Premium Features</Text>
            <Text style={styles.premiumModalDesc}>₹49/month</Text>
            {['Featured profile in search', 'Advanced analytics', 'Unlimited communities', 'Priority support'].map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.subscribeButton} onPress={() => { updateProfile?.({ isPremium: true }); setShowPremiumModal(false); addNotification?.('Welcome to Premium!', 'success'); }}>
              <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Logout Modal */}
      <Modal visible={showLogoutModal} animationType="fade" transparent onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.centeredModal}>
          <View style={styles.logoutModal}>
            <Ionicons name="log-out-outline" size={48} color={COLORS.error} />
            <Text style={styles.logoutTitle}>Log Out?</Text>
            <Text style={styles.logoutDesc}>Are you sure you want to log out of CJP Connect?</Text>
            <View style={styles.logoutButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmLogoutButton} onPress={() => { setShowLogoutModal(false); addNotification?.('Logged out successfully', 'info'); }}>
                <Text style={styles.confirmLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
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
  settingsButton: { padding: SPACING.xs },
  content: { flex: 1 },
  scrollContent: { padding: SPACING.md, paddingBottom: 100 },
  errorText: { color: COLORS.error, textAlign: 'center', marginTop: 50 },
  profileCard: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', ...SHADOWS.medium },
  avatar: { width: 72, height: 72, borderRadius: 36, marginRight: SPACING.md, borderWidth: 3, borderColor: COLORS.accent },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  userName: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary },
  roleBadge: { paddingHorizontal: SPACING.xs, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  roleText: { fontSize: FONTS.sizes.xs, color: COLORS.background, fontWeight: '600' },
  userTitle: { fontSize: FONTS.sizes.md, color: COLORS.gray[400], marginTop: 2 },
  userCompany: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  editButton: { padding: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary + '20' },
  section: { marginTop: SPACING.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.md },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.primary, flex: 1 },
  reputationValue: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.warning },
  progressItem: { marginBottom: SPACING.md },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  progressLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray[400], fontWeight: '500' },
  progressValue: { fontSize: FONTS.sizes.sm, color: COLORS.gray[400], fontWeight: '600' },
  progressBarBg: { height: 8, backgroundColor: COLORS.inputBg, borderRadius: 4 },
  progressBar: { height: '100%', borderRadius: 4 },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  statCard: { flex: 1, backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, alignItems: 'center', ...SHADOWS.small },
  statValue: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.primary },
  statLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], marginTop: 2 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  skillTag: { backgroundColor: COLORS.accent + '40', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.round },
  skillText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '500' },
  badgesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.warning + '30', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.round, gap: SPACING.xs },
  badgeText: { fontSize: FONTS.sizes.sm, color: COLORS.warning, fontWeight: '600' },
  proofCard: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginTop: SPACING.sm, ...SHADOWS.small },
  proofHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  proofTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
  proofDetails: { gap: SPACING.sm },
  proofDetail: {},
  proofLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], fontWeight: '500' },
  proofValue: { fontSize: FONTS.sizes.sm, color: COLORS.gray[300], marginTop: 2 },
  proofLink: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.md, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.inputBg },
  proofLinkText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '500' },
  addProofButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.cardBg, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed' },
  addProofText: { color: COLORS.primary, fontWeight: '600' },
  anonymousToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.cardBg, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, ...SHADOWS.small },
  anonymousInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  anonymousTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
  anonymousDesc: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], marginTop: 2 },
  premiumBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.warning + '20', padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.warning + '50' },
  premiumContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  premiumTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
  premiumDesc: { fontSize: FONTS.sizes.sm, color: COLORS.gray[400], marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  centeredModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  modalContent: { backgroundColor: COLORS.cardBg, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary },
  settingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.sm, gap: SPACING.md },
  settingText: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.primary },
  logoutItem: { marginTop: SPACING.sm, backgroundColor: COLORS.error + '20' },
  input: { backgroundColor: COLORS.inputBg, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.primary, marginBottom: SPACING.sm },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  inputLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray[400], marginBottom: SPACING.xs },
  typeRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  typeBtn: { flex: 1, padding: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.inputBg, alignItems: 'center' },
  typeBtnActive: { backgroundColor: COLORS.primary },
  typeBtnText: { color: COLORS.gray[400], fontWeight: '500' },
  typeBtnTextActive: { color: COLORS.background, fontWeight: '600' },
  addButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', marginTop: SPACING.md },
  addButtonText: { color: COLORS.background, fontWeight: '600', fontSize: FONTS.sizes.lg },
  premiumIcon: { alignSelf: 'center', marginBottom: SPACING.md },
  premiumModalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary, textAlign: 'center', marginBottom: SPACING.xs },
  premiumModalDesc: { fontSize: FONTS.sizes.lg, color: COLORS.warning, textAlign: 'center', marginBottom: SPACING.lg },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  featureText: { color: COLORS.gray[300], fontSize: FONTS.sizes.md },
  subscribeButton: { backgroundColor: COLORS.warning, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', marginTop: SPACING.lg },
  subscribeButtonText: { color: COLORS.background, fontWeight: '600', fontSize: FONTS.sizes.lg },
  logoutModal: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, width: '100%', alignItems: 'center' },
  logoutTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.md },
  logoutDesc: { color: COLORS.gray[400], textAlign: 'center', marginTop: SPACING.sm, marginBottom: SPACING.lg },
  logoutButtons: { flexDirection: 'row', gap: SPACING.md },
  cancelButton: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', backgroundColor: COLORS.inputBg },
  cancelButtonText: { color: COLORS.gray[400], fontWeight: '600' },
  confirmLogoutButton: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', backgroundColor: COLORS.error },
  confirmLogoutText: { color: COLORS.white, fontWeight: '600' },
});