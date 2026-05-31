import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Animated, Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');

const onboardingData = [
  { id: '1', title: 'Welcome to CJP Connect', description: 'The professional networking app for Gen-Z job seekers and mentors. Connect, learn, and grow together.', icon: 'people-circle', color: COLORS.primary },
  { id: '2', title: 'Find Help & Offer Support', description: 'Browse the feed to find help requests or offers. Offer your expertise or get guidance from mentors.', icon: 'hand-left', color: COLORS.accent },
  { id: '3', title: 'Build Your Career', description: 'Join communities, apply to jobs, build your resume, and connect with professionals in your field.', icon: 'rocket', color: COLORS.success },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => (
    <View style={styles.slide}>
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon as any} size={80} color={item.color} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
        const opacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' });
        return <Animated.View key={index} style={[styles.dot, { width: dotWidth, opacity }]} />;
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}><Text style={styles.logoText}>CJP</Text></View>
        <Text style={styles.logoTitle}>CJP Connect</Text>
        <Text style={styles.logoSubtitle}>Professional Networking for Gen-Z</Text>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.flatList}
      />

      {renderDots()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>{currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}</Text>
          <Ionicons name={currentIndex === onboardingData.length - 1 ? 'checkmark' : 'arrow-forward'} size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  logoContainer: { alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 80 : 60, paddingBottom: SPACING.lg },
  logo: { width: 80, height: 80, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  logoText: { fontSize: 28, fontWeight: '800', color: COLORS.white },
  logoTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.primary },
  logoSubtitle: { fontSize: FONTS.sizes.md, color: COLORS.gray[500], marginTop: 4 },
  flatList: { flex: 1 },
  slide: { width, alignItems: 'center', paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl },
  iconContainer: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xl },
  title: { fontSize: FONTS.sizes.xxxl, fontWeight: '700', color: COLORS.primary, textAlign: 'center', marginBottom: SPACING.md },
  description: { fontSize: FONTS.sizes.lg, color: COLORS.gray[600], textAlign: 'center', lineHeight: 28 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.lg },
  dot: { height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginHorizontal: 4 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingBottom: Platform.OS === 'ios' ? 50 : 30 },
  skipButton: { padding: SPACING.md },
  skipText: { fontSize: FONTS.sizes.md, color: COLORS.gray[500], fontWeight: '500' },
  nextButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, gap: SPACING.sm },
  nextText: { fontSize: FONTS.sizes.md, color: COLORS.white, fontWeight: '600' },
});
