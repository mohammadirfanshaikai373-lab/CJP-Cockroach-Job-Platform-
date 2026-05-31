import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Challenge } from '../types';

type ChallengeDetailParams = {
  ChallengeDetail: {
    challenge: Challenge;
  };
};

export default function ChallengeDetailScreen() {
  const route = useRoute<RouteProp<ChallengeDetailParams, 'ChallengeDetail'>>();
  const { challenge } = route.params;
  const { users, addNotification } = useApp();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  const handleSubmit = () => {
    setShowSubmitModal(false);
    // In a real app, this would submit the solution
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Company Header */}
        <View style={styles.companyHeader}>
          <View style={styles.companyLogo}>
            <Ionicons name="business" size={32} color={COLORS.primary} />
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{challenge.company}</Text>
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={14} color={COLORS.warning} />
              <Text style={styles.timeText}>{challenge.timeLeft} left</Text>
            </View>
          </View>
        </View>

        {/* Challenge Title */}
        <View style={styles.titleSection}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <View style={styles.prizeBanner}>
            <Ionicons name="trophy" size={24} color={COLORS.warning} />
            <Text style={styles.prizeText}>{challenge.prize}</Text>
          </View>
        </View>

        {/* Tech Stack */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tech Stack</Text>
          <View style={styles.techStack}>
            {challenge.techStack.map((tech, index) => (
              <View key={index} style={styles.techTag}>
                <Text style={styles.techText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Challenge Description</Text>
          <Text style={styles.description}>
            Build a production-ready solution that demonstrates your technical skills and problem-solving abilities. Your submission will be reviewed by our engineering team, and top performers will skip the HR round and go directly to technical interviews.
          </Text>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {[
            'Write clean, well-documented code',
            'Include unit tests for critical functions',
            'Provide a README with setup instructions',
            'Deploy to a public URL (optional but recommended)',
          ].map((req, index) => (
            <View key={index} style={styles.requirementItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>

        {/* Mentor Review Info */}
        <View style={styles.mentorCard}>
          <View style={styles.mentorHeader}>
            <Ionicons name="person-circle" size={24} color={COLORS.primary} />
            <Text style={styles.mentorTitle}>Mentor Review Process</Text>
          </View>
          <Text style={styles.mentorDesc}>
            Your submission will be reviewed by a company mentor. If the mentor vouches for your solution, you'll skip the HR round and proceed directly to the technical interview.
          </Text>
          <View style={styles.mentorInfo}>
            <Image source={{ uri: users[0].avatar }} style={styles.mentorAvatar} />
            <View>
              <Text style={styles.mentorName}>Mentor: {users[0].name}</Text>
              <Text style={styles.mentorRole}>{users[0].title}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>{challenge.submissions}</Text>
            <Text style={styles.statLabel}>Submissions</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color={COLORS.accent} />
            <Text style={styles.statValue}>~150</Text>
            <Text style={styles.statLabel}>Viewing</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => setShowSubmitModal(true)}
        >
          <Ionicons name="cloud-upload-outline" size={20} color={COLORS.white} />
          <Text style={styles.submitButtonText}>Submit Solution</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Modal */}
      <Modal
        visible={showSubmitModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSubmitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Your Solution</Text>
              <TouchableOpacity onPress={() => setShowSubmitModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.gray[600]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Repository URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://github.com/username/repo"
              placeholderTextColor={COLORS.gray[400]}
              value={submissionLink}
              onChangeText={setSubmissionLink}
            />

            <Text style={styles.modalLabel}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any notes about your approach..."
              placeholderTextColor={COLORS.gray[400]}
              value={submissionNotes}
              onChangeText={setSubmissionNotes}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity style={styles.submitModalButton} onPress={handleSubmit}>
              <Text style={styles.submitModalButtonText}>Submit Challenge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  companyLogo: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.accent + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 4,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.warning,
    fontWeight: '600',
  },
  titleSection: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
  },
  challengeTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  prizeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '15',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  prizeText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.black,
  },
  section: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  techTag: {
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  techText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  description: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray[700],
    lineHeight: 24,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  requirementText: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.gray[700],
  },
  mentorCard: {
    margin: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.primary + '10',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  mentorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  mentorTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  mentorDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[700],
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  mentorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  mentorName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.black,
  },
  mentorRole: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[600],
  },
  statsRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.black,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  bottomAction: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONTS.sizes.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.black,
  },
  modalLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitModalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  submitModalButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONTS.sizes.lg,
  },
});
