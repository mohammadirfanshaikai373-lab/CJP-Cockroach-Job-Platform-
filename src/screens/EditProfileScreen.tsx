import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { currentUser, updateProfile } = useApp();

  // Safe fallbacks if currentUser is null or missing fields
  const [name, setName] = useState(currentUser?.name || '');
  const [title, setTitle] = useState(currentUser?.title || '');
  const [company, setCompany] = useState(currentUser?.company || '');
  const [skills, setSkills] = useState(
    currentUser?.skills && Array.isArray(currentUser.skills) 
      ? currentUser.skills.join(', ') 
      : ''
  );
  const [selectedRole, setSelectedRole] = useState<'Seeker' | 'Mentor'>(
    currentUser?.role === 'Mentor' ? 'Mentor' : 'Seeker'
  );

  const handleSave = () => {
    if (!name.trim() || !title.trim()) {
      Alert.alert('Error', 'Name and title are required');
      return;
    }
    if (updateProfile) {
      updateProfile({
        name,
        title,
        company,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        role: selectedRole,
      });
    } else {
      Alert.alert('Error', 'Update profile function not available');
      return;
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <Image 
            source={{ uri: currentUser?.avatar || 'https://via.placeholder.com/100' }} 
            style={styles.avatar} 
          />
          <TouchableOpacity style={styles.changePhotoButton}>
            <Ionicons name="camera" size={20} color={COLORS.primary} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Enter your name" 
            placeholderTextColor={COLORS.gray?.[400] || '#999'} 
          />

          <Text style={styles.label}>Title *</Text>
          <TextInput 
            style={styles.input} 
            value={title} 
            onChangeText={setTitle} 
            placeholder="e.g., Software Developer" 
            placeholderTextColor={COLORS.gray?.[400] || '#999'} 
          />

          <Text style={styles.label}>Company / Institution</Text>
          <TextInput 
            style={styles.input} 
            value={company} 
            onChangeText={setCompany} 
            placeholder="Where do you work or study?" 
            placeholderTextColor={COLORS.gray?.[400] || '#999'} 
          />

          <Text style={styles.label}>Skills (comma separated)</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={skills} 
            onChangeText={setSkills} 
            placeholder="e.g., React, Python, UI/UX" 
            placeholderTextColor={COLORS.gray?.[400] || '#999'} 
            multiline 
            numberOfLines={3} 
          />
        </View>

        <View style={styles.roleSection}>
          <Text style={styles.sectionTitle}>Your Role</Text>
          <View style={styles.roleOptions}>
            <TouchableOpacity 
              style={[styles.roleOption, selectedRole === 'Seeker' && styles.roleOptionActive]} 
              onPress={() => setSelectedRole('Seeker')}
            >
              <Ionicons name="school-outline" size={24} color={selectedRole === 'Seeker' ? COLORS.background : COLORS.primary} />
              <Text style={[styles.roleOptionText, selectedRole === 'Seeker' && styles.roleOptionTextActive]}>Seeker</Text>
              <Text style={[styles.roleOptionDesc, selectedRole === 'Seeker' && styles.roleOptionDescActive]}>Student / Entry level</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.roleOption, selectedRole === 'Mentor' && styles.roleOptionActive]} 
              onPress={() => setSelectedRole('Mentor')}
            >
              <Ionicons name="briefcase-outline" size={24} color={selectedRole === 'Mentor' ? COLORS.background : COLORS.primary} />
              <Text style={[styles.roleOptionText, selectedRole === 'Mentor' && styles.roleOptionTextActive]}>Mentor</Text>
              <Text style={[styles.roleOptionDesc, selectedRole === 'Mentor' && styles.roleOptionDescActive]}>Employed 1+ year</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background || '#F9F5F2' },
  content: { flex: 1 },
  avatarSection: { alignItems: 'center', padding: SPACING.lg, backgroundColor: COLORS.cardBg || '#FFFFFF' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: SPACING.md, borderWidth: 3, borderColor: COLORS.accent || '#D9B48B' },
  changePhotoButton: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  changePhotoText: { fontSize: FONTS.sizes.md, color: COLORS.primary || '#381932', fontWeight: '500' },
  formSection: { padding: SPACING.md, backgroundColor: COLORS.cardBg || '#FFFFFF', marginBottom: SPACING.sm },
  label: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary || '#381932', marginBottom: SPACING.xs, marginTop: SPACING.md },
  input: { backgroundColor: COLORS.inputBg || '#F0EBE5', borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.text || '#1A1A1A' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  roleSection: { padding: SPACING.md, backgroundColor: COLORS.cardBg || '#FFFFFF', marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.primary || '#381932', marginBottom: SPACING.md },
  roleOptions: { flexDirection: 'row', gap: SPACING.md },
  roleOption: { flex: 1, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.primary || '#381932', alignItems: 'center' },
  roleOptionActive: { backgroundColor: COLORS.primary || '#381932' },
  roleOptionText: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.primary || '#381932', marginTop: SPACING.xs },
  roleOptionTextActive: { color: COLORS.background || '#F9F5F2' },
  roleOptionDesc: { fontSize: FONTS.sizes.sm, color: COLORS.gray?.[500] || '#999', marginTop: 2 },
  roleOptionDescActive: { color: (COLORS.background || '#F9F5F2') + '80' },
  bottomAction: { padding: SPACING.md, backgroundColor: COLORS.cardBg || '#FFFFFF', borderTopWidth: 1, borderTopColor: COLORS.inputBg || '#F0EBE5' },
  saveButton: { backgroundColor: COLORS.primary || '#381932', paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center' },
  saveButtonText: { color: COLORS.background || '#F9F5F2', fontWeight: '600', fontSize: FONTS.sizes.lg },
});