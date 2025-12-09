import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../core/hooks/useTheme';
import { useAuth } from '../../../core/hooks/useAuth';
import { Text } from '../../../shared/components/atoms/Text';
import { Spacer } from '../../../shared/components/atoms/Spacer';
import { SearchBar } from '../../../shared/components/molecules/SearchBar';
import { CategoryChip } from '../../../shared/components/molecules/CategoryChip';
import { CourseCard } from '../../../shared/components/organisms/CourseCard';
import { HeaderBar } from '../../../shared/components/molecules/HeaderBar';
import { Spacing } from '../../../core/theme/spacing';
import { COURSE_CATEGORIES, APP_SETTINGS } from '../../../core/constants/AppConstants';
import { SearchScreenProps } from '../../../navigation/types';
import { ROUTES } from '../../../navigation/AppRoutes';
import { CourseService, Course } from '../../../core/api/services/CourseService';

const SEARCH_RESULTS = [
  {
    id: '1',
    title: 'UI/UX Design Fundamentals',
    instructor: 'John Doe',
    price: 250,
    image: 'https://picsum.photos/200/150?random=10',
  },
  {
    id: '2',
    title: 'Advanced React Native',
    instructor: 'Jane Smith',
    price: 350,
    image: 'https://picsum.photos/200/150?random=11',
  },
  {
    id: '3',
    title: 'Python for Beginners',
    instructor: 'Mike Johnson',
    price: 200,
    image: 'https://picsum.photos/200/150?random=12',
  },
];

const SearchScreen: React.FC<SearchScreenProps> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const initialQuery = route.params?.initialQuery || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [results, setResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isScreenReady, setIsScreenReady] = useState(false);

  // Mark screen as ready after mount to prevent immediate search
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScreenReady(true);
    }, 300); // Wait 300ms before allowing searches
    
    return () => clearTimeout(timer);
  }, []);

  // Update searchQuery when initialQuery changes (e.g., when navigating from HomeScreen)
  useEffect(() => {
    if (route.params?.initialQuery !== undefined) {
      setSearchQuery(route.params.initialQuery);
    }
  }, [route.params?.initialQuery]);

  // Search courses when searchQuery changes
  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // If search query is empty, clear results
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Debounce search - only search if query is at least 2 characters
    timeoutId = setTimeout(async () => {
      const trimmedQuery = searchQuery.trim();
      // Don't search if screen is not ready yet
      if (trimmedQuery.length >= 2 && isMounted && isScreenReady) {
        console.log('🔍 [SearchScreen] Starting search for:', trimmedQuery);
        setLoading(true);
        try {
          // Add timeout protection
          const timeoutPromise = new Promise<Course[]>((_, reject) => {
            setTimeout(() => {
              console.error('⏱️ [SearchScreen] Search timeout after 30 seconds');
              reject(new Error('Search timeout'));
            }, 30000);
          });

          const searchPromise = CourseService.searchCourses(trimmedQuery);
          const searchResults = await Promise.race([searchPromise, timeoutPromise]);
          
          console.log('✅ [SearchScreen] Search completed, results:', searchResults?.length || 0);
          
          if (isMounted) {
            const safeResults = Array.isArray(searchResults) ? searchResults : [];
            setResults(safeResults);
            console.log('✅ [SearchScreen] Results set:', safeResults.length);
          }
        } catch (error: any) {
          console.error('❌ [SearchScreen] Error searching courses:', {
            message: error?.message,
            code: error?.code,
            error,
          });
          if (isMounted) {
            setResults([]);
            setLoading(false);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
            console.log('✅ [SearchScreen] Loading set to false');
          }
        }
      } else if (isMounted) {
        setResults([]);
        setLoading(false);
      }
    }, APP_SETTINGS.SEARCH_DEBOUNCE);

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchQuery, isScreenReady]);

  // Handle course press - check subscription before navigating
  const handleCoursePress = (course: Course) => {
    try {
      // Check if user has an active subscription
      const hasActiveSubscription = user?.subscription?.isActive === true;
      
      if (hasActiveSubscription) {
        // User has active subscription, navigate to course player
        navigation.navigate(ROUTES.COURSE_PLAYER, { courseId: course.id });
      } else {
        // User doesn't have active subscription, show subscription plans
        navigation.navigate(ROUTES.SUBSCRIPTION_PLANS);
      }
    } catch (error) {
      console.error('Error in handleCoursePress:', error);
    }
  };

  // Handle bookmark press
  const handleBookmarkPress = (courseId: string) => {
    try {
      console.log('Bookmark course:', courseId);
      // TODO: Implement bookmark functionality
    } catch (error) {
      console.error('Error in handleBookmarkPress:', error);
    }
  };

  // Handle category selection
  const handleCategoryPress = (categoryName: string) => {
    try {
      if (selectedCategory === categoryName) {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(categoryName);
        setSearchQuery(''); // Clear search when selecting category
      }
    } catch (error) {
      console.error('Error in handleCategoryPress:', error);
    }
  };

  // Map category name to API category slug
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

  // Load courses by category
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
          const categoryResults = await Promise.race([categoryPromise, timeoutPromise]);
          
          if (isMounted) {
            setResults(Array.isArray(categoryResults) ? categoryResults : []);
          }
        } catch (error) {
          console.error('Error loading courses by category:', error);
          if (isMounted) {
            setResults([]);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      loadCoursesByCategory();
    } else if (!selectedCategory && !searchQuery.trim()) {
      setResults([]);
      setLoading(false);
    }

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [selectedCategory, searchQuery]);

  // Render category item
  const renderCategory = ({ item }: { item: typeof COURSE_CATEGORIES[0] }) => (
    <CategoryChip
      label={item.name}
      isSelected={selectedCategory === item.name}
      onPress={() => handleCategoryPress(item.name)}
    />
  );

  // Render course item
  const renderCourse = ({ item }: { item: Course }) => {
    if (!item || !item.id) {
      return null;
    }
    
    try {
      return (
        <View style={styles.courseCardWrapper}>
          <CourseCard
            id={item.id}
            title={item.title || 'Untitled Course'}
            instructor={item.instructor?.name || 'Unknown Instructor'}
            price={item.price || 0}
            image={{ uri: item.thumbnail || 'https://picsum.photos/200/150' }}
            onPress={() => handleCoursePress(item)}
            onBookmarkPress={() => handleBookmarkPress(item.id)}
            variant="large"
            fullWidth
          />
        </View>
      );
    } catch (error) {
      console.error('Error rendering course:', error, item);
      return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.background}
        />

        {/* Header */}
        <HeaderBar
          title="Search"
          showBackButton
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search Course"
              autoFocus
            />
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <FlatList
              data={COURSE_CATEGORIES}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>

          {/* Course List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Spacer size="md" />
              <Text variant="body" color={theme.colors.textSecondary} align="center">
                Searching courses...
              </Text>
            </View>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={renderCourse}
              keyExtractor={(item, index) => item?.id || `course-${index}`}
              scrollEnabled={false}
              contentContainerStyle={styles.coursesList}
              removeClippedSubviews={true}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
            />
          ) : searchQuery.trim().length >= 2 || selectedCategory ? (
            <View style={styles.emptyContainer}>
              <Text variant="h4" color={theme.colors.textLight} align="center">
                🔍
              </Text>
              <Spacer size="md" />
              <Text variant="body" color={theme.colors.textSecondary} align="center">
                No courses found
              </Text>
              <Text variant="bodySmall" color={theme.colors.textLight} align="center">
                {searchQuery.trim() 
                  ? `Try different keywords for "${searchQuery}"` 
                  : `No courses found in ${selectedCategory} category`}
              </Text>
            </View>
          ) : null}

          <Spacer size="huge" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.huge,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  categoriesContainer: {
    paddingVertical: Spacing.md,
  },
  categoriesList: {
    paddingHorizontal: Spacing.md,
    paddingRight: Spacing.lg,
  },
  courseCardWrapper: {
    marginBottom: Spacing.md,
    width: '100%',
  },
  coursesList: {
    paddingHorizontal: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.huge,
    paddingHorizontal: Spacing.md,
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchScreen;

