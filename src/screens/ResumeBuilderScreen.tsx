import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, Platform, ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Resume } from '../types';

export default function ResumeBuilderScreen() {
  const { resumes, createResume, updateResume, deleteResume, currentUser, addNotification } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [newResumeName, setNewResumeName] = useState('');
  const [newResumeTemplate, setNewResumeTemplate] = useState<Resume['template']>('modern');

  const templates: { id: Resume['template']; name: string; color: string }[] = [
    { id: 'modern', name: 'Modern', color: COLORS.primary },
    { id: 'classic', name: 'Classic', color: COLORS.gray[800] },
    { id: 'minimal', name: 'Minimal', color: COLORS.gray[600] },
    { id: 'professional', name: 'Professional', color: COLORS.info },
  ];

  const handleCreateResume = () => {
    if (!newResumeName.trim()) { Alert.alert('Error', 'Please enter a resume name'); return; }
    createResume(newResumeName, newResumeTemplate);
    setNewResumeName('');
    setShowCreateModal(false);
  };

  const handleEditResume = (resume: Resume) => {
    setSelectedResume(resume);
    setShowEditModal(true);
  };

  const handlePreviewResume = (resume: Resume) => {
    setSelectedResume(resume);
    setShowPreviewModal(true);
  };

  const handleDeleteResume = (resumeId: string) => {
    Alert.alert('Delete Resume', 'Are you sure you want to delete this resume?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteResume(resumeId) },
    ]);
  };

  const handleDownloadResume = (resume: Resume) => {
    addNotification(`${resume.name} downloaded successfully!`, 'success');
  };

  const handleImportFromProfile = () => {
    if (selectedResume) {
      updateResume(selectedResume.id, {
        skills: currentUser.skills,
        summary: currentUser.about,
        languages: currentUser.languages,
      });
      addNotification('Profile data imported!', 'success');
    }
  };

  const renderResume = ({ item }: { item: Resume }) => (
    <View style={styles.resumeCard}>
      <View style={[styles.resumePreview, { backgroundColor: templates.find(t => t.id === item.template)?.color || COLORS.primary }]}>
        <View style={styles.previewHeader}>
          <View style={styles.previewAvatar} />
          <View style={styles.previewInfo}>
            <View style={styles.previewLine} />
            <View style={[styles.previewLine, { width: '60%' }]} />
          </View>
        </View>
        <View style={styles.previewContent}>
          <View style={styles.previewSection} />
          <View style={styles.previewSection} />
        </View>
      </View>
      <View style={styles.resumeInfo}>
        <Text style={styles.resumeName}>{item.name}</Text>
        <Text style={styles.resumeDate}>Updated {new Date(item.updatedAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.resumeActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEditResume(item)}>
          <Ionicons name="pencil" size={18} color={COLORS.primary} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handlePreviewResume(item)}>
          <Ionicons name="eye-outline" size={18} color={COLORS.info} />
          <Text style={styles.actionText}>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDownloadResume(item)}>
          <Ionicons name="download-outline" size={18} color={COLORS.success} />
          <Text style={styles.actionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteResume(item.id)}>
          <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resume Builder</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowCreateModal(true)}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.tipsBanner}>
        <Ionicons name="bulb-outline" size={20} color={COLORS.warning} />
        <Text style={styles.tipsText}>Tip: Import your profile data to quickly fill your resume!</Text>
      </View>

      <FlatList
        data={resumes}
        renderItem={renderResume}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={COLORS.gray[300]} />
            <Text style={styles.emptyTitle}>No resumes yet</Text>
            <Text style={styles.emptySubtitle}>Create your first resume to get started</Text>
            <TouchableOpacity style={styles.createFirstButton} onPress={() => setShowCreateModal(true)}>
              <Text style={styles.createFirstText}>Create Resume</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Create Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent onRequestClose={() => setShowCreateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Resume</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}><Ionicons name="close" size={24} color={COLORS.primary} /></TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Resume Name</Text>
            <TextInput style={styles.input} placeholder="e.g., My Resume" placeholderTextColor={COLORS.gray[400]} value={newResumeName} onChangeText={setNewResumeName} />
            <Text style={styles.inputLabel}>Choose Template</Text>
            <View style={styles.templatesGrid}>
              {templates.map((template) => (
                <TouchableOpacity key={template.id} style={[styles.templateOption, newResumeTemplate === template.id && styles.templateOptionActive]} onPress={() => setNewResumeTemplate(template.id)}>
                  <View style={[styles.templatePreview, { backgroundColor: template.color }]} />
                  <Text style={[styles.templateName, newResumeTemplate === template.id && styles.templateNameActive]}>{template.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateResume}><Text style={styles.createButtonText}>Create Resume</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Resume</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}><Ionicons name="close" size={24} color={COLORS.primary} /></TouchableOpacity>
            </View>
            {selectedResume && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.importButton} onPress={handleImportFromProfile}>
                  <Ionicons name="download-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.importText}>Import from Profile</Text>
                </TouchableOpacity>
                
                <Text style={styles.inputLabel}>Professional Summary</Text>
                <TextInput style={[styles.input, styles.textArea]} placeholder="Write a brief summary..." placeholderTextColor={COLORS.gray[400]} value={selectedResume.summary} onChangeText={(text) => updateResume(selectedResume.id, { summary: text })} multiline numberOfLines={4} />
                
                <Text style={styles.inputLabel}>Skills (comma separated)</Text>
                <TextInput style={styles.input} placeholder="React, Node.js, Python..." placeholderTextColor={COLORS.gray[400]} value={selectedResume.skills.join(', ')} onChangeText={(text) => updateResume(selectedResume.id, { skills: text.split(',').map(s => s.trim()).filter(Boolean) })} />
                
                <Text style={styles.inputLabel}>Languages (comma separated)</Text>
                <TextInput style={styles.input} placeholder="English, Hindi..." placeholderTextColor={COLORS.gray[400]} value={selectedResume.languages.join(', ')} onChangeText={(text) => updateResume(selectedResume.id, { languages: text.split(',').map(s => s.trim()).filter(Boolean) })} />
                
                <Text style={styles.inputLabel}>Certifications (comma separated)</Text>
                <TextInput style={styles.input} placeholder="AWS Certified, Google Cloud..." placeholderTextColor={COLORS.gray[400]} value={selectedResume.certifications.join(', ')} onChangeText={(text) => updateResume(selectedResume.id, { certifications: text.split(',').map(s => s.trim()).filter(Boolean) })} />
                
                <Text style={styles.sectionTitle}>Experience</Text>
                <TouchableOpacity style={styles.addItemButton}>
                  <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.addItemText}>Add Experience</Text>
                </TouchableOpacity>
                
                <Text style={styles.sectionTitle}>Education</Text>
                <TouchableOpacity style={styles.addItemButton}>
                  <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.addItemText}>Add Education</Text>
                </TouchableOpacity>
                
                <Text style={styles.sectionTitle}>Projects</Text>
                <TouchableOpacity style={styles.addItemButton}>
                  <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.addItemText}>Add Project</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
            <TouchableOpacity style={styles.saveButton} onPress={() => { addNotification('Resume saved!', 'success'); setShowEditModal(false); }}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal visible={showPreviewModal} animationType="slide" transparent onRequestClose={() => setShowPreviewModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.previewModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Preview: {selectedResume?.name}</Text>
              <TouchableOpacity onPress={() => setShowPreviewModal(false)}><Ionicons name="close" size={24} color={COLORS.primary} /></TouchableOpacity>
            </View>
            {selectedResume && (
              <ScrollView style={styles.previewScroll} showsVerticalScrollIndicator={false}>
                <View style={[styles.previewDocument, { borderColor: templates.find(t => t.id === selectedResume.template)?.color || COLORS.primary }]}>
                  <View style={styles.previewDocHeader}>
                    <Text style={styles.previewDocName}>{currentUser.name}</Text>
                    <Text style={styles.previewDocTitle}>{currentUser.title}</Text>
                    <Text style={styles.previewDocContact}>{currentUser.email} | {currentUser.phone}</Text>
                  </View>
                  {selectedResume.summary ? (
                    <View style={styles.previewDocSection}>
                      <Text style={styles.previewDocSectionTitle}>Professional Summary</Text>
                      <Text style={styles.previewDocText}>{selectedResume.summary}</Text>
                    </View>
                  ) : null}
                  {selectedResume.skills.length > 0 ? (
                    <View style={styles.previewDocSection}>
                      <Text style={styles.previewDocSectionTitle}>Skills</Text>
                      <Text style={styles.previewDocText}>{selectedResume.skills.join(' • ')}</Text>
                    </View>
                  ) : null}
                  {selectedResume.languages.length > 0 ? (
                    <View style={styles.previewDocSection}>
                      <Text style={styles.previewDocSectionTitle}>Languages</Text>
                      <Text style={styles.previewDocText}>{selectedResume.languages.join(' • ')}</Text>
                    </View>
                  ) : null}
                </View>
              </ScrollView>
            )}
            <View style={styles.previewActions}>
              <TouchableOpacity style={styles.previewActionButton} onPress={() => selectedResume && handleDownloadResume(selectedResume)}>
                <Ionicons name="download-outline" size={20} color={COLORS.white} />
                <Text style={styles.previewActionText}>Download PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.previewActionButtonSecondary} onPress={() => selectedResume && handleEditResume(selectedResume)}>
                <Ionicons name="pencil" size={20} color={COLORS.primary} />
                <Text style={styles.previewActionTextSecondary}>Edit</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray[200] },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.text },
  addButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  tipsBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.warning + '20', margin: SPACING.md, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, gap: SPACING.sm },
  tipsText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.gray[700] },
  listContent: { padding: SPACING.md },
  resumeCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.md, ...SHADOWS.medium, overflow: 'hidden' },
  resumePreview: { height: 100, padding: SPACING.sm },
  previewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  previewAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.3)' },
  previewInfo: { marginLeft: SPACING.sm, flex: 1 },
  previewLine: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, marginBottom: 4, width: '80%' },
  previewContent: { flexDirection: 'row', gap: SPACING.sm },
  previewSection: { flex: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: BORDER_RADIUS.sm },
  resumeInfo: { padding: SPACING.md },
  resumeName: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.text },
  resumeDate: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], marginTop: 2 },
  resumeActions: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.gray[100] },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: SPACING.xs },
  actionText: { fontSize: FONTS.sizes.xs, color: COLORS.gray[600] },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: '600', color: COLORS.gray[600], marginTop: SPACING.md },
  emptySubtitle: { fontSize: FONTS.sizes.md, color: COLORS.gray[500], marginTop: SPACING.xs, marginBottom: SPACING.lg },
  createFirstButton: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg },
  createFirstText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.md },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, maxHeight: '80%' },
  editModalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, maxHeight: '90%' },
  previewModalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, maxHeight: '90%', flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text },
  inputLabel: { fontSize: FONTS.sizes.sm, fontWeight: '500', color: COLORS.text, marginBottom: SPACING.xs, marginTop: SPACING.sm },
  input: { backgroundColor: COLORS.gray[100], borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.text },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  templatesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  templateOption: { width: '48%', padding: SPACING.sm, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.gray[200] },
  templateOptionActive: { borderColor: COLORS.primary },
  templatePreview: { height: 60, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.xs },
  templateName: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600], textAlign: 'center' },
  templateNameActive: { color: COLORS.primary, fontWeight: '600' },
  createButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center' },
  createButtonText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.lg },
  importButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.accent + '20', borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.md },
  importText: { color: COLORS.primary, fontWeight: '600' },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text, marginTop: SPACING.md, marginBottom: SPACING.sm },
  addItemButton: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.gray[100], borderRadius: BORDER_RADIUS.md },
  addItemText: { color: COLORS.primary, fontWeight: '500' },
  saveButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', marginTop: SPACING.lg },
  saveButtonText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.lg },
  previewScroll: { flex: 1 },
  previewDocument: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 2, marginBottom: SPACING.md },
  previewDocHeader: { borderBottomWidth: 1, borderBottomColor: COLORS.gray[200], paddingBottom: SPACING.md, marginBottom: SPACING.md },
  previewDocName: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text },
  previewDocTitle: { fontSize: FONTS.sizes.md, color: COLORS.gray[600], marginTop: 2 },
  previewDocContact: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], marginTop: SPACING.xs },
  previewDocSection: { marginBottom: SPACING.md },
  previewDocSectionTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs, borderBottomWidth: 1, borderBottomColor: COLORS.gray[200], paddingBottom: SPACING.xs },
  previewDocText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[700], lineHeight: 20 },
  previewActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  previewActionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, gap: SPACING.sm },
  previewActionText: { color: COLORS.white, fontWeight: '600' },
  previewActionButtonSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.gray[100], paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, gap: SPACING.sm, paddingHorizontal: SPACING.lg },
  previewActionTextSecondary: { color: COLORS.primary, fontWeight: '600' },
});
