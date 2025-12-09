// ============================================
// LessonCard Component - Course lesson item
// ============================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from '../atoms/Text';
import { Card } from '../molecules/Card';
import { Spacing } from '../../../core/theme/spacing';
import { BorderRadius } from '../../../core/theme/radius';

// Icons
const BookIcon = require('../../assets/icons/book.png');

// Types
interface LessonCardProps {
  title: string;
  lessonsCount: number;
  chaptersCount: number;
  duration: string;
  onPress: () => void;
  isLocked?: boolean;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  title,
  lessonsCount,
  chaptersCount,
  duration,
  onPress,
  isLocked = false,
}) => {
  const { theme } = useTheme();

  return (
    <Card
      onPress={onPress}
      variant="filled"
      padding="medium"
      style={styles.container}
      disabled={isLocked}
    >
      <View style={[styles.content, { opacity: isLocked ? 0.6 : 1 }]}>
        {/* Left section */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.meta}>
            {/* Book Icon */}
            <Image source={BookIcon} style={styles.icon} resizeMode="contain" />
            <Text style={styles.metaText}>
              {lessonsCount} Lessons
            </Text>
            <Text style={styles.metaText}>
              {' • '}
            </Text>
            <Text style={styles.metaText}>
              {chaptersCount} Chapters
            </Text>
          </View>
        </View>

        {/* Duration and Arrow */}
        <View style={styles.rightSection}>
          <Text style={styles.durationText}>
            {duration}
          </Text>
          {/* Arrow button */}
          <TouchableOpacity
            onPress={onPress}
            style={[
              styles.arrowButton,
              { backgroundColor: theme.colors.primary },
            ]}
            disabled={isLocked}
          >
            <Text style={styles.arrowIcon}>↗</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontFamily: 'ClashDisplay-Semibold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 19.2, // 120% of 16
    letterSpacing: 0.32, // 2% of 16
    textTransform: 'capitalize',
    color: '#000',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    flexWrap: 'wrap',
  },
  metaText: {
    fontFamily: 'ClashDisplay-Medium',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 14.4, // 120% of 12
    letterSpacing: 0.24, // 2% of 12
    textAlign: 'right',
    textTransform: 'capitalize',
    color: '#6E6E6E',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: Spacing.xs,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginRight: Spacing.md,
  },
  durationText: {
    paddingTop: Spacing.sm,
    fontFamily: 'ClashDisplay-Medium',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 14.4, // 120% of 12
    letterSpacing: 0.24, // 2% of 12
    textAlign: 'right',
    textTransform: 'capitalize',
    color: '#6E6E6E',
    marginBottom: Spacing.xs,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default LessonCard;

