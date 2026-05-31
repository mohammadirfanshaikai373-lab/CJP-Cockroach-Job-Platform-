import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Event } from '../types';

export default function EventsScreen() {
  const { events, registerForEvent, unregisterFromEvent, addNotification } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'registered'>('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (activeFilter === 'upcoming') { filtered = events.filter(e => new Date(e.date) > new Date()); }
    else if (activeFilter === 'registered') { filtered = events.filter(e => e.isRegistered); }
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, activeFilter]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleRegister = (event: Event) => {
    if (event.isRegistered) { unregisterFromEvent(event.id); }
    else { registerForEvent(event.id); }
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.eventCard} onPress={() => { setSelectedEvent(item); setShowEventModal(true); }}>
      <View style={styles.eventHeader}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{new Date(item.date).getDate()}</Text>
          <Text style={styles.dateMonth}>{new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.eventHost}>by {item.host}</Text>
          <View style={styles.eventMeta}>
            <Ionicons name={item.isVirtual ? 'videocam-outline' : 'location-outline'} size={14} color={COLORS.gray[500]} />
            <Text style={styles.eventMetaText}>{item.isVirtual ? 'Virtual Event' : item.location}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, item.isRegistered && styles.registeredBadge]}>
          <Text style={[styles.statusText, item.isRegistered && styles.registeredText]}>{item.isRegistered ? 'Registered' : 'Open'}</Text>
        </View>
      </View>
      <Text style={styles.eventDesc} numberOfLines={2}>{item.description}</Text>
      <View style={styles.eventFooter}>
        <View style={styles.attendeesInfo}>
          <Ionicons name="people-outline" size={16} color={COLORS.gray[500]} />
          <Text style={styles.attendeesText}>{item.attendees} attending</Text>
        </View>
        <TouchableOpacity style={[styles.registerButton, item.isRegistered && styles.unregisterButton]} onPress={() => handleRegister(item)}>
          <Text style={[styles.registerButtonText, item.isRegistered && styles.unregisterButtonText]}>{item.isRegistered ? 'Unregister' : 'Register'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity style={styles.iconButton}><Ionicons name="search-outline" size={24} color={COLORS.primary} /></TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        {(['all', 'upcoming', 'registered'] as const).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]} onPress={() => setActiveFilter(tab)}>
            <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList data={filteredEvents} renderItem={renderEvent} keyExtractor={item => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<Text style={styles.emptyText}>No events found</Text>} />

      {/* Event Detail Modal */}
      <Modal visible={showEventModal} animationType="slide" transparent onRequestClose={() => setShowEventModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedEvent && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                  <TouchableOpacity onPress={() => setShowEventModal(false)}><Ionicons name="close" size={24} color={COLORS.primary} /></TouchableOpacity>
                </View>
                <Text style={styles.modalHost}>Hosted by {selectedEvent.host}</Text>
                <View style={styles.modalSection}>
                  <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                  <View><Text style={styles.modalLabel}>Date & Time</Text><Text style={styles.modalValue}>{formatDate(selectedEvent.date)} at {formatTime(selectedEvent.date)}</Text></View>
                </View>
                <View style={styles.modalSection}>
                  <Ionicons name={selectedEvent.isVirtual ? 'videocam-outline' : 'location-outline'} size={20} color={COLORS.primary} />
                  <View><Text style={styles.modalLabel}>Location</Text><Text style={styles.modalValue}>{selectedEvent.isVirtual ? 'Virtual Event' : selectedEvent.location}</Text></View>
                </View>
                <View style={styles.modalSection}>
                  <Ionicons name="people-outline" size={20} color={COLORS.primary} />
                  <View><Text style={styles.modalLabel}>Attendees</Text><Text style={styles.modalValue}>{selectedEvent.attendees} people registered</Text></View>
                </View>
                <Text style={styles.modalDescTitle}>About this event</Text>
                <Text style={styles.modalDesc}>{selectedEvent.description}</Text>
                <TouchableOpacity style={[styles.modalRegisterButton, selectedEvent.isRegistered && styles.modalUnregisterButton]} onPress={() => { handleRegister(selectedEvent); setShowEventModal(false); }}>
                  <Ionicons name={selectedEvent.isRegistered ? 'close-circle-outline' : 'checkmark-circle-outline'} size={20} color={COLORS.white} />
                  <Text style={styles.modalRegisterText}>{selectedEvent.isRegistered ? 'Unregister' : 'Register Now'}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.gray[200] },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.text },
  iconButton: { padding: SPACING.xs },
  filterTabs: { flexDirection: 'row', backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray[200], gap: SPACING.sm },
  filterTab: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.round },
  filterTabActive: { backgroundColor: COLORS.primary },
  filterTabText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], fontWeight: '500' },
  filterTabTextActive: { color: COLORS.white },
  listContent: { padding: SPACING.md },
  eventCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  eventHeader: { flexDirection: 'row', marginBottom: SPACING.sm },
  dateBadge: { width: 50, height: 56, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  dateDay: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.white },
  dateMonth: { fontSize: FONTS.sizes.sm, color: COLORS.gray[200], textTransform: 'uppercase' },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  eventHost: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500], marginTop: 2 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.xs },
  eventMetaText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.round, backgroundColor: COLORS.gray[100] },
  registeredBadge: { backgroundColor: COLORS.success + '20' },
  statusText: { fontSize: FONTS.sizes.xs, color: COLORS.gray[600], fontWeight: '500' },
  registeredText: { color: COLORS.success },
  eventDesc: { fontSize: FONTS.sizes.sm, color: COLORS.gray[600], lineHeight: 20 },
  eventFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.gray[100] },
  attendeesInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  attendeesText: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  registerButton: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.md },
  unregisterButton: { backgroundColor: COLORS.gray[100] },
  registerButtonText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.sm },
  unregisterButtonText: { color: COLORS.gray[600] },
  emptyText: { color: COLORS.gray[500], textAlign: 'center', padding: SPACING.xl },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: SPACING.md },
  modalHost: { fontSize: FONTS.sizes.md, color: COLORS.gray[500], marginBottom: SPACING.lg },
  modalSection: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  modalLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray[500] },
  modalValue: { fontSize: FONTS.sizes.md, color: COLORS.text, fontWeight: '500' },
  modalDescTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text, marginTop: SPACING.md, marginBottom: SPACING.sm },
  modalDesc: { fontSize: FONTS.sizes.md, color: COLORS.gray[600], lineHeight: 22 },
  modalRegisterButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginTop: SPACING.lg, gap: SPACING.sm },
  modalUnregisterButton: { backgroundColor: COLORS.gray[200] },
  modalRegisterText: { color: COLORS.white, fontWeight: '600', fontSize: FONTS.sizes.lg },
});
