import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../core/hooks/useTheme';
import { Text } from '../../../shared/components/atoms/Text';
import { Spacer } from '../../../shared/components/atoms/Spacer';
import { Spacing } from '../../../core/theme/spacing';
import { Colors } from '../../../core/theme/colors';
import { CoursePlayerScreenProps } from '../../../navigation/types';
import { ROUTES } from '../../../navigation/AppRoutes';

// Icons
const HomeIcon = require('../../../shared/assets/icons/Home.png');
const ProfileIcon = require('../../../shared/assets/icons/profile.png');
const SettingsIcon = require('../../../shared/assets/icons/setting.png');
const CategoriesIcon = require('../../../shared/assets/icons/categories.png');
const VectorIcon = require('../../../shared/assets/icons/Vector (1).png');
const BookIcon = require('../../../shared/assets/icons/book.png');

// Mock data
const COURSE_DATA = {
  title: 'UI & UX Design Basic',
  lessons: 48,
  chapters: 25,
  progress: 45,
  description:
    'A UI UX Designer is A Professional Who Identifies New Opportunities To Create Better User Experiences. Aesthetically Pleasing Branding Strategies Help Them Effectively Reach More Customers. They Also Ensure That The End-To-End Journey With Their Products Or Services Meets Desired Outcomes.',
  weeks: [
    {
      id: '1',
      title: 'Week 1-2:',
      subtitle: 'Introduction to UI/UX Design',
      active: true,
    },
    {
      id: '2',
      title: 'Week 3-4:',
      subtitle: 'User Research and analysis',
      active: false,
    },
    {
      id: '3',
      title: 'Week 3-4:',
      subtitle: 'Introduction to UI/UX Design',
      active: false,
    },
    {
      id: '4',
      title: 'Week 3-4:',
      subtitle: 'Introduction to UI/UX Design',
      active: false,
    },
  ],
  videoThumbnail: 'https://picsum.photos/400/300?random=100',
  enrolledStudents: 163,
};

const CoursePlayerScreen: React.FC<CoursePlayerScreenProps> = ({ navigation, route }) => {
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
    const angle = (90 - (index * 360) / total) * (Math.PI / 180);
    const radius = CIRCLE_RADIUS + extraRadius;
    const x = CENTER_X + radius * Math.cos(angle) - MENU_ITEM_SIZE / 2;
    const y = CENTER_Y - radius * Math.sin(angle) - MENU_ITEM_SIZE / 2;
    return { left: x, top: y };
  };

  const menuPositions = [
    getCircularPosition(0.1, 5, -15),
    getCircularPosition(1, 5, 5),
    getCircularPosition(2, 1.52, 35),
    getCircularPosition(3, 4.5, 20),
    getCircularPosition(4, 5, -10),
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Video Section */}
        <ImageBackground
          source={{ uri: COURSE_DATA.videoThumbnail }}
          style={styles.videoPlaceholder}
          resizeMode="cover"
        >
          <View style={styles.videoOverlay}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>

            {/* Play Button */}
            <TouchableOpacity style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.contentPadding}>
            {/* Course Info Header */}
            <View style={styles.infoHeader}>
              <Image source={BookIcon} style={styles.bookIcon} resizeMode="contain" />
              <Text style={styles.infoText}>{COURSE_DATA.lessons} Lessons</Text>
              <Text style={styles.infoDot}>  •  </Text>
              <Text style={styles.infoText}>{COURSE_DATA.chapters} Chapters</Text>
            </View>

            <Spacer size="sm" />

            {/* Title */}
            <Text style={styles.courseTitle}>{COURSE_DATA.title}</Text>

            <Spacer size="sm" />

            {/* Student Avatars */}
            <View style={styles.studentsContainer}>
              <View style={styles.avatarsRow}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100?img=1' }}
                  style={[styles.avatar, { zIndex: 4 }]}
                />
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100?img=2' }}
                  style={[styles.avatar, { marginLeft: -15, zIndex: 3 }]}
                />
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100?img=3' }}
                  style={[styles.avatar, { marginLeft: -15, zIndex: 2 }]}
                />
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100?img=4' }}
                  style={[styles.avatar, { marginLeft: -15, zIndex: 1 }]}
                />
                <View style={[styles.avatar, styles.moreAvatar, { marginLeft: -15 }]}>
                  <Text style={styles.moreText}>{COURSE_DATA.enrolledStudents}+</Text>
                </View>
              </View>
            </View>

            <Spacer size="lg" />

            {/* Description Section */}
            <Text style={styles.sectionTitle}>Description</Text>
            <Spacer size="sm" />
            <Text style={styles.description}>{COURSE_DATA.description}</Text>

            <Spacer size="xl" />

            {/* Lessons List */}
            {COURSE_DATA.weeks.map((week) => (
              <TouchableOpacity
                key={week.id}
                style={[styles.lessonRow, week.active && styles.lessonRowActive]}
              >
                <View
                  style={[
                    styles.lessonIcon,
                    { backgroundColor: week.active ? Colors.accent : Colors.accent },
                  ]}
                >
                  <Image source={BookIcon} style={styles.lessonIconImage} resizeMode="contain" />
                </View>
                <View style={styles.lessonContent}>
                  <Text style={[styles.lessonTitle, week.active ? styles.lessonTitleActive : {}]}>
                    {week.title}
                  </Text>
                  <Text style={styles.lessonSubtitle}>{week.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <Spacer size="huge" />
            <Spacer size="huge" />
          </View>
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
              <View style={styles.blurCircle} />

              <TouchableOpacity
                style={[
                  styles.menuItemCircle,
                  {
                    left: menuPositions[0].left,
                    top: menuPositions[0].top,
                    backgroundColor: Colors.buttonPrimary,
                  },
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
                    top: menuPositions[1].top,
                  },
                ]}
                onPress={() => {
                  setShowMenu(false);
                  rootNavigation.navigate(ROUTES.SEARCH as never);
                }}
              >
                <Image source={VectorIcon} style={styles.menuItemImage} resizeMode="contain" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.menuItemCircle,
                  {
                    left: menuPositions[2].left,
                    top: menuPositions[2].top,
                  },
                ]}
                onPress={() => {
                  setShowMenu(false);
                  rootNavigation.navigate(ROUTES.MY_COURSES as never);
                }}
              >
                <Image source={CategoriesIcon} style={styles.menuItemImage} resizeMode="contain" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.menuItemCircle,
                  {
                    left: menuPositions[3].left,
                    top: menuPositions[3].top,
                  },
                ]}
                onPress={() => {
                  setShowMenu(false);
                  rootNavigation.navigate(ROUTES.PROFILE as never);
                }}
              >
                <Image source={ProfileIcon} style={styles.menuItemImage} resizeMode="contain" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.menuItemCircle,
                  {
                    left: menuPositions[4].left,
                    top: menuPositions[4].top,
                  },
                ]}
                onPress={() => {
                  setShowMenu(false);
                }}
              >
                <Image source={SettingsIcon} style={styles.menuItemImage} resizeMode="contain" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => setShowMenu(false)}>
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
  videoPlaceholder: {
    height: 240,
    width: '100%',
  },
  videoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.textWhite,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backIcon: {
    fontSize: 28,
    color: '#000',
    fontWeight: '600',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.textWhite,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  playIcon: {
    fontSize: 32,
    color: '#00000066',
    marginLeft: 5,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: Spacing.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  bookIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  infoText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#6E6E6E',
  },
  infoDot: {
    fontSize: 14,
    color: '#6E6E6E',
  },
  courseTitle: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 31.2,
    color: '#000',
  },
  studentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  moreAvatar: {
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  description: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#6E6E6E',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: 12,
  },
  lessonRowActive: {
    backgroundColor: 'rgba(0, 196, 180, 0.1)',
  },
  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  lessonIconImage: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#6E6E6E',
    marginBottom: 4,
  },
  lessonTitleActive: {
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.accent,
    fontWeight: '600',
  },
  lessonSubtitle: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
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

export default CoursePlayerScreen;

