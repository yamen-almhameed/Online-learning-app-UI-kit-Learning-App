import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from '../../../shared/components/atoms/Text';
import { Spacer } from '../../../shared/components/atoms/Spacer';
import { HeaderBar } from '../../../shared/components/molecules/HeaderBar';
import { MyCourseCard } from '../../../shared/components/organisms/MyCourseCard';
import { Spacing } from '../../../core/theme/spacing';
import { MyCoursesScreenProps } from '../../../navigation/types';
import { Colors } from '../../../core/theme/colors';
import { ROUTES } from '../../../navigation/AppRoutes';

// Icons
const HomeIcon = require('../../../shared/assets/icons/Home.png');
const ProfileIcon = require('../../../shared/assets/icons/profile.png');
const SettingsIcon = require('../../../shared/assets/icons/setting.png');
const CategoriesIcon = require('../../../shared/assets/icons/categories.png');
const VectorIcon = require('../../../shared/assets/icons/Vector (1).png');

const MY_COURSES = [
  {
    id: '1',
    title: 'Introduction To Programming',
    instructor: 'John Smith',
    image: 'https://picsum.photos/200/150?random=20',
    progress: 75,
    lessonsCompleted: 12,
    totalLessons: 48,
    duration: '2hr 45min',
  },
  {
    id: '2',
    title: 'UI Design Wit Figma',
    instructor: 'John Smith',
    image: 'https://picsum.photos/200/150?random=21',
    progress: 75,
    lessonsCompleted: 8,
    totalLessons: 48,
    duration: '2hr 45min',
  },
  {
    id: '3',
    title: 'Build Own Portfolio',
    instructor: 'John Smith',
    image: 'https://picsum.photos/200/150?random=22',
    progress: 75,
    lessonsCompleted: 17,
    totalLessons: 48,
    duration: '2hr 45min',
  },
];

const MyCoursesScreen: React.FC<MyCoursesScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const rootNavigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);

  // Close menu when screen loses focus
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

  // Handle course press
  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetails', { courseId });
  };

  // Handle back press
  const handleBack = () => {
    navigation.goBack();
  };

  // Handle notification press
  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  // Render course item
  const renderCourse = ({ item }: { item: typeof MY_COURSES[0] }) => (
    <MyCourseCard
      title={item.title}
      instructor={item.instructor}
      image={{ uri: item.image }}
      progress={item.progress}
      lessonsCompleted={item.lessonsCompleted}
      totalLessons={item.totalLessons}
      duration={item.duration}
      onPress={() => handleCoursePress(item.id)}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.Backgroundproj}
        />

        {/* Header */}
        <HeaderBar
          title="My Courses"
          showBackButton
          showNotificationButton
          onBackPress={handleBack}
          onNotificationPress={handleNotificationPress}
          backIconColor={Colors.textPrimary}
          backgroundColor={Colors.textWhite}
        />

        <FlatList
          data={MY_COURSES}
          renderItem={renderCourse}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerInfo}>
              <Text variant="body" color={theme.colors.textSecondary}>
                {MY_COURSES.length} courses in progress
              </Text>
              <Spacer size="md" />
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📚</Text>
              <Spacer size="md" />
              <Text variant="h5" color={theme.colors.textSecondary} align="center">
                No courses yet
              </Text>
              <Text variant="body" color={theme.colors.textLight} align="center">
                Start learning by enrolling in a course
              </Text>
            </View>
          }
        />

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
                  rootNavigation.navigate(ROUTES.PROFILE as never);
                }}
              >
                <Image 
                  source={ProfileIcon} 
                  style={styles.menuItemImage}
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
  headerInfo: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.huge,
  },
  emptyIcon: {
    fontSize: 60,
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
    zIndex: 998,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 24,
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

export default MyCoursesScreen;

