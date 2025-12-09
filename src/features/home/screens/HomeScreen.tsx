import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import { useTheme } from '../../../core/hooks/useTheme';
import { useAuth } from '../../../core/hooks/useAuth';
import { navigationRef } from '../../../App';
import { Text } from '../../../shared/components/atoms/Text';
import { Avatar } from '../../../shared/components/atoms/Avatar';
import { Badge } from '../../../shared/components/atoms/Badge';
import { Spacer } from '../../../shared/components/atoms/Spacer';
import { SearchBar } from '../../../shared/components/molecules/SearchBar';
import { CategoryChip } from '../../../shared/components/molecules/CategoryChip';
import { CourseCard } from '../../../shared/components/organisms/CourseCard';
import { Spacing } from '../../../core/theme/spacing';
import { COURSE_CATEGORIES, APP_SETTINGS } from '../../../core/constants/AppConstants';
import { HomeScreenProps } from '../../../navigation/types';
import { ROUTES } from '../../../navigation/AppRoutes';
import { Colors } from '../../../core/theme/colors';
import { CourseService, Course } from '../../../core/api/services/CourseService';

// Icons
const NotificationIcon = require('../../../shared/assets/icons/notfication.png');
const SettingIcon = require('../../../shared/assets/icons/setting-4.png');
const VectorIcon = require('../../../shared/assets/icons/Vector (1).png');
const searchIcon = require('../../../shared/assets/icons/search-normal.png');
const HomeIcon = require('../../../shared/assets/icons/Home.png');
const ProfileIcon = require('../../../shared/assets/icons/profile.png');
const SettingsIcon = require('../../../shared/assets/icons/setting.png');
const CategoriesIcon = require('../../../shared/assets/icons/categories.png');

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [trendingCourses, setTrendingCourses] = useState<Course[]>([]);
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setShowMenu(false);
      };
    }, [])
  );

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    const loadInitialCourses = async () => {
      if (!isMounted) return;
      
      setInitialLoading(true);
      
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Courses loading timeout'));
          }, 30000); // 30 seconds timeout
        });

        const coursesPromise = Promise.all([
          CourseService.getTrendingCourses(10),
          CourseService.getPopularCourses(10),
        ]);

        const [trending, popular] = await Promise.race([
          coursesPromise,
          timeoutPromise,
        ]) as [Course[], Course[]];
        
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        if (!isMounted) return;
        
        // Ensure data is an array
        setTrendingCourses(Array.isArray(trending) ? trending : []);
        setPopularCourses(Array.isArray(popular) ? popular : []);
      } catch (error) {
        if (__DEV__) {
          console.error('Error loading initial courses:', error);
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (isMounted) {
          setTrendingCourses([]);
          setPopularCourses([]);
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };
    
    // Add small delay to prevent blocking navigation
    const timer = setTimeout(() => {
      loadInitialCourses();
    }, 100);
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      clearTimeout(timer);
    };
  }, []);

  const mapCategoryNameToSlug = (categoryName: string): string => {
    const categoryMap: Record<string, string> = {
      'UI & UX': 'ui-ux',
      'Animation': 'animation',
      'Graphic Design': 'graphic-design',
      'Programming': 'programming',
      'Business': 'business',
      'Marketing': 'marketing',
      'Data Science': 'data-science',
      'Photography': 'photography',
    };
    return categoryMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  // Filter by category when selectedCategory changes
  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (selectedCategory && !searchQuery.trim()) {
      const loadCoursesByCategory = async () => {
        if (!isMounted) return;
        
        setLoading(true);
        try {
          const categorySlug = mapCategoryNameToSlug(selectedCategory);
          
          // Add timeout protection
          const timeoutPromise = new Promise<Course[]>((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Category loading timeout')), 30000);
          });

          const categoryPromise = CourseService.getCoursesByCategory(categorySlug);
          const results = await Promise.race([categoryPromise, timeoutPromise]);
          
          if (isMounted) {
            setFilteredCourses(Array.isArray(results) ? results : []);
          }
        } catch (error) {
          if (__DEV__) {
            console.error('Error loading courses by category:', error);
          }
          if (isMounted) {
            setFilteredCourses([]);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      loadCoursesByCategory();
    } else if (!selectedCategory && !searchQuery.trim()) {
      setFilteredCourses([]);
      setLoading(false);
    }

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [selectedCategory, searchQuery]);

  // Handle category selection
  const handleCategoryPress = (categoryName: string) => {
    try {
      if (selectedCategory === categoryName) {
        // Deselect if already selected
        setSelectedCategory(null);
        setFilteredCourses([]);
      } else {
        setSelectedCategory(categoryName);
        // Clear search when selecting category
        setSearchQuery('');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error in handleCategoryPress:', error);
      }
    }
  };

  // Circular menu positions
  const MENU_ITEM_SIZE = 0;
  const CLOSE_BUTTON_SIZE = 100; // زر X أكبر من الأزرار الأخرى
  const CIRCLE_RADIUS = 70; // نصف القطر للدائرة
  const CONTAINER_SIZE = 450; // حجم الحاوية لاستيعاب الدائرة
  const CENTER_X = CONTAINER_SIZE / 3; // مركز الحاوية
  const CENTER_Y = CONTAINER_SIZE / 2; // مركز الحاوية
  
  // Calculate positions for 5 buttons in a circle
  // Starting from top (90 degrees) and going clockwise
  const getCircularPosition = (index: number, total: number, extraRadius: number = 0) => {
    const angle = (90 - (index * 360 / total)) * (Math.PI / 180);
    const radius = CIRCLE_RADIUS + extraRadius; // إضافة padding إضافي للبروفايل والكتب
    const x = CENTER_X + radius * Math.cos(angle) - (MENU_ITEM_SIZE / 2); // تعويض لنصف حجم الزر
    const y = CENTER_Y - radius * Math.sin(angle) - (MENU_ITEM_SIZE / 2); // تعويض لنصف حجم الزر
    return { left: x, top: y };
  };
  
  const menuPositions = [
    getCircularPosition(0.1, 5, -15), // Home - Top
    getCircularPosition(1, 5, 5), // Search - Top Right
    getCircularPosition(2, 1.52, 35), // Courses - Bottom Right (مع padding إضافي)
    getCircularPosition(3, 4.5, 20), // Profile - Bottom Left (مع padding إضافي)
    getCircularPosition(4, 5, -10), // Settings - Top Left
  ];

  // Handle course press - check subscription before navigating
  const handleCoursePress = (course: Course) => {
    try {
      // Check if user has an active subscription
      const hasActiveSubscription = user?.subscription?.isActive === true;
      
      if (hasActiveSubscription) {
        navigation.navigate(ROUTES.COURSE_PLAYER, { courseId: course.id });
      } else {
        try {
          navigation.dispatch(
            CommonActions.navigate({
              name: ROUTES.SUBSCRIPTION_PLANS,
            })
          );
        } catch (navErr: any) {
          try {
            navigation.navigate(ROUTES.SUBSCRIPTION_PLANS);
          } catch (navErr2: any) {
            if (navigationRef?.isReady()) {
              (navigationRef as any).navigate(ROUTES.SUBSCRIPTION_PLANS);
            }
          }
        }
      }
    } catch (navError: any) {
      if (__DEV__) {
        console.error('Navigation error:', navError);
      }
    }
  };

  // Navigate to notifications
  const handleNotificationPress = () => {
    // TODO: Navigate to notifications screen
  };

  // Navigate to all courses
  const handleSeeAll = (type: 'trending' | 'popular') => {
    // TODO: Navigate to courses list screen
  };

  // Render category item
  const renderCategory = ({ item }: { item: typeof COURSE_CATEGORIES[0] }) => (
    <CategoryChip
      label={item.name}
      isSelected={selectedCategory === item.name}
      onPress={() => handleCategoryPress(item.name)}
    />
  );

  // Handle bookmark press
  const handleBookmarkPress = (courseId: string) => {
    // TODO: Implement bookmark functionality
  };

  // Render course
  const renderCourse = ({ item }: { item: Course }) => {
    if (!item || !item.id) {
      return null;
    }
    
    try {
      return (
        <CourseCard
          id={item.id}
          title={item.title || 'Untitled Course'}
          instructor={item.instructor?.name || 'Unknown Instructor'}
          price={item.price || 0}
          image={{ uri: item.thumbnail || 'https://picsum.photos/200/150' }}
          onPress={() => handleCoursePress(item)}
          onBookmarkPress={() => handleBookmarkPress(item.id)}
          variant="large"
        />
      );
    } catch (error) {
      if (__DEV__) {
        console.error('Error rendering course:', error);
      }
      return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="h5" color={theme.colors.textPrimary}>
              Hello, {user?.fullName?.split(' ')[0] || 'Ahmed'}
            </Text>
          </View>
          <View style={styles.headerRight}>        
            {/* Notification Bell */}
            <TouchableOpacity
              onPress={handleNotificationPress}
              style={[styles.notificationBtn, { borderColor: theme.colors.border }]}
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
            
            {/* Avatar */}
            <Avatar
              source={{ uri: user?.avatar || 'https://picsum.photos/100' }}
              size="lg"
            />
          </View>
        </View>

        {/* Welcome Text */}
        <Spacer size="lg" />
        <Text style={styles.lightText}>
          Let's Learn 🎓
        </Text>
        <Text style={styles.semiboldText}>
          Something New
        </Text>

        {/* Search Bar */}
        <Spacer size="xl" />
        <SearchBar
          value=""
          onChangeText={() => {}}
          placeholder="Search Course"
          editable={false}
          onPress={() => {
            try {
              if (navigation && typeof navigation.navigate === 'function') {
                try {
                  navigation.navigate(ROUTES.SEARCH, { initialQuery: '' });
                } catch (navErr) {
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: ROUTES.SEARCH,
                      params: { initialQuery: '' },
                    })
                  );
                }
              } else if (navigationRef?.isReady()) {
                (navigationRef as any).navigate(ROUTES.SEARCH, { initialQuery: '' });
              }
            } catch (navError: any) {
              if (__DEV__) {
                console.error('Navigation error to search:', navError);
              }
              if (navigationRef?.isReady()) {
                try {
                  (navigationRef as any).navigate(ROUTES.SEARCH, { initialQuery: '' });
                } catch (refError) {
                  if (__DEV__) {
                    console.error('NavigationRef failed:', refError);
                  }
                }
              }
            }
          }}
        />

        {/* Categories */}
        <Spacer size="xl" />
        <FlatList
          data={COURSE_CATEGORIES}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Search and category filtering moved to SearchScreen */}

        {/* Trending Courses - Show only when no search/category filter */}
        {!searchQuery.trim() && !selectedCategory && (
          <>
            <Spacer size="xl" />
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>
                  Trending Courses
                </Text>
                <Text style={styles.fireEmoji}>🔥</Text>
              </View>
              <TouchableOpacity onPress={() => handleSeeAll('trending')}>
                <Text style={styles.seeAllText}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <Spacer size="md" />
            {initialLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : trendingCourses.length > 0 ? (
              <FlatList
                data={trendingCourses}
                renderItem={renderCourse}
                keyExtractor={(item, index) => item?.id || `trending-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                removeClippedSubviews={true}
                initialNumToRender={3}
                maxToRenderPerBatch={3}
                windowSize={5}
              />
            ) : null}
          </>
        )}

        {/* Popular Courses - Show only when no search/category filter */}
        {!searchQuery.trim() && !selectedCategory && (
          <>
            <Spacer size="xl" />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Popular Courses
              </Text>
              <TouchableOpacity onPress={() => handleSeeAll('popular')}>
                <Text style={styles.seeAllText}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <Spacer size="md" />
            {initialLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : popularCourses.length > 0 ? (
              <FlatList
                data={popularCourses}
                renderItem={renderCourse}
                keyExtractor={(item, index) => item?.id || `popular-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                removeClippedSubviews={true}
                initialNumToRender={3}
                maxToRenderPerBatch={3}
                windowSize={5}
              />
            ) : null}
          </>
        )}

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
            {/* Home - Top */}
            <TouchableOpacity 
              style={[
                styles.menuItem, 
                { 
                  left: menuPositions[0].left, 
                  top: menuPositions[0].top,
                  backgroundColor: Colors.buttonPrimary 
                }
              ]}
              onPress={() => {
                setShowMenu(false);
                // Already on home
              }}
            >
              <Image 
                source={HomeIcon} 
                style={[styles.menuItemImage, { tintColor: '#fff' }]}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Search - Top Right */}
            <TouchableOpacity 
              style={[
                styles.menuItem, 
                { 
                  left: menuPositions[1].left, 
                  top: menuPositions[1].top 
                }
              ]}
              onPress={() => {
                try {
                  if (navigation && typeof navigation.navigate === 'function') {
                    try {
                      navigation.navigate(ROUTES.SEARCH, { initialQuery: '' });
                      setTimeout(() => setShowMenu(false), 100);
                    } catch (navErr) {
                      navigation.dispatch(
                        CommonActions.navigate({
                          name: ROUTES.SEARCH,
                          params: { initialQuery: '' },
                        })
                      );
                      setTimeout(() => setShowMenu(false), 100);
                    }
                  } else if (navigationRef?.isReady()) {
                    (navigationRef as any).navigate(ROUTES.SEARCH, { initialQuery: '' });
                    setTimeout(() => setShowMenu(false), 100);
                  } else {
                    setShowMenu(false);
                  }
                } catch (navError: any) {
                  if (__DEV__) {
                    console.error('Navigation error to search:', navError);
                  }
                  if (navigationRef?.isReady()) {
                    try {
                      (navigationRef as any).navigate(ROUTES.SEARCH, { initialQuery: '' });
                    } catch (refError) {
                      if (__DEV__) {
                        console.error('NavigationRef failed:', refError);
                      }
                    }
                  }
                  setShowMenu(false);
                }
              }}
            >
              <Image 
                source={VectorIcon} 
                style={styles.menuItemImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Courses - Bottom Right */}
            <TouchableOpacity 
              style={[
                styles.menuItem, 
                { 
                  left: menuPositions[2].left, 
                  top: menuPositions[2].top 
                }
              ]}
              onPress={() => {
                try {
                  navigation.navigate(ROUTES.MY_COURSES);
                  setTimeout(() => setShowMenu(false), 100);
                } catch (navError) {
                  if (__DEV__) {
                    console.error('Navigation error to MY_COURSES:', navError);
                  }
                  setShowMenu(false);
                }
              }}
            >
              <Image 
                source={CategoriesIcon} 
                style={styles.menuItemImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Profile - Bottom Left */}
            <TouchableOpacity 
              style={[
                styles.menuItem, 
                { 
                  left: menuPositions[3].left, 
                  top: menuPositions[3].top 
                }
              ]}
              onPress={() => {
                try {
                  navigation.navigate(ROUTES.PROFILE);
                  setTimeout(() => setShowMenu(false), 100);
                } catch (navError) {
                  if (__DEV__) {
                    console.error('Navigation error to PROFILE:', navError);
                  }
                  setShowMenu(false);
                }
              }}
            >
              <Image 
                source={ProfileIcon} 
                style={styles.menuItemImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Settings - Top Left */}
            <TouchableOpacity 
              style={[
                styles.menuItem, 
                { 
                  left: menuPositions[4].left, 
                  top: menuPositions[4].top 
                }
              ]}
              onPress={() => {
                setShowMenu(false);
                // Navigate to settings
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
 
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationIcon: {
    width: 20,
    height: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireEmoji: {
    fontSize: 30,
    marginLeft: Spacing.xs,
  },
  categoriesList: {
    paddingRight: Spacing.lg,
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
    fontSize: 24,
    fontWeight: '300',
  },
  sectionTitle: {
    fontFamily: 'ClashDisplay-Semibold',
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 28, // زيادة lineHeight لتجنب القص
    letterSpacing: 0.44, // 2% of 22
    textTransform: 'capitalize',
    color: '#000',
    includeFontPadding: false, // إزالة padding إضافي
    textAlignVertical: 'center',
  },
  seeAllText: {
    fontFamily: 'ClashDisplay-Medium',  // لازم يكون الخط موجود في المشروع
    fontWeight: '500',             // وزن Medium
    fontSize: 14,
    lineHeight: 16.8,              
    letterSpacing: 0.28,           
    textAlign: 'right',
    textTransform: 'capitalize',
    color: Colors.accent,
  },
  welcomeText: {
    fontFamily: 'ClashDisplay-Semibold',
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 28.8,
    letterSpacing: 0.48,
    textTransform: 'capitalize',
    color: '#000',
  },  lightText: {
    
    fontFamily: 'ClashDisplay-Regular', // الخط موجود في المشروع
    fontWeight: '300',            // Light
    fontStyle: 'normal',          // Light لا يعتبر font-style
    fontSize: 42,
    lineHeight: 50.4,             // 42 * 1.2
    letterSpacing: 0.2,          // 2% من 42px ≈ 0.84
    textAlign: 'left',
    textTransform: 'capitalize',
    verticalAlign: 'middle',      // يعمل على inline/inline-block فقط، غالبًا يمكن تجاهله في React Native
  },
  semiboldText: {
    fontFamily: 'ClashDisplay-Semibold',
    fontWeight: '600',            // Semibold
    fontSize: 40,
    lineHeight: 50.4,
    letterSpacing: 0.84,
    textAlign: 'left',
    textTransform: 'capitalize',
    verticalAlign: 'top',
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
    left: 10,
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
    left: 50,
    backgroundColor: 'rgba(41, 40, 40, 0.3)',
    borderWidth: 1.5,
    borderColor: 'rgba(195, 195, 195, 0.5)',
    overflow: 'hidden',
  },
  menuItem: {
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
  menuItemIcon: {
    fontSize: 23,
    color: '#333',
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
    top: 245, // (280 - 90) / 2 = 95
    left: 145, // (280 - 90) / 2 = 95
    zIndex: 1001,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default HomeScreen;

