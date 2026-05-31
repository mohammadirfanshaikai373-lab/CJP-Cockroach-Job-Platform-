import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS, URGENCY_COLORS, COMMITMENT_TYPES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { FeedPost, CommitmentType } from '../types';

type PostDetailParams = {
  PostDetail: { post: FeedPost };
};

export default function PostDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<PostDetailParams, 'PostDetail'>>();
  const { post } = route.params;
  const { createCommitment, sendConnectionRequest, thankPost, addNotification, currentUser } = useApp();
  
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  const [selectedType, setSelectedType] = useState<CommitmentType>(post.commitmentType);
  const [dueDate, setDueDate] = useState<string>('2 hours');
  const [message, setMessage] = useState('');
  const [isThanked, setIsThanked] = useState(post.isThanked);
  const [thankCount, setThankCount] = useState(post.thanks);

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleCreateCommitment = () => {
    const dueHours = parseInt(dueDate.split(' ')[0]) || 2;
    const dueDateObj = new Date(Date.now() + dueHours * 60 * 60 * 1000);
    createCommitment(post.id, selectedType, dueDateObj);
    setShowCommitmentModal(false);
    navigation.goBack();
  };

  const handleThank = () => {
    if (!isThanked) {
      thankPost(post.id);
      setIsThanked(true);
      setThankCount(prev => prev + 1);
    }
  };

  const handleConnect = () => {
    sendConnectionRequest(post.author.id);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.authorSection}>
          <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
          <View style={styles.authorInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <View style={[styles.roleBadge, { backgroundColor: post.author.role === 'Mentor' ? COLORS.primary : COLORS.accent }]}>
                <Text style={styles.roleText}>{post.author.role}</Text>
              </View>
            </View>
            <Text style={styles.authorTitle}>{post.author.title}</Text>
            {post.author.company && <Text style={styles.authorCompany}>{post.author.company}</Text>}
          </View>
          <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
            <Ionicons name="person-add-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.postSection}>
          <View style={styles.urgencyRow}>
            <View style={[styles.urgencyBadge, { backgroundColor: URGENCY_COLORS[post.urgency] + '30' }]}>
              <View style={[styles.urgencyDot, { backgroundColor: URGENCY_COLORS[post.urgency] }]} />
              <Text style={[styles.urgencyText, { color: URGENCY_COLORS[post.urgency] }]}>{post.urgency} priority</Text>
            </View>
            <Text style={styles.timeAgo}>{getTimeAgo(post.createdAt)}</Text>
          </View>

          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDescription}>{post.description}</Text>

          <View style={styles.skillsContainer}>
            {post.skillTags.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>

          <View style={styles.commitmentInfo}>
            <Ionicons name={COMMITMENT_TYPES[post.commitmentType].icon} size={20} color={COLORS.primary} />
            <Text style={styles.commitmentLabel}>Commitment Type:</Text>
            <Text style={styles.commitmentValue}>{COMMITMENT_TYPES[post.commitmentType].label}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Author's Skills</Text>
          <View style={styles.authorSkills}>
            {post.author.skills.map((skill, index) => (
              <View key={index} style={styles.authorSkillTag}>
                <Text style={styles.authorSkillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statItem} onPress={handleThank}>
            <Ionicons name={isThanked ? 'heart' : 'heart-outline'} size={24} color={isThanked ? COLORS.accent : COLORS.gray[400]} />
            <Text style={styles.statValue}>{thankCount}</Text>
            <Text style={styles.statLabel}>Thanks</Text>
          </TouchableOpacity>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            <Text style={styles.statValue}>{post.author.reputation.completedCommitments}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.sendHelpButton} onPress={() => setShowCommitmentModal(true)}>
          <Ionicons name="hand-left" size={20} color={COLORS.background} />
          <Text style={styles.sendHelpText}>Send Help</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showCommitmentModal} animationType="slide" transparent onRequestClose={() => setShowCommitmentModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Commitment</Text>
              <TouchableOpacity onPress={() => setShowCommitmentModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Commitment Type</Text>
              <View style={styles.typeOptions}>
                {(Object.keys(COMMITMENT_TYPES) as CommitmentType[]).map((type) => (
                  <TouchableOpacity key={type} style={[styles.typeOption, selectedType === type && styles.typeOptionSelected]} onPress={() => setSelectedType(type)}>
                    <Ionicons name={COMMITMENT_TYPES[type].icon} size={20} color={selectedType === type ? COLORS.background : COLORS.primary} />
                    <Text style={[styles.typeOptionText, selectedType === type && styles.typeOptionTextSelected]}>{COMMITMENT_TYPES[type].label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Due Date</Text>
              <View style={styles.dateOptions}>
                {['2 hours', '6 hours', '24 hours', '3 days', '1 week'].map((date) => (
                  <TouchableOpacity key={date} style={[styles.dateOption, dueDate === date && styles.dateOptionSelected]} onPress={() => setDueDate(date)}>
                    <Text style={[styles.dateOptionText, dueDate === date && styles.dateOptionTextSelected]}>{date}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Message (Optional)</Text>
              <TextInput style={styles.messageInput} placeholder="Add a message to your help offer..." placeholderTextColor={COLORS.gray[400]} value={message} onChangeText={setMessage} multiline numberOfLines={4} />
            </ScrollView>

            <TouchableOpacity style={styles.createButton} onPress={handleCreateCommitment}>
              <Text style={styles.createButtonText}>Create Commitment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1 },
  authorSection: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, backgroundColor: COLORS.cardBg, borderBottomWidth: 1, borderBottomColor: COLORS.inputBg },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: SPACING.md, borderWidth: 2, borderColor: COLORS.accent },
  authorInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  authorName: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.primary },
  roleBadge: { paddingHorizontal: SPACING.xs, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  roleText: { fontSize: FONTS.sizes.xs, color: COLORS.background, fontWeight: '600' },
  authorTitle: { fontSize: FONTS.sizes.md, color: COLORS.gray[400], marginTop: 2 },
  authorCompany: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  connectButton: { padding: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary + '20' },
  postSection: { padding: SPACING.md, backgroundColor: COLORS.cardBg, marginBottom: SPACING.sm },
  urgencyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  urgencyBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.round, gap: 4 },
  urgencyDot: { width: 8, height: 8, borderRadius: 4 },
  urgencyText: { fontSize: FONTS.sizes.sm, fontWeight: '600', textTransform: 'capitalize' },
  timeAgo: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  postTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.sm },
  postDescription: { fontSize: FONTS.sizes.md, color: COLORS.gray[300], lineHeight: 24, marginBottom: SPACING.md },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  skillTag: { backgroundColor: COLORS.accent + '40', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.round },
  skillText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '500' },
  commitmentInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, padding: SPACING.md, backgroundColor: COLORS.primary + '20', borderRadius: BORDER_RADIUS.md },
  commitmentLabel: { fontSize: FONTS.sizes.md, color: COLORS.gray[400] },
  commitmentValue: { fontSize: FONTS.sizes.md, color: COLORS.primary, fontWeight: '600' },
  section: { padding: SPACING.md, backgroundColor: COLORS.cardBg, marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.primary, marginBottom: SPACING.sm },
  authorSkills: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  authorSkillTag: { backgroundColor: COLORS.inputBg, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.round },
  authorSkillText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[300] },
  statsRow: { flexDirection: 'row', padding: SPACING.md, backgroundColor: COLORS.cardBg, marginBottom: SPACING.lg, gap: SPACING.lg },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  statValue: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.primary },
  statLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  bottomAction: { padding: SPACING.md, backgroundColor: COLORS.cardBg, borderTopWidth: 1, borderTopColor: COLORS.inputBg },
  sendHelpButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, gap: SPACING.sm },
  sendHelpText: { color: COLORS.background, fontWeight: '600', fontSize: FONTS.sizes.lg },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.cardBg, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary },
  modalLabel: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary, marginBottom: SPACING.sm, marginTop: SPACING.md },
  typeOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  typeOption: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.primary },
  typeOptionSelected: { backgroundColor: COLORS.primary },
  typeOptionText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '500' },
  typeOptionTextSelected: { color: COLORS.background },
  dateOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  dateOption: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg, backgroundColor: COLORS.inputBg },
  dateOptionSelected: { backgroundColor: COLORS.accent },
  dateOptionText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[300], fontWeight: '500' },
  dateOptionTextSelected: { color: COLORS.primary },
  messageInput: { backgroundColor: COLORS.inputBg, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.primary, minHeight: 100, textAlignVertical: 'top' },
  createButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', marginTop: SPACING.lg },
  createButtonText: { color: COLORS.background, fontWeight: '600', fontSize: FONTS.sizes.lg },
});
