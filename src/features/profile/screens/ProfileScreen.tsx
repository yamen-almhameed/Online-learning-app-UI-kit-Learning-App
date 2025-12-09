import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../core/hooks/useTheme';
import { useAuth } from '../../../core/hooks/useAuth';
import { Text } from '../../../shared/components/atoms/Text';
import { Avatar } from '../../../shared/components/atoms/Avatar';
import { Spacer } from '../../../shared/components/atoms/Spacer';
import { Card } from '../../../shared/components/molecules/Card';
import { HeaderBar } from '../../../shared/components/molecules/HeaderBar';
import { Spacing } from '../../../core/theme/spacing';
import { Colors } from '../../../core/theme/colors';
import { ROUTES } from '../../../navigation/AppRoutes';

// Icons
const HomeIcon = require('../../../shared/assets/icons/Home.png');
const ProfileIcon = require('../../../shared/assets/icons/profile.png');
const SettingsIcon = require('../../../shared/assets/icons/setting.png');
const CategoriesIcon = require('../../../shared/assets/icons/categories.png');
const VectorIcon = require('../../../shared/assets/icons/Vector (1).png');

const MENU_ITEMS = [
  { id: 'courses', label: 'Your Current Courses', screen: 'MyCourses' },
  { id: 'history',  label: 'Your History', screen: 'History' },
  { id: 'certifications', label: 'Certifications Earned', screen: 'Certifications' },
  { id: 'settings', label: 'Settings', screen: 'Settings' },
];

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const rootNavigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setShowMenu(false);
      };
    }, [])
  );

  // Circular menu positions
  const MENU_ITEM_SIZE = 0;
  const CIRCLE_RADIUS = 70;
  const CONTAINER_SIZE = 450;
  const CENTER_X = CONTAINER_SIZE / 3;
  const CENTER_Y = CONTAINER_SIZE / 2;
  
  const getCircularPosition = (index: number, total: number, extraRadius: number = 0) => {
    const angle = (90 - (index * 360 / total)) * (Math.PI / 180);
    const radius = CIRCLE_RADIUS + extraRadius;
    const x = CENTER_X + radius * Math.cos(angle) - (MENU_ITEM_SIZE / 2);
    const y = CENTER_Y - radius * Math.sin(angle) - (MENU_ITEM_SIZE / 2);
    return { left: x, top: y };
  };
  
  const menuPositions = [
    getCircularPosition(0.1, 5, -15),
    getCircularPosition(1, 5, 5),
    getCircularPosition(2, 1.52, 35),
    getCircularPosition(3, 4.5, 20),
    getCircularPosition(4, 5, -10),
  ];

  // Handle menu item press
  const handleMenuPress = (screen: string) => {
    // navigation.navigate(screen as any);
    console.log('Navigate to:', screen);
  };

  // Render menu item
  const renderMenuItem = (item: typeof MENU_ITEMS[0]) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item.screen)}
    >
      <View style={styles.menuItemLeft}>
        <Text variant="body" color={theme.colors.textPrimary}>
          {item.label}
        </Text>
      </View>
      <View style={[styles.arrowButton, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.arrowIcon}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.background}
        />

        {/* Header */}
        <HeaderBar
          title="Profile"
          showBackButton
          showNotificationButton
          onNotificationPress={() => {
            // Handle notification press
            console.log('Notification pressed');
          }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileContent}>
            <Avatar
              source={{ uri: user?.avatar || 'https://picsum.photos/100' }}
              size="xxl"
            />
            <View style={styles.profileTextContainer}>
              <Text variant="h5" weight="semiBold" style={styles.profileName}>
                {user?.fullName || 'Muhammad Ahmed'}
              </Text>
              <Text variant="body" style={styles.profileEmail}>
                {user?.email || 'mahmed1212@gmail.com'}
              </Text>
            </View>
          </View>
        </Card>

        <Spacer size="xl" />

        {/* Menu Items */}
        {MENU_ITEMS.map((item, index) => (
          <View key={item.id}>
            <Card padding="none" style={styles.menuItemCard}>
              {renderMenuItem(item)}
            </Card>
            {index < MENU_ITEMS.length - 1 && <Spacer size="md" />}
          </View>
        ))}

          <Spacer size="huge" />
        </ScrollView>

        {/* FAB Button */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowMenu(!showMenu)}
        >
          <Text style={styles.fabIcon}>{showMenu ? '✕' : '+'}</Text>
        </TouchableOpacity>

        {/* Circular Menu Overlay */}
        {showMenu && (
          <>
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={() => setShowMenu(false)}
            />
            <View style={styles.menuContainer}>
              {/* Circular Blur Background */}
              <View style={styles.blurCircle} />
              
              {/* Five Screen Buttons in Circle */}
              <TouchableOpacity 
                style={[
                  styles.menuItemCircle, 
                  { 
                    left: menuPositions[0].left, 
                    top: menuPositions[0].top,
                    backgroundColor: Colors.buttonPrimary 
                  }
                ]}
                onPress={() => {
                  setShowMenu(false);
                  rootNavigation.navigate(ROUTES.HOME as never);
                }}
              >
                <Image 
                  source={HomeIcon} 
                  style={[styles.menuItemImage, { tintColor: '#fff' }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.menuItemCircle, 
                  { 
                    left: menuPositions[1].left, 
                    top: menuPositions[1].top 
                  }
                ]}
                onPress={() => {
                  setShowMenu(false);
                  rootNavigation.navigate(ROUTES.SEARCH as never);
                }}
              >
                <Image 
                  source={VectorIcon} 
                  style={styles.menuItemImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.menuItemCircle, 
                  { 
                    left: menuPositions[2].left, 
                    top: menuPositions[2].top 
                  }
                ]}
                onPress={() => {
                  setShowMenu(false);
                  rootNavigation.navigate(ROUTES.MY_COURSES as never);
                }}
              >
                <Image 
                  source={CategoriesIcon} 
                  style={styles.menuItemImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.menuItemCircle, 
                  { 
                    left: menuPositions[3].left, 
                    top: menuPositions[3].top 
                  }
                ]}
                onPress={() => {
                  setShowMenu(false);
                  // Already on profile
                }}
              >
                <Image 
                  source={ProfileIcon} 
                  style={[styles.menuItemImage, { tintColor: Colors.buttonPrimary }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.menuItemCircle, 
                  { 
                    left: menuPositions[4].left, 
                    top: menuPositions[4].top 
                  }
                ]}
                onPress={() => {
                  setShowMenu(false);
                }}
              >
                <Image 
                  source={SettingsIcon} 
                  style={styles.menuItemImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Close Button (X) - Center */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowMenu(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  profileCard: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.base,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  profileName: {
    color: '#000',
    marginBottom: Spacing.xs,
  },
  profileEmail: {
    color: Colors.accent,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  chevron: {
    fontSize: 24,
    opacity: 0.5,
  },
  menuItemCard: {
    marginBottom: 0,
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.base,
  },
  arrowButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '300',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 70,
    left: -8,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 280,
    width: 280,
    alignSelf: 'center',
    zIndex: 1002,
  },
  blurCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    top: 160,
    left: 52,
    backgroundColor: 'rgba(41, 40, 40, 0.3)',
    borderWidth: 1.5,
    borderColor: 'rgba(195, 195, 195, 0.5)',
    overflow: 'hidden',
  },
  menuItemCircle: {
    position: 'absolute',
    width: 65,
    height: 65,
    borderRadius: 40.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItemImage: {
    width: 28,
    height: 28,
    tintColor: '#333',
  },
  closeButton: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    top: 245,
    left: 145,
    zIndex: 1001,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: '600',
  },
});

export default ProfileScreen;

