import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Linking, Platform,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Job } from '../types';

type JobDetailParams = { JobDetail: { jobId: string } };

export default function JobDetailScreen() {
  const route = useRoute<RouteProp<JobDetailParams, 'JobDetail'>>();
  const { jobs, applyToJob, saveJob, addNotification } = useApp();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  const job = jobs.find(j => j.id === route.params?.jobId);
  if (!job) return <View style={styles.container}><Text style={styles.errorText}>Job not found</Text></View>;

  const handleApply = () => {
    if (job.assessment) { setShowAssessmentModal(true); }
    else { setShowApplyModal(true); }
  };

  const submitApplication = () => {
    applyToJob(job.id);
    setShowApplyModal(false);
    setCoverLetter('');
  };

  const startAssessment = () => {
    setShowAssessmentModal(false);
    setShowApplyModal(true);
    addNotification(`Assessment started: ${job.assessment?.title}`, 'job');
  };

  const handleCall = () => { Linking.openURL(`tel:${job.contact.phone}`); };
  const handleEmail = () => { Linking.openURL(`mailto:${job.contact.email}`); };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyLogo}><Ionicons name="business" size={32} color={COLORS.primary} /></View>
          <View style={styles.headerInfo}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.companyName}>{job.company}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={16} color={COLORS.gray[500]} />
              <Text style={styles.metaText}>{job.location}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.metaText}>{job.type}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statValue}>{job.salary}</Text><Text style={styles.statLabel}>Salary</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>{job.experience}</Text><Text style={styles.statLabel}>Experience</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>{job.applicants}</Text><Text style={styles.statLabel}>Applicants</Text></View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {job.requirements.map((req, i) => (
            <View key={i} style={styles.listItem}><Ionicons name="checkmark-circle" size={18} color={COLORS.success} /><Text style={styles.listText}>{req}</Text></View>
          ))}
        </View>

        {/* Responsibilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsibilities</Text>
          {job.responsibilities.map((resp, i) => (
            <View key={i} style={styles.listItem}><Ionicons name="arrow-forward" size={18} color={COLORS.primary} /><Text style={styles.listText}>{resp}</Text></View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Skills</Text>
          <View style={styles.skillsContainer}>
            {job.skills.map((skill, i) => (<View key={i} style={styles.skillTag}><Text style={styles.skillText}>{skill}</Text></View>))}
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <View style={styles.benefitsContainer}>
            {job.benefits.map((benefit, i) => (
              <View key={i} style={styles.benefitItem}><Ionicons name="gift" size={16} color={COLORS.accent} /><Text style={styles.benefitText}>{benefit}</Text></View>
            ))}
          </View>
        </View>

        {/* Assessment */}
        {job.assessment && (
          <View style={styles.assessmentCard}>
            <View style={styles.assessmentHeader}><Ionicons name="list-circle" size={24} color={COLORS.primary} /><Text style={styles.assessmentTitle}>Skills Assessment Required</Text></View>
            <Text style={styles.assessmentName}>{job.assessment.title}</Text>
            <View style={styles.assessmentMeta}>
              <Text style={styles.assessmentMetaText}>⏱ {job.assessment.duration}</Text>
              <Text style={styles.assessmentMetaText}>📝 {job.assessment.questions} questions</Text>
              <Text style={styles.assessmentMetaText}>✅ {job.assessment.passingScore}% to pass</Text>
            </View>
          </View>
        )}

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            <Text style={styles.contactName}>{job.contact.name}</Text>
            <Text style={styles.contactRole}>HR / Recruiter</Text>
            <View style={styles.contactActions}>
              <TouchableOpacity style={styles.contactButton} onPress={handleCall}><Ionicons name="call" size={18} color={COLORS.primary} /><Text style={styles.contactButtonText}>Call</Text></TouchableOpacity>
              <TouchableOpacity style={styles.contactButton} onPress={handleEmail}><Ionicons name="mail" size={18} color={COLORS.primary} /><Text style={styles.contactButtonText}>Email</Text></TouchableOpacity>
            </View>
            <View style={styles.contactDetails}>
              <View style={styles.contactDetail}><Ionicons name="call-outline" size={16} color={COLORS.gray[500]} /><Text style={styles.contactDetailText}>{job.contact.phone}</Text></View>
              <View style={styles.contactDetail}><Ionicons name="mail-outline" size={16} color={COLORS.gray[500]} /><Text style={styles.contactDetailText}>{job.contact.email}</Text></View>
              <View style={styles.contactDetail}><Ionicons name="logo-linkedin" size={16} color={COLORS.primary} /><Text style={styles.contactDetailText}>{job.contact.linkedin}</Text></View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.saveButton} onPress={() => saveJob(job.id)}>
          <Ionicons name={job.isSaved ? 'bookmark' : 'bookmark-outline'} size={22} color={job.isSaved ? COLORS.primary : COLORS.gray[500]} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.applyButton, job.isApplied && styles.appliedButton]} 
          onPress={job.isApplied ? undefined : handleApply}
        >
          <Ionicons name={job.isApplied ? 'checkmark-circle' : 'send'} size={20} color={COLORS.white} />
          <Text style={styles.applyButtonText}>{job.isApplied ? 'Applied' : 'Apply Now'}</Text>
        </TouchableOpacity>
      </View>

      {/* Apply Modal */}
      <Modal visible={showApplyModal} animationType="slide" transparent onRequestClose={() => setShowApplyModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for {job.title}</Text>
              <TouchableOpacity onPress={() => setShowApplyModal(false)}><Ionicons name="close" size={24} color={COLORS.primary} /></TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Resume/CV URL</Text>
            <TextInput style={styles.input} placeholder="https://drive.google.com/..." placeholderTextColor={COLORS.gray[400]} value={resumeUrl} onChangeText={setResumeUrl} />
            <Text style={styles.inputLabel}>Cover Letter (Optional)</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Tell us why you're a great fit..." placeholderTextColor={COLORS.gray[400]} value={coverLetter} onChangeText={setCoverLetter} multiline numberOfLines={4} />
            <TouchableOpacity style={styles.submitButton} onPress={submitApplication}><Text style={styles.submitButtonText}>Submit Application</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Assessment Modal */}
      <Modal visible={showAssessmentModal} animationType="slide" transparent onRequestClose={() => setShowAssessmentModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="list-circle" size={64} color={COLORS.primary} style={styles.assessmentIcon} />
            <Text style={styles.assessmentModalTitle}>Skills Assessment Required</Text>
            <Text style={styles.assessmentModalDesc}>This job requires you to complete a skills assessment before applying.</Text>
            <View style={styles.assessmentDetails}>
              <Text style={styles.assessmentDetailText}>• {job.assessment?.title}</Text>
              <Text style={styles.assessmentDetailText}>• Duration: {job.assessment?.duration}</Text>
              <Text style={styles.assessmentDetailText}>• {job.assessment?.questions} questions</Text>
              <Text style={styles.assessmentDetailText}>• Passing score: {job.assessment?.passingScore}%</Text>
            </View>
            <TouchableOpacity style={styles.startAssessmentButton} onPress={startAssessment}><Text style={styles.startAssessmentText}>Start Assessment</Text></TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={() => setShowAssessmentModal(false)}><Text style={styles.skipText}>Maybe Later</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', backgroundColor: COLORS.white, padding: SPACING.lg },
  companyLogo: { width: 64, height: 64, borderRadius: BORDER_RADIUS.lg, backgroundColor: COLORS.accent + '30', alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  headerInfo: { flex: 1 },
  jobTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text },
  companyName: { fontSize: FONTS.sizes.md, color: COLORS.gray[600], marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.xs, gap: 4 },
  metaText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  dot: { color: COLORS.gray[400] },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, alignItems: 'center', ...SHADOWS.small },
  statValue: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.primary },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray[500], marginTop: 2 },
  section: { backgroundColor: COLORS.white, padding: SPACING.md, marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  description: { fontSize: FONTS.sizes.md, color: COLORS.gray[700], lineHeight: 24 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.sm, gap: SPACING.sm },
  listText: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.gray[700] },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  skillTag: { backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.round },
  skillText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '500' },
  benefitsContainer: { gap: SPACING.sm },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  benefitText: { fontSize: FONTS.sizes.md, color: COLORS.gray[700] },
  assessmentCard: { backgroundColor: COLORS.primary + '10', margin: SPACING.md, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.primary + '30' },
  assessmentHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  assessmentTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
  assessmentName: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  assessmentMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  assessmentMetaText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600] },
  contactCard: { backgroundColor: COLORS.gray[100], padding: SPACING.md, borderRadius: BORDER_RADIUS.lg },
  contactName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  contactRole: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], marginBottom: SPACING.md },
  contactActions: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  contactButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, backgroundColor: COLORS.white, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.primary },
  contactButtonText: { color: COLORS.primary, fontWeight: '500' },
  contactDetails: { gap: SPACING.sm },
  contactDetail: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  contactDetailText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600] },
  bottomActions: { flexDirection: 'row', padding: SPACING.md, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray[200], gap: SPACING.sm },
  saveButton: { padding: SPACING.md, backgroundColor: COLORS.gray[100], borderRadius: BORDER_RADIUS.lg },
  applyButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, gap: SPACING.xs },
  appliedButton: { backgroundColor: COLORS.success },
  applyButtonText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.lg },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text },
  inputLabel: { fontSize: FONTS.sizes.sm, fontWeight: '500', color: COLORS.text, marginBottom: SPACING.xs },
  input: { backgroundColor: COLORS.gray[100], borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.text, marginBottom: SPACING.md },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  submitButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center' },
  submitButtonText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.lg },
  assessmentIcon: { alignSelf: 'center', marginBottom: SPACING.md },
  assessmentModalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.sm },
  assessmentModalDesc: { fontSize: FONTS.sizes.md, color: COLORS.gray[600], textAlign: 'center', marginBottom: SPACING.lg },
  assessmentDetails: { backgroundColor: COLORS.gray[100], padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.lg },
  assessmentDetailText: { fontSize: FONTS.sizes.md, color: COLORS.gray[700], marginBottom: SPACING.xs },
  startAssessmentButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', marginBottom: SPACING.sm },
  startAssessmentText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.lg },
  skipButton: { paddingVertical: SPACING.md, alignItems: 'center' },
  skipText: { color: COLORS.gray[500], fontWeight: '500' },
  errorText: { color: COLORS.gray[500], textAlign: 'center', marginTop: SPACING.xl },
});
