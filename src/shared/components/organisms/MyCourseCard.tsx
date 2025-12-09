// ============================================
// MyCourseCard Component - Enrolled course card
// ============================================

import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from '../atoms/Text';
import { Card } from '../molecules/Card';
import { ProgressBar } from '../molecules/ProgressBar';
import { Spacing } from '../../../core/theme/spacing';
import { BorderRadius } from '../../../core/theme/radius';
import { Colors } from '../../../core/theme/colors';

// Icons
const BookIcon = require('../../assets/icons/book.png');

// Types
interface MyCourseCardProps {
  title: string;
  instructor: string;
  image: ImageSourcePropType | string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  duration?: string;
  onPress: () => void;
}

export const MyCourseCard: React.FC<MyCourseCardProps> = ({
  title,
  instructor,
  image,
  progress,
  lessonsCompleted,
  totalLessons,
  duration = '2hr 45min',
  onPress,
}) => {
  const { theme } = useTheme();
  const imageSource = typeof image === 'string' ? { uri: image } : image;

  return (
    <Card onPress={onPress} style={styles.container} variant="filled" padding="medium">
      <View style={styles.content}>
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressLabel}>Your progress</Text>
              <View style={styles.progressTitleRow}>
                <Text style={styles.progressTitle}>{progress}%</Text>
                <Text style={styles.progressComplete}> to complete</Text>
              </View>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeIcon}>⏱</Text>
              <Text style={styles.timeText}>{duration}</Text>
            </View>
          </View>
          <ProgressBar progress={progress} height={8} style={styles.progressBar} />
        </View>

        {/* Course Info Section */}
        <View style={styles.courseSection}>
          <View style={styles.textSection}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.instructorText}>
              By: <Text style={styles.instructorName}>{instructor}</Text>
            </Text>
            <View style={styles.lessonInfo}>
              <Image source={BookIcon} style={styles.lessonIcon} resizeMode="contain" />
              <Text style={styles.lessonText}>
                {totalLessons} Lessons  •  {duration}
              </Text>
            </View>
          </View>

          {/* Course Image */}
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  content: {
    flexDirection: 'column',
  },
  progressSection: {
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#6E6E6E',
    marginBottom: 4,
  },
  progressTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  progressTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 32,
    fontWeight: '600',
    color: Colors.accent,
    lineHeight: 38,
  },
  progressComplete: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.accent,
    lineHeight: 24,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeIcon: {
    fontSize: 14,
  },
  timeText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#6E6E6E',
  },
  progressBar: {
    marginTop: Spacing.xs,
  },
  courseSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textSection: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  courseTitle: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 26.4,
    color: '#000',
    marginBottom: Spacing.xs,
  },
  instructorText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#6E6E6E',
    marginBottom: Spacing.sm,
  },
  instructorName: {
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.accent,
    fontWeight: '600',
  },
  lessonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lessonIcon: {
    width: 18,
    height: 18,
  },
  lessonText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#6E6E6E',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.cardLarge,
  },
});

export default MyCourseCard;

