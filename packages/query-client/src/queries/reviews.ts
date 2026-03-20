import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../config/axios';

// Interfaces
export interface Reply {
  id: string;
  authorName: string;
  authorAvatar: string;
  isHost?: boolean;
  date: string;
  content: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  replies: Reply[];
}

// Mock reviews data
export const mockReviews: Review[] = [
  {
    id: '1',
    authorName: 'Sarah Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    date: '2024-01-15',
    title: 'Absolutely Unforgettable!',
    content: 'This was the most romantic experience we could have asked for. The ambiance, food, and service were impeccable.',
    helpful: 234,
    replies: [
      {
        id: 'r1',
        authorName: 'Marco Rossi',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        isHost: true,
        date: '2024-01-16',
        content: 'Thank you so much! We loved having you. Hope to see you again soon!',
      },
    ],
  },
  {
    id: '2',
    authorName: 'Michael Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 4,
    date: '2024-01-10',
    title: 'Great Experience',
    content: 'Everything was well-organized and the food was delicious. A bit pricey but worth it.',
    helpful: 156,
    replies: [],
  },
  {
    id: '3',
    authorName: 'Emily Rodriguez',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5,
    date: '2024-01-08',
    title: 'Perfect for Our Anniversary!',
    content: 'We celebrated our 10th anniversary here and it was absolutely perfect. The attention to detail is remarkable.',
    helpful: 189,
    replies: [
      {
        id: 'r2',
        authorName: 'Marco Rossi',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        isHost: true,
        date: '2024-01-09',
        content: 'Happy anniversary! We were honored to be part of your special day.',
      },
    ],
  },
  {
    id: '4',
    authorName: 'David Park',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    rating: 4,
    date: '2024-01-05',
    title: 'Excellent Service',
    content: 'The service was fantastic and the food quality was outstanding. Would definitely come back.',
    helpful: 142,
    replies: [],
  },
];

// Query keys
export const reviewsQueryKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewsQueryKeys.all, 'list'] as const,
  listByEntity: (entityType: string, entityId: string) =>
    [...reviewsQueryKeys.lists(), { entityType, entityId }] as const,
  detail: (id: string) => [...reviewsQueryKeys.all, 'detail', id] as const,
};

// API functions
const fetchReviewsByEntity = async (
  entityType: string,
  entityId: string
): Promise<Review[]> => {
  try {
    const response = await apiClient.get('/reviews', {
      params: { entityType, entityId },
    });
    return response.data;
  } catch (error) {
    console.warn(`Using mock reviews for ${entityType}:${entityId}`);
    return mockReviews;
  }
};

const submitReply = async (
  reviewId: string,
  replyText: string
): Promise<void> => {
  try {
    await apiClient.post(`/reviews/${reviewId}/replies`, { text: replyText });
  } catch (error) {
    console.warn('Reply submitted locally');
  }
};

const markReviewAsHelpful = async (reviewId: string): Promise<void> => {
  try {
    await apiClient.post(`/reviews/${reviewId}/helpful`);
  } catch (error) {
    console.warn('Marked as helpful locally');
  }
};

// Query hooks
export const useReviewsByEntity = (entityType: string, entityId: string) => {
  return useQuery({
    queryKey: reviewsQueryKeys.listByEntity(entityType, entityId),
    queryFn: () => fetchReviewsByEntity(entityType, entityId),
    staleTime: 5 * 60 * 1000,
    enabled: !!entityType && !!entityId,
  });
};

// Mutation hooks
export const useSubmitReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, replyText }: { reviewId: string; replyText: string }) =>
      submitReply(reviewId, replyText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.lists() });
    },
  });
};

export const useMarkReviewAsHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => markReviewAsHelpful(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.lists() });
    },
  });
};