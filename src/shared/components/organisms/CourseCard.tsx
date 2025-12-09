// ============================================
// CourseCard Component - Course display card
// ============================================

import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';
import { Card } from '../molecules/Card';
import { Spacing } from '../../../core/theme/spacing';
import { BorderRadius } from '../../../core/theme/radius';
import { Colors } from '../../../core/theme';

// Icons
const BookmarkIcon = require('../../assets/icons/Vector (1).png');

// Types
interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  price: number | null;
  image: ImageSourcePropType | string;
  onPress: () => void;
  onBookmarkPress?: () => void;
  isBookmarked?: boolean;
  variant?: 'large' | 'small' | 'horizontal';
  fullWidth?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  instructor,
  price,
  image,
  onPress,
  onBookmarkPress,
  isBookmarked = false,
  variant = 'large',
  fullWidth = false,
}) => {
  const { theme } = useTheme();

  // Get image source
  const imageSource = typeof image === 'string' ? { uri: image } : image;

  // Render large card (for trending courses)
  if (variant === 'large') {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={[styles.largeContainer, fullWidth && styles.largeContainerFullWidth]}
      >
        {/* Image Container */}
        <View style={styles.largeImageContainer}>
          <Image
            source={imageSource}
            style={styles.largeImage}
            resizeMode="cover"
          />
          
          {/* Price Tag - Oval shape in top left */}
          {price !== null && (
            <View style={[styles.priceTag, { backgroundColor: '#FFFFFF' }]}>
              <Text style={styles.priceTagText}>
                ${price}
              </Text>
            </View>
          )}

          {/* Bookmark Button - Circular in bottom right */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onBookmarkPress?.();
            }}
            style={[styles.bookmarkButton, { backgroundColor: '#FFFFFF' }]}
          >
            <Image 
              source={BookmarkIcon} 
              style={styles.bookmarkIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.largeInfo}>
          <Text style={styles.courseTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.courseInstructor}>
            <Text style={styles.byText}>By: </Text>
            {instructor}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Render small card
  if (variant === 'small') {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.smallContainer}
      >
        <Image
          source={imageSource}
          style={styles.smallImage}
          resizeMode="cover"
        />
        <View style={styles.smallInfo}>
          <Text variant="labelSmall" numberOfLines={2}>
            {title}
          </Text>
          <Text variant="captionSmall" color={theme.colors.primary}>
            {instructor}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Render horizontal card
  return (
    <Card onPress={onPress} style={styles.horizontalContainer}>
      <View style={styles.horizontalContent}>
        <Image
          source={imageSource}
          style={styles.horizontalImage}
          resizeMode="cover"
        />
        <View style={styles.horizontalInfo}>
          <Text variant="label" numberOfLines={2}>
            {title}
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            {instructor}
          </Text>
          {price !== null ? (
            <Text variant="label" color={theme.colors.primary} weight="semiBold">
              ${price}
            </Text>
          ) : (
            <Text variant="label" color={theme.colors.primary} weight="semiBold">
              Free
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  // Large card styles
  largeContainer: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  largeContainerFullWidth: {
    width: '100%',
    marginRight: 0,
  },
  largeImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  largeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  priceTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  priceTagText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000',
  },
  bookmarkButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  bookmarkIcon: {
    width: 18,
    height: 18,
    tintColor: '#008B8B',
  },
  largeInfo: {
    padding: 14,
    backgroundColor: '#fff',
  },
  courseTitle: {
    fontFamily: 'ClashDisplay-Semibold',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 21.6, // 120% of 18
    letterSpacing: 0.36, // 2% of 18
    textTransform: 'capitalize',
    color: '#000',
    marginBottom: 4,
  },
  courseInstructor: {
    fontFamily: 'ClashDisplay-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 14.4, // 120% of 12
    letterSpacing: 0.24, // 2% of 12
    textTransform: 'capitalize',
    color: Colors.accent,
  },
  

  // Small card styles
  smallContainer: {
    width: 120,
    marginRight: Spacing.md,
  },
  smallImage: {
    width: '100%',
    height: 80,
    borderRadius: BorderRadius.image,
  },
  smallInfo: {
    marginTop: Spacing.xs,
  },

  // Horizontal card styles
  horizontalContainer: {
    marginBottom: Spacing.md,
  },
  horizontalContent: {
    flexDirection: 'row',
  },
  horizontalImage: {
    width: 100,
    height: 80,
    borderRadius: BorderRadius.image,
  },
  horizontalInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  byText: {
    fontSize: 12,
  },
});

export default CourseCard;

