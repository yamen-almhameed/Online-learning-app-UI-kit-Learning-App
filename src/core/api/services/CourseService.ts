// ============================================
// Course Service - Course-related API calls
// ============================================

import { api } from '../apiClient';
import { ENDPOINTS } from '../../constants/AppConstants';

// Types - API Response
export interface ApiCourse {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  instructor: {
    name: string;
    bio?: string;
    avatar: string;
    userId: string;
  };
  thumbnail: string;
  videoPreview?: string;
  price: number | null;
  discount?: {
    percentage: number;
  };
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  totalLessons: number;
  totalChapters: number;
  totalDuration: number;
  enrolledStudents: number;
  rating: {
    average: number;
    count: number;
  };
  requirements?: string[];
  whatYouWillLearn?: string[];
  isTrending: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  requiredSubscription?: string;
  createdAt: string;
  updatedAt: string;
}

// Types - App Course Interface
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  thumbnail: string;
  price: number | null;
  originalPrice?: number;
  duration: string;
  lessonsCount: number;
  chaptersCount: number;
  rating: number;
  reviewsCount: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  isBookmarked?: boolean;
  isTrending: boolean;
  isPopular: boolean;
  createdAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title?: string;
  bio?: string;
  rating?: number;
  studentsCount?: number;
  coursesCount?: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  isCompleted: boolean;
  isLocked: boolean;
  order: number;
}

export interface Chapter {
  id: string;
  title: string;
  lessonsCount: number;
  duration: string;
  lessons: Lesson[];
  order: number;
}

export interface CourseDetails extends Course {
  chapters: Chapter[];
  whatYouWillLearn: string[];
  requirements: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UserCourse extends Course {
  progress: number;
  completedLessons: number;
  lastAccessedAt: string;
  enrolledAt: string;
}

export interface CourseFilters {
  category?: string;
  level?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  search?: string;
  sortBy?: 'popular' | 'newest' | 'price_low' | 'price_high' | 'rating';
  page?: number;
  limit?: number;
}

export interface CoursesResponse {
  courses: Course[];
  total: number;
  page: number;
  totalPages: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SearchResponse {
  courses: ApiCourse[];
}

// Helper function to convert API course to app course
const mapApiCourseToCourse = (apiCourse: ApiCourse): Course => {
  const levelMap: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'> = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
  };

  // Calculate original price if discount exists
  const originalPrice = apiCourse.discount && apiCourse.discount.percentage > 0 && apiCourse.price
    ? Math.round(apiCourse.price / (1 - apiCourse.discount.percentage / 100))
    : undefined;

  // Format duration (assuming totalDuration is in minutes)
  const hours = Math.floor(apiCourse.totalDuration / 60);
  const minutes = apiCourse.totalDuration % 60;
  const duration = hours > 0 
    ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim()
    : `${minutes}m`;

  return {
    id: apiCourse._id,
    title: apiCourse.title,
    description: apiCourse.description,
    instructor: apiCourse.instructor ? {
      id: apiCourse.instructor.userId || (apiCourse.instructor as any).id || '',
      name: apiCourse.instructor.name || '',
      avatar: apiCourse.instructor.avatar || '',
      bio: apiCourse.instructor.bio,
    } : {
      id: '',
      name: 'Unknown Instructor',
      avatar: '',
    },
    thumbnail: apiCourse.thumbnail || '',
    price: apiCourse.price,
    originalPrice,
    duration,
    lessonsCount: apiCourse.totalLessons || 0,
    chaptersCount: apiCourse.totalChapters || 0,
    rating: apiCourse.rating?.average || 0,
    reviewsCount: apiCourse.rating?.count || 0,
    category: apiCourse.category || '',
    level: levelMap[apiCourse.level] || 'Beginner',
    isTrending: apiCourse.isTrending || false,
    isPopular: apiCourse.isPopular || false,
    createdAt: apiCourse.createdAt || new Date().toISOString(),
  };
};

// Course Service
export const CourseService = {
  /**
   * Get all courses with filters
   */
  getCourses: async (filters?: CourseFilters): Promise<CoursesResponse> => {
    try {
      const response = await api.get<SearchResponse>(ENDPOINTS.COURSES, { params: filters });
      // apiClient interceptor already extracts data.data, so response.data is SearchResponse
      const apiCourses = response.data?.courses || [];
      if (!Array.isArray(apiCourses)) {
        console.error('❌ [CourseService] getCourses: courses is not an array', apiCourses);
        return {
          courses: [],
          total: 0,
          page: filters?.page || 1,
          totalPages: 0,
        };
      }
      const courses = apiCourses.map(mapApiCourseToCourse).filter(Boolean);
      
      // If the API returns pagination info, use it; otherwise estimate
      return {
        courses,
        total: courses.length,
        page: filters?.page || 1,
        totalPages: Math.ceil(courses.length / (filters?.limit || 10)),
      };
    } catch (error) {
      console.error('❌ [CourseService] Error in getCourses:', error);
      return {
        courses: [],
        total: 0,
        page: filters?.page || 1,
        totalPages: 0,
      };
    }
  },

  /**
   * Get trending courses
   */
  getTrendingCourses: async (limit: number = 10): Promise<Course[]> => {
    try {
      const response = await api.get<SearchResponse>(`${ENDPOINTS.COURSES}/trending`, { params: { limit } });
      // apiClient interceptor already extracts data.data, so response.data is SearchResponse
      const apiCourses = response.data?.courses || [];
      if (!Array.isArray(apiCourses)) {
        console.error('❌ [CourseService] getTrendingCourses: courses is not an array', apiCourses);
        return [];
      }
      return apiCourses.map(mapApiCourseToCourse).filter(Boolean);
    } catch (error) {
      console.error('❌ [CourseService] Error in getTrendingCourses:', error);
      return [];
    }
  },

  /**
   * Get popular courses
   */
  getPopularCourses: async (limit: number = 10): Promise<Course[]> => {
    try {
      const response = await api.get<SearchResponse>(`${ENDPOINTS.COURSES}/popular`, { params: { limit } });
      // apiClient interceptor already extracts data.data, so response.data is SearchResponse
      const apiCourses = response.data?.courses || [];
      if (!Array.isArray(apiCourses)) {
        console.error('❌ [CourseService] getPopularCourses: courses is not an array', apiCourses);
        return [];
      }
      return apiCourses.map(mapApiCourseToCourse).filter(Boolean);
    } catch (error) {
      console.error('❌ [CourseService] Error in getPopularCourses:', error);
      return [];
    }
  },

  /**
   * Get course details by ID
   */
  getCourseDetails: async (courseId: string): Promise<CourseDetails> => {
    const url = ENDPOINTS.COURSE_DETAILS.replace(':id', courseId);
    const response = await api.get<any>(url);
    
    // apiClient interceptor already extracts data.data, so response.data should be { course: {...}, isEnrolled: ..., progress: ... }
    const apiData = (response as any).data || response.data;
    
    console.log('🔍 [CourseService] Raw API response data:', JSON.stringify(apiData, null, 2));
    
    // Extract course from the response (it's nested in data.course)
    const courseData = apiData.course || apiData;
    
    console.log('🔍 [CourseService] Extracted courseData:', {
      hasId: !!(courseData?._id || courseData?.id),
      hasChapters: !!courseData?.chapters,
      chaptersType: Array.isArray(courseData?.chapters) ? 'array' : typeof courseData?.chapters,
      chaptersLength: Array.isArray(courseData?.chapters) ? courseData.chapters.length : 0,
    });
    
    if (!courseData || (!courseData._id && !courseData.id)) {
      console.error('❌ [CourseService] Invalid course data:', courseData);
      throw new Error('Invalid course data received from API');
    }
    
    // Map the API data to CourseDetails
    const baseCourse = mapApiCourseToCourse(courseData);
    
    // Format chapters if they exist - ensure it's always an array
    const chapters: Chapter[] = (courseData.chapters && Array.isArray(courseData.chapters)) ? courseData.chapters.map((chapter: any, index: number) => {
      const hours = Math.floor((chapter.totalDuration || 0) / 60);
      const minutes = (chapter.totalDuration || 0) % 60;
      const duration = hours > 0 
        ? `${hours}hr ${minutes > 0 ? `${minutes}min` : ''}`.trim()
        : `${minutes}min`;
      
      return {
        id: chapter._id || chapter.id || `chapter-${index}`,
        title: chapter.title || chapter.name || '',
        lessonsCount: chapter.lessons?.length || chapter.totalLessons || 0,
        duration,
        lessons: chapter.lessons ? chapter.lessons.map((lesson: any, lessonIndex: number) => ({
          id: lesson._id || lesson.id || `lesson-${lessonIndex}`,
          title: lesson.title || lesson.name || '',
          duration: lesson.duration || '0min',
          videoUrl: lesson.videoUrl || lesson.video || undefined,
          isCompleted: lesson.isCompleted || false,
          isLocked: lesson.isLocked || false,
          order: lesson.order || lessonIndex,
        })) : [],
        order: chapter.order || index,
      };
    }) : [];
    
    console.log('🔍 [CourseService] Final chapters array:', {
      length: chapters.length,
      chapters: chapters.map(c => ({ id: c.id, title: c.title })),
    });
    
    const courseDetails: CourseDetails = {
      ...baseCourse,
      chapters: Array.isArray(chapters) ? chapters : [],
      whatYouWillLearn: courseData.whatYouWillLearn || [],
      requirements: courseData.requirements || [],
      reviews: courseData.reviews ? courseData.reviews.map((review: any) => ({
        id: review._id || review.id,
        user: {
          id: review.user?._id || review.user?.id || review.userId,
          name: review.user?.name || '',
          avatar: review.user?.avatar || review.user?.profilePicture || '',
        },
        rating: review.rating || 0,
        comment: review.comment || review.text || '',
        createdAt: review.createdAt || new Date().toISOString(),
      })) : [],
    };
    
    console.log('✅ [CourseService] Returning courseDetails:', {
      id: courseDetails.id,
      title: courseDetails.title,
      chaptersCount: courseDetails.chapters.length,
    });
    
    return courseDetails;
  },

  /**
   * Get course lessons
   * ⚠️ غير مستخدم حالياً - محفوظ للاستخدام المستقبلي
   */
  getCourseLessons: async (courseId: string): Promise<Chapter[]> => {
    try {
      const url = ENDPOINTS.COURSE_LESSONS.replace(':id', courseId);
      const response = await api.get<Chapter[]>(url, { timeout: 30000 });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('❌ [CourseService] Error in getCourseLessons:', error);
      return [];
    }
  },

  /**
   * Get course reviews
   * ⚠️ غير مستخدم حالياً - محفوظ للاستخدام المستقبلي
   */
  getCourseReviews: async (courseId: string, page: number = 1): Promise<Review[]> => {
    try {
      const url = ENDPOINTS.COURSE_REVIEWS.replace(':id', courseId);
      const response = await api.get<Review[]>(url, { params: { page }, timeout: 30000 });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('❌ [CourseService] Error in getCourseReviews:', error);
      return [];
    }
  },

  /**
   * Enroll in a course
   * ⚠️ غير مستخدم حالياً - محفوظ للاستخدام المستقبلي
   */
  enrollCourse: async (courseId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const url = ENDPOINTS.COURSE_ENROLL.replace(':id', courseId);
      const response = await api.post<{ success: boolean; message: string }>(url, {}, { timeout: 30000 });
      return (response as any).data || { success: false, message: 'Unknown error' };
    } catch (error) {
      console.error('❌ [CourseService] Error in enrollCourse:', error);
      return { success: false, message: 'Failed to enroll in course' };
    }
  },

  /**
   * Add course to user history
   * ⚠️ غير مستخدم حالياً - محفوظ للاستخدام المستقبلي
   */
  addToHistory: async (courseId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const url = ENDPOINTS.USER_HISTORY.replace(':courseId', courseId);
      const response = await api.post<{ success: boolean; message: string }>(url, {}, { timeout: 30000 });
      return (response as any).data || { success: false, message: 'Unknown error' };
    } catch (error) {
      console.error('❌ [CourseService] Error in addToHistory:', error);
      return { success: false, message: 'Failed to add to history' };
    }
  },

  /**
   * Get user's enrolled courses
   * ⚠️ غير مستخدم حالياً - MyCoursesScreen يستخدم mock data
   */
  getMyCourses: async (): Promise<UserCourse[]> => {
    try {
      const response = await api.get<UserCourse[]>(ENDPOINTS.MY_COURSES, { timeout: 30000 });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('❌ [CourseService] Error in getMyCourses:', error);
      return [];
    }
  },

  /**
   * Update course progress
   * ⚠️ غير مستخدم حالياً - محفوظ للاستخدام المستقبلي
   */
  updateProgress: async (courseId: string, lessonId: string): Promise<{ progress: number }> => {
    try {
      const url = ENDPOINTS.COURSE_PROGRESS.replace(':id', courseId);
      const response = await api.post<{ progress: number }>(url, { lessonId }, { timeout: 30000 });
      return response.data || { progress: 0 };
    } catch (error) {
      console.error('❌ [CourseService] Error in updateProgress:', error);
      return { progress: 0 };
    }
  },

  /**
   * Toggle bookmark
   * ⚠️ غير مستخدم حالياً - محفوظ للاستخدام المستقبلي
   */
  toggleBookmark: async (courseId: string): Promise<{ isBookmarked: boolean }> => {
    try {
      const response = await api.post<{ isBookmarked: boolean }>(
        `${ENDPOINTS.COURSES}/${courseId}/bookmark`,
        {},
        { timeout: 30000 }
      );
      return response.data || { isBookmarked: false };
    } catch (error) {
      console.error('❌ [CourseService] Error in toggleBookmark:', error);
      return { isBookmarked: false };
    }
  },

  /**
   * Search courses
   */
  searchCourses: async (query: string): Promise<Course[]> => {
    try {
      console.log('🔍 [CourseService] Searching courses with query:', query);
      
      const response = await api.get<SearchResponse>(ENDPOINTS.SEARCH, { 
        params: { q: query },
        timeout: 30000, // 30 seconds timeout
      });
      
      console.log('✅ [CourseService] Search response received:', {
        hasData: !!response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        keys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : null,
      });
      
      // Handle different response structures
      let apiCourses: ApiCourse[] = [];
      
      // Case 1: response.data is an array directly (most common for search)
      if (Array.isArray(response.data)) {
        console.log('🔵 [CourseService] Response is direct array');
        apiCourses = response.data;
      }
      // Case 2: response.data has courses property
      else if (response.data && typeof response.data === 'object' && 'courses' in response.data) {
        console.log('🔵 [CourseService] Response has courses property');
        const coursesData = (response.data as SearchResponse).courses;
        apiCourses = Array.isArray(coursesData) ? coursesData : [];
      }
      // Case 3: response.data.data has courses (nested)
      else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const nestedData = (response.data as any).data;
        if (Array.isArray(nestedData)) {
          console.log('🔵 [CourseService] Response.data.data is array');
          apiCourses = nestedData;
        } else if (nestedData && typeof nestedData === 'object' && 'courses' in nestedData) {
          console.log('🔵 [CourseService] Response.data.data has courses');
          const coursesData = nestedData.courses;
          apiCourses = Array.isArray(coursesData) ? coursesData : [];
        } else if (nestedData && typeof nestedData === 'object' && Array.isArray(nestedData)) {
          console.log('🔵 [CourseService] Response.data.data is array (nested)');
          apiCourses = nestedData;
        }
      }
      // Case 4: response.data might be the courses array wrapped in another structure
      else if (response.data && typeof response.data === 'object') {
        console.log('🔵 [CourseService] Checking response.data for array properties');
        // Check if any property is an array of courses
        const dataObj = response.data as any;
        for (const key in dataObj) {
          if (Object.prototype.hasOwnProperty.call(dataObj, key)) {
            const value = dataObj[key];
            if (Array.isArray(value) && value.length > 0 && value[0] && typeof value[0] === 'object' && '_id' in value[0]) {
              console.log(`🔵 [CourseService] Found courses array in property: ${key}`);
              apiCourses = value;
              break;
            }
          }
        }
      }
      
      if (!Array.isArray(apiCourses)) {
        console.error('❌ [CourseService] searchCourses: courses is not an array', {
          apiCourses,
          responseData: response.data,
        });
        return [];
      }
      
      console.log(`✅ [CourseService] Found ${apiCourses.length} courses`);
      const mappedCourses = apiCourses.map(mapApiCourseToCourse).filter(Boolean);
      console.log(`✅ [CourseService] Mapped ${mappedCourses.length} courses successfully`);
      
      return mappedCourses;
    } catch (error: any) {
      console.error('❌ [CourseService] Error in searchCourses:', {
        message: error?.message,
        code: error?.code,
        response: error?.response?.data,
        query,
      });
      return [];
    }
  },

  /**
   * Get courses by category
   */
  getCoursesByCategory: async (category: string): Promise<Course[]> => {
    try {
      const response = await api.get<SearchResponse>(ENDPOINTS.COURSES, { 
        params: { category, limit: 100 } 
      });
      // apiClient interceptor already extracts data.data, so response.data is SearchResponse
      const apiCourses = response.data?.courses || [];
      if (!Array.isArray(apiCourses)) {
        console.error('❌ [CourseService] getCoursesByCategory: courses is not an array', apiCourses);
        return [];
      }
      return apiCourses.map(mapApiCourseToCourse).filter(Boolean);
    } catch (error) {
      console.error('❌ [CourseService] Error in getCoursesByCategory:', error);
      return [];
    }
  },

  /**
   * Get categories
   * ⚠️ غير مستخدم حالياً - يستخدم COURSE_CATEGORIES من AppConstants
   */
  getCategories: async (): Promise<{ id: string; name: string; icon: string; coursesCount: number }[]> => {
    try {
      const response = await api.get<{ id: string; name: string; icon: string; coursesCount: number }[]>(
        ENDPOINTS.CATEGORIES,
        { timeout: 30000 }
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('❌ [CourseService] Error in getCategories:', error);
      return [];
    }
  },
};

export default CourseService;

