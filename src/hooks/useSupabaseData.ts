import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropFirm, Review } from '@/types/supabase';
import { propFirmsData } from '@/data/propFirms';

export const usePropFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPropFirms = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prop_firms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Supabase error, using local data:', error);
        // Use local data as fallback
        setPropFirms(propFirmsData);
        setError(null);
        return;
      }

      // If Supabase returns empty data, use local data
      if (!data || data.length === 0) {
        console.log('Supabase returned empty data, using local data');
        setPropFirms(propFirmsData);
      } else {
        console.log('Using Supabase data:', data.length, 'firms');
        setPropFirms(data);
      }
      
      setError(null);
    } catch (err) {
      console.log('Error fetching from Supabase, using local data:', err);
      // Use local data as fallback on any error
      setPropFirms(propFirmsData);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPropFirms();
  }, [fetchPropFirms]);

  return { propFirms, loading, error, refetch: fetchPropFirms };
};

export const useCheapestFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheapestFirms = async () => {
      try {
        const { data, error } = await supabase
          .from('prop_firms')
          .select('*')
          .order('starting_fee', { ascending: true })
          .limit(10);

        if (error) {
          console.log('Supabase error in cheapest firms, using local data:', error);
          // Use local data sorted by price
          const sortedLocalData = [...propFirmsData].sort((a, b) => a.price - b.price).slice(0, 10);
          setPropFirms(sortedLocalData);
          setError(null);
          return;
        }

        if (!data || data.length === 0) {
          console.log('Supabase returned empty data for cheapest firms, using local data');
          const sortedLocalData = [...propFirmsData].sort((a, b) => a.price - b.price).slice(0, 10);
          setPropFirms(sortedLocalData);
        } else {
          setPropFirms(data);
        }
      } catch (err) {
        console.log('Error fetching cheapest firms from Supabase, using local data:', err);
        const sortedLocalData = [...propFirmsData].sort((a, b) => a.price - b.price).slice(0, 10);
        setPropFirms(sortedLocalData);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCheapestFirms();
  }, []);

  return { propFirms, loading, error };
};

export const useTopRatedFirms = () => {
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopRatedFirms = async () => {
      try {
        const { data, error } = await supabase
          .from('prop_firms')
          .select('*')
          .order('review_score', { ascending: false })
          .limit(5);

        if (error) {
          console.log('Supabase error in top rated firms, using local data:', error);
          // Use local data sorted by review score
          const sortedLocalData = [...propFirmsData].sort((a, b) => b.review_score - a.review_score).slice(0, 5);
          setPropFirms(sortedLocalData);
          setError(null);
          return;
        }

        if (!data || data.length === 0) {
          console.log('Supabase returned empty data for top rated firms, using local data');
          const sortedLocalData = [...propFirmsData].sort((a, b) => b.review_score - a.review_score).slice(0, 5);
          setPropFirms(sortedLocalData);
        } else {
          setPropFirms(data);
        }
      } catch (err) {
        console.log('Error fetching top rated firms from Supabase, using local data:', err);
        const sortedLocalData = [...propFirmsData].sort((a, b) => b.review_score - a.review_score).slice(0, 5);
        setPropFirms(sortedLocalData);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedFirms();
  }, []);

  return { propFirms, loading, error };
};

export const useReviews = (firmId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let query = supabase
          .from('reviews')
          .select(`
            *,
            prop_firms:firm_id (
              id,
              name,
              slug
            )
          `)
          .order('created_at', { ascending: false });

        if (firmId) {
          query = query.eq('firm_id', firmId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setReviews(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [firmId]);

  return { reviews, loading, error };
};

export const getCheapestFirms = async (limit: number = 10): Promise<PropFirm[]> => {
  const { data, error } = await supabase
    .from('prop_firms')
    .select('*')
    .order('starting_fee', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getTopRatedFirms = async (limit: number = 5): Promise<PropFirm[]> => {
  const { data, error } = await supabase
    .from('prop_firms')
    .select('*')
    .order('review_score', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};
