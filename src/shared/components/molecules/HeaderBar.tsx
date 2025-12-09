// ============================================
// HeaderBar Component - Screen header
// ============================================

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from '../atoms/Text';
import { Badge } from '../atoms/Badge';
import { Spacing } from '../../../core/theme/spacing';
import { Colors } from '../../../core/theme/colors';
import { getStatusBarHeight } from '../../../core/utils/responsive';

// Icons
const NotificationIcon = require('../../assets/icons/notfication.png');

// Types
interface HeaderBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showNotificationButton?: boolean;
  onNotificationPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
  backIconColor?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  showNotificationButton = false,
  onNotificationPress,
  rightComponent,
  leftComponent,
  transparent = false,
  style,
  backgroundColor,
  backIconColor,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const statusBarHeight = getStatusBarHeight();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleNotification = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === 'ios' ? statusBarHeight : StatusBar.currentHeight || 0,
          backgroundColor: 'transparent' ,
        },
        style,
      ]}
    >
        <HeaderBar title={title} showBackButton={showBackButton} onBackPress={onBackPress} showNotificationButton={showNotificationButton} onNotificationPress={onNotificationPress} rightComponent={rightComponent} leftComponent={leftComponent} transparent={transparent} style={style} backgroundColor={backgroundColor} backIconColor={backIconColor} />

        {/* Title */}
        {title && (
          <Text style={styles.title}>
            {title}
          </Text>
        )}

        {/* Right Section */}
        <View style={styles.rightSection}>
          {showNotificationButton && (
            <TouchableOpacity
              onPress={handleNotification}
              style={styles.notificationButton}
            >
              <Image 
                source={NotificationIcon} 
                style={styles.notificationIcon}
                resizeMode="contain"
              />
              <Badge
                dot
                variant="error"
                style={styles.notificationBadge}
              />
            </TouchableOpacity>
          )}
          {rightComponent}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 48,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 48,
    justifyContent: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 301,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Montserrat-Regular',   
    fontWeight: '500',         
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 18,             
    letterSpacing: 0.36,        
    textAlign: 'center',
    textTransform: 'none',     
  },
  notificationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationIcon: {
    width: 20,
    height: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default HeaderBar;

