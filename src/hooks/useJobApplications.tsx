
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

type JobApplication = Database['public']['Tables']['job_applications']['Row'];
type JobApplicationInsert = Database['public']['Tables']['job_applications']['Insert'];
type JobApplicationUpdate = Database['public']['Tables']['job_applications']['Update'];

export const useJobApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchApplications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      toast.error('Failed to fetch job applications');
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (application: Omit<JobApplicationInsert, 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([{ ...application, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setApplications(prev => [data, ...prev]);
      toast.success('Job application added successfully');
      return data;
    } catch (error) {
      toast.error('Failed to add job application');
      console.error('Error creating application:', error);
      throw error;
    }
  };

  const updateApplication = async (id: string, updates: JobApplicationUpdate) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setApplications(prev => prev.map(app => app.id === id ? data : app));
      toast.success('Job application updated successfully');
      return data;
    } catch (error) {
      toast.error('Failed to update job application');
      console.error('Error updating application:', error);
      throw error;
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setApplications(prev => prev.filter(app => app.id !== id));
      toast.success('Job application deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job application');
      console.error('Error deleting application:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  return {
    applications,
    loading,
    createApplication,
    updateApplication,
    deleteApplication,
    refetch: fetchApplications
  };
};
