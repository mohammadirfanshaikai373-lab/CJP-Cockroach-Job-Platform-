import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';

// Screens
import FeedScreen from '../screens/FeedScreen';
import NetworkScreen from '../screens/NetworkScreen';
import JobsScreen from '../screens/JobsScreen';
import MessagingScreen from '../screens/MessagingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CommunityDetailScreen from '../screens/CommunityDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import ResumeBuilderScreen from '../screens/ResumeBuilderScreen';
import EventsScreen from '../screens/EventsScreen';
import SavedScreen from '../screens/SavedScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const errorColor = COLORS.error || COLORS.danger || '#ff3b30';

// ✅ Custom Drawer Content with "Home" added
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { currentUser, logout, notifications } = useApp();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const menuItems = [
    { name: 'Home', icon: 'home-outline', label: 'Home' },           // ✅ NEW
    { name: 'Saved', icon: 'bookmark-outline', label: 'Saved Items' },
    { name: 'Events', icon: 'calendar-outline', label: 'Events' },
    { name: 'Resume', icon: 'document-text-outline', label: 'Resume Builder' },
    { name: 'Settings', icon: 'settings-outline', label: 'Settings' },
  ];

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.profileSection} onPress={() => props.navigation.navigate('ProfileTab')}>
        <Image source={{ uri: currentUser?.avatar || 'https://via.placeholder.com/60' }} style={styles.profileAvatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{currentUser?.name || 'User'}</Text>
          <Text style={styles.profileHeadline} numberOfLines={2}>{currentUser?.headline || 'Add a headline'}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>{currentUser?.connections || 0}</Text>
          <Text style={styles.statLabel}>Connections</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>{currentUser?.profileViews || 0}</Text>
          <Text style={styles.statLabel}>Profile Views</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>{currentUser?.postImpressions || 0}</Text>
          <Text style={styles.statLabel}>Impressions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.name} style={styles.menuItem} onPress={() => props.navigation.navigate(item.name)}>
            <Ionicons name={item.icon as any} size={22} color={COLORS.primary} />
            <Text style={styles.menuItemText}>{item.label}</Text>
            {item.name === 'Messages' && unreadCount > 0 && (
              <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {!currentUser?.isPremium && (
        <TouchableOpacity style={styles.premiumBanner}>
          <Ionicons name="star" size={20} color={COLORS.accent} />
          <View style={styles.premiumInfo}>
            <Text style={styles.premiumTitle}>Go Premium</Text>
            <Text style={styles.premiumDesc}>Unlock all features</Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={errorColor} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

// ----- Stack Navigators (unchanged) -----
function FeedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FeedMain" component={FeedScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ headerShown: true, title: 'Post' }} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: true, title: 'Profile' }} />
    </Stack.Navigator>
  );
}

function NetworkStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NetworkMain" component={NetworkScreen} />
      <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} options={{ headerShown: true, title: 'Community' }} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: true, title: 'Profile' }} />
    </Stack.Navigator>
  );
}

function JobsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobsMain" component={JobsScreen} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ headerShown: true, title: 'Job Details' }} />
    </Stack.Navigator>
  );
}

function MessagingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagingMain" component={MessagingScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true, title: 'Edit Profile' }} />
      <Stack.Screen name="Saved" component={SavedScreen} options={{ headerShown: true, title: 'Saved Items' }} />
      <Stack.Screen name="Events" component={EventsScreen} options={{ headerShown: true, title: 'Events' }} />
      <Stack.Screen name="Resume" component={ResumeBuilderScreen} options={{ headerShown: true, title: 'Resume Builder' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, title: 'Settings' }} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          switch (route.name) {
            case 'FeedTab': iconName = focused ? 'home' : 'home-outline'; break;
            case 'NetworkTab': iconName = focused ? 'people' : 'people-outline'; break;
            case 'JobsTab': iconName = focused ? 'briefcase' : 'briefcase-outline'; break;
            case 'MessagesTab': iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'; break;
            case 'ProfileTab': iconName = focused ? 'person' : 'person-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray[400],
        tabBarStyle: { backgroundColor: COLORS.white, borderTopColor: COLORS.gray[200], paddingBottom: 8, paddingTop: 8, height: 60 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="FeedTab" component={FeedStack} options={{ title: 'Feed' }} />
      <Tab.Screen name="NetworkTab" component={NetworkStack} options={{ title: 'Network' }} />
      <Tab.Screen name="JobsTab" component={JobsStack} options={{ title: 'Jobs' }} />
      <Tab.Screen name="MessagesTab" component={MessagingStack} options={{ title: 'Messages' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Main Drawer Navigator
export default function AppNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: 'front',
        drawerStyle: { width: 300 },
        headerShown: true,
        headerStyle: { backgroundColor: COLORS.white },
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      {/* Home screen (the bottom tabs) – hides default header because FeedScreen has its own */}
      <Drawer.Screen name="Home" component={BottomTabs} options={{ headerShown: false }} />
      <Drawer.Screen name="Saved" component={SavedScreen} options={{ headerTitle: 'Saved Items' }} />
      <Drawer.Screen name="Events" component={EventsScreen} options={{ headerTitle: 'Events' }} />
      <Drawer.Screen name="Resume" component={ResumeBuilderScreen} options={{ headerTitle: 'Resume Builder' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ headerTitle: 'Settings' }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContent: { flex: 1, backgroundColor: COLORS.white },
  profileSection: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.gray[200], backgroundColor: COLORS.primary },
  profileAvatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: COLORS.accent },
  profileInfo: { flex: 1, marginLeft: SPACING.md },
  profileName: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.white },
  profileHeadline: { fontSize: FONTS.sizes.sm, color: COLORS.gray[300], marginTop: 2 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray[200], backgroundColor: COLORS.background },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.primary },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray[500], marginTop: 2 },
  menuSection: { paddingVertical: SPACING.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.gray[100] },
  menuItemText: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.text, marginLeft: SPACING.md },
  badge: { backgroundColor: errorColor, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: '600' },
  premiumBanner: { flexDirection: 'row', alignItems: 'center', margin: SPACING.md, padding: SPACING.md, backgroundColor: COLORS.accent + '20', borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.accent },
  premiumInfo: { marginLeft: SPACING.sm },
  premiumTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
  premiumDesc: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600] },
  bottomSection: { marginTop: 'auto', borderTopWidth: 1, borderTopColor: COLORS.gray[200] },
  logoutItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg },
  logoutText: { fontSize: FONTS.sizes.md, color: errorColor, marginLeft: SPACING.md },
});