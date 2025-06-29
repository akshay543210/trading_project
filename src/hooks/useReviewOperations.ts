import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/supabase';

export const useReviewOperations = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReviews(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  // Add a new review (require all necessary fields)
  const addReview = async (review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful_count' | 'is_verified' | 'prop_firms'> & { helpful_count?: number; is_verified?: boolean; title?: string }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          firm_id: review.firm_id,
          user_id: review.user_id,
          reviewer_name: review.reviewer_name,
          rating: review.rating,
          title: review.title || null,
          content: review.content,
          is_verified: review.is_verified ?? false,
          helpful_count: review.helpful_count ?? 0
        })
        .select()
        .single();
      if (error) throw error;
      setReviews(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add review');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update a review
  const updateReview = async (id: string, updates: Partial<Review>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setReviews(prev => prev.map(r => (r.id === id ? data : r)));
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Delete a review
  const deleteReview = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setReviews(prev => prev.filter(r => r.id !== id));
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    addReview,
    updateReview,
    deleteReview
  };
}; 