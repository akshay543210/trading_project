import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Section {
  id: string;
  name: string;
  type: string;
  created_at?: string;
}

export interface SectionFirm {
  id: string;
  section_id: string;
  prop_firm_id: string;
  order?: number;
  created_at?: string;
}

export const useSectionOperations = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionFirms, setSectionFirms] = useState<SectionFirm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all sections
  const fetchSections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      setSections(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all section_firms
  const fetchSectionFirms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('section_firms')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      setSectionFirms(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch section_firms');
    } finally {
      setLoading(false);
    }
  };

  // Add a new section
  const addSection = async (section: Partial<Section>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sections')
        .insert(section)
        .select()
        .single();
      if (error) throw error;
      setSections(prev => [...prev, data]);
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add section');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update a section
  const updateSection = async (id: string, updates: Partial<Section>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setSections(prev => prev.map(s => (s.id === id ? data : s)));
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update section');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Delete a section
  const deleteSection = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setSections(prev => prev.filter(s => s.id !== id));
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete section');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Add a prop firm to a section
  const addPropFirmToSection = async (section_id: string, prop_firm_id: string, order = 0) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('section_firms')
        .insert({ section_id, prop_firm_id, order })
        .select()
        .single();
      if (error) throw error;
      setSectionFirms(prev => [...prev, data]);
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add prop firm to section');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Remove a prop firm from a section
  const removePropFirmFromSection = async (section_firm_id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('section_firms')
        .delete()
        .eq('id', section_firm_id);
      if (error) throw error;
      setSectionFirms(prev => prev.filter(sf => sf.id !== section_firm_id));
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove prop firm from section');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchSectionFirms();
  }, []);

  return {
    sections,
    sectionFirms,
    loading,
    error,
    fetchSections,
    fetchSectionFirms,
    addSection,
    updateSection,
    deleteSection,
    addPropFirmToSection,
    removePropFirmFromSection
  };
}; 