import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../config/axios';
import { NewsletterSubscription } from '../types';

const subscribeToNewsletter = async (data: NewsletterSubscription) => {
  const response = await apiClient.post('/newsletter/subscribe', data);
  return response.data;
};

export const useSubscribeNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscribeToNewsletter,
    onSuccess: () => {
      // Invalidate relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['newsletter'] });
    },
  });
};