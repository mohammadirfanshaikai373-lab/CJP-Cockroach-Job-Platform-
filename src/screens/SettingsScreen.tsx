import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const APP_LOGO = require('../../assets/logo.png');

export default function SettingsScreen() {
  const { logout } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleLogout = () => { setShowLogoutModal(false); logout(); };

  return (
    <View style={styles.container}>
      {/* ✅ NO custom header – the drawer provides its own hamburger */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <TouchableOpacity style={styles.settingItem} onPress={() => setShowPrivacyModal(true)}>
            <Ionicons name="shield-outline" size={22} color={COLORS.gray[600]} />
            <Text style={styles.settingText}>Privacy Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
          <View style={styles.settingItem}>
            <Ionicons name="eye-off-outline" size={22} color={COLORS.gray[600]} />
            <Text style={styles.settingText}>Private Account</Text>
            <Switch value={isPrivate} onValueChange={setIsPrivate} trackColor={{ false: COLORS.gray[300], true: COLORS.primary }} />
          </View>
          <View style={styles.settingItem}>
            <Ionicons name="pulse-outline" size={22} color={COLORS.gray[600]} />
            <Text style={styles.settingText}>Show Activity Status</Text>
            <Switch value={showActivity} onValueChange={setShowActivity} trackColor={{ false: COLORS.gray[300], true: COLORS.primary }} />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.gray[600]} />
            <Text style={styles.settingText}>Push Notifications</Text>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: COLORS.gray[300], true: COLORS.primary }} />
          </View>
          <View style={styles.settingItem}>
            <Ionicons name="mail-outline" size={22} color={COLORS.gray[600]} />
            <Text style={styles.settingText}>Email Digest</Text>
            <Switch value={emailDigest} onValueChange={setEmailDigest} trackColor={{ false: COLORS.gray[300], true: COLORS.primary }} />
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="language-outline" size={22} color={COLORS.gray[600]} />
            <Text style={styles.settingText}>Language</Text>
            <Text style={styles.settingValue}>English</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.settingItem} onPress={() => setShowHelpModal(true)}>
            <Ionicons name="help-circle-outline" size={22} color={COLORS.gray[600]} />
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => setShowAboutModal(true)}>
            <Ionicons name="information-circle-outline" size={22} color={COLORS.gray[600]} />
            <Text style={styles.settingText}>About CJP Connect</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => setShowLogoutModal(true)}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      {/* Privacy Modal (simplified) */}
      <Modal visible={showPrivacyModal} animationType="slide" transparent onRequestClose={() => setShowPrivacyModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Privacy Settings</Text><TouchableOpacity onPress={() => setShowPrivacyModal(false)}><Ionicons name="close" size={24} color={COLORS.primary} /></TouchableOpacity></View>
            <View style={styles.privacyOption}>
              <Text style={styles.privacyOptionTitle}>Who can see your profile?</Text>
              <View style={styles.privacyOptions}><TouchableOpacity style={[styles.privacyOptionBtn, styles.privacyOptionBtnActive]}><Text style={[styles.privacyOptionText, styles.privacyOptionTextActive]}>Everyone</Text></TouchableOpacity><TouchableOpacity style={styles.privacyOptionBtn}><Text style={styles.privacyOptionText}>Connections</Text></TouchableOpacity><TouchableOpacity style={styles.privacyOptionBtn}><Text style={styles.privacyOptionText}>Only Me</Text></TouchableOpacity></View>
            </View>
            <View style={styles.privacyOption}>
              <Text style={styles.privacyOptionTitle}>Who can message you?</Text>
              <View style={styles.privacyOptions}><TouchableOpacity style={[styles.privacyOptionBtn, styles.privacyOptionBtnActive]}><Text style={[styles.privacyOptionText, styles.privacyOptionTextActive]}>Everyone</Text></TouchableOpacity><TouchableOpacity style={styles.privacyOptionBtn}><Text style={styles.privacyOptionText}>Connections</Text></TouchableOpacity></View>
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowPrivacyModal(false)}><Text style={styles.modalButtonText}>Save Changes</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Help Modal */}
      <Modal visible={showHelpModal} animationType="slide" transparent onRequestClose={() => setShowHelpModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Help & Support</Text><TouchableOpacity onPress={() => setShowHelpModal(false)}><Ionicons name="close" size={24} color={COLORS.primary} /></TouchableOpacity></View>
            <TouchableOpacity style={styles.helpItem}><Ionicons name="book-outline" size={22} color={COLORS.primary} /><Text style={styles.helpItemText}>User Guide</Text></TouchableOpacity>
            <TouchableOpacity style={styles.helpItem}><Ionicons name="chatbubble-outline" size={22} color={COLORS.primary} /><Text style={styles.helpItemText}>Live Chat Support</Text></TouchableOpacity>
            <TouchableOpacity style={styles.helpItem}><Ionicons name="mail-outline" size={22} color={COLORS.primary} /><Text style={styles.helpItemText}>Email: support@cjpconnect.com</Text></TouchableOpacity>
            <TouchableOpacity style={styles.helpItem}><Ionicons name="bug-outline" size={22} color={COLORS.primary} /><Text style={styles.helpItemText}>Report a Bug</Text></TouchableOpacity>
            <TouchableOpacity style={styles.helpItem}><Ionicons name="star-outline" size={22} color={COLORS.primary} /><Text style={styles.helpItemText}>Rate the App</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ About Modal with your logo */}
      <Modal visible={showAboutModal} animationType="slide" transparent onRequestClose={() => setShowAboutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About CJP Connect</Text>
              <TouchableOpacity onPress={() => setShowAboutModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <Image source={APP_LOGO} style={styles.aboutLogo} contentFit="contain" />
            <Text style={styles.aboutTitle}>CJP Connect</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutDesc}>CJP Connect is a professional networking platform designed for Gen-Z job seekers and mentors. Connect, learn, and grow together.</Text>
            <View style={styles.aboutLinks}>
              <TouchableOpacity style={styles.aboutLink}><Text style={styles.aboutLinkText}>Terms of Service</Text></TouchableOpacity>
              <TouchableOpacity style={styles.aboutLink}><Text style={styles.aboutLinkText}>Privacy Policy</Text></TouchableOpacity>
              <TouchableOpacity style={styles.aboutLink}><Text style={styles.aboutLinkText}>Open Source Licenses</Text></TouchableOpacity>
            </View>
            <Text style={styles.copyright}>© 2024 CJP Connect. All rights reserved.</Text>
          </View>
        </View>
      </Modal>

      {/* Logout Modal */}
      <Modal visible={showLogoutModal} animationType="fade" transparent onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModal}>
            <Ionicons name="log-out-outline" size={48} color={COLORS.error} />
            <Text style={styles.logoutModalTitle}>Log Out?</Text>
            <Text style={styles.logoutModalDesc}>Are you sure you want to log out of CJP Connect?</Text>
            <View style={styles.logoutModalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowLogoutModal(false)}><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.confirmLogoutButton} onPress={handleLogout}><Text style={styles.confirmLogoutText}>Log Out</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xxl },
  section: { backgroundColor: COLORS.white, marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.gray[500], paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm, textTransform: 'uppercase' },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray[100] },
  settingText: { fontSize: FONTS.sizes.md, color: COLORS.text, marginLeft: SPACING.md, flex: 1 },
  settingValue: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], marginRight: SPACING.sm },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, marginHorizontal: SPACING.md, marginTop: SPACING.lg, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, gap: SPACING.sm },
  logoutText: { color: COLORS.error, fontWeight: '600', fontSize: FONTS.sizes.md },
  version: { textAlign: 'center', color: COLORS.gray[400], fontSize: FONTS.sizes.sm, marginTop: SPACING.lg },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text },
  modalButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', marginTop: SPACING.md },
  modalButtonText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.lg },
  privacyOption: { marginBottom: SPACING.lg },
  privacyOptionTitle: { fontSize: FONTS.sizes.md, fontWeight: '500', color: COLORS.text, marginBottom: SPACING.sm },
  privacyOptions: { flexDirection: 'row', gap: SPACING.sm },
  privacyOptionBtn: { flex: 1, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.gray[100], alignItems: 'center' },
  privacyOptionBtnActive: { backgroundColor: COLORS.primary },
  privacyOptionText: { color: COLORS.gray[600], fontWeight: '500' },
  privacyOptionTextActive: { color: COLORS.white },
  helpItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, gap: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray[100] },
  helpItemText: { fontSize: FONTS.sizes.md, color: COLORS.text },
  aboutLogo: { width: 80, height: 80, alignSelf: 'center', marginBottom: SPACING.md },
  aboutTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  aboutVersion: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], textAlign: 'center', marginTop: SPACING.xs },
  aboutDesc: { fontSize: FONTS.sizes.md, color: COLORS.gray[600], textAlign: 'center', marginTop: SPACING.md, lineHeight: 22 },
  aboutLinks: { marginTop: SPACING.lg, gap: SPACING.sm },
  aboutLink: { paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.gray[100] },
  aboutLinkText: { color: COLORS.primary, fontSize: FONTS.sizes.md, textAlign: 'center' },
  copyright: { fontSize: FONTS.sizes.sm, color: COLORS.gray[400], textAlign: 'center', marginTop: SPACING.lg },
  logoutModal: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, margin: SPACING.lg, alignItems: 'center' },
  logoutModalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text, marginTop: SPACING.md },
  logoutModalDesc: { color: COLORS.gray[500], textAlign: 'center', marginTop: SPACING.sm, marginBottom: SPACING.lg },
  logoutModalButtons: { flexDirection: 'row', gap: SPACING.md },
  cancelButton: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', backgroundColor: COLORS.gray[100] },
  cancelButtonText: { color: COLORS.gray[600], fontWeight: '600' },
  confirmLogoutButton: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', backgroundColor: COLORS.error },
  confirmLogoutText: { color: COLORS.white, fontWeight: '600' },
});