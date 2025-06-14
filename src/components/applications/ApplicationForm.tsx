import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Database } from '@/integrations/supabase/types';

type JobApplication = Database['public']['Tables']['job_applications']['Row'];
type JobApplicationInsert = Database['public']['Tables']['job_applications']['Insert'];

interface ApplicationFormProps {
  application?: JobApplication | null;
  onSubmit: (data: Omit<JobApplicationInsert, 'user_id'>) => Promise<any>;
  onCancel: () => void;
}

type FormData = {
  company_name: string;
  job_title: string;
  job_type: 'internship' | 'full-time';
  status: 'applied' | 'interview' | 'rejected' | 'offer';
  application_date: string;
  rejection_reason: string;
  notes: string;
  resume_used: string;
};

export const ApplicationForm = ({ application, onSubmit, onCancel }: ApplicationFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    company_name: '',
    job_title: '',
    job_type: 'internship',
    status: 'applied',
    application_date: new Date().toISOString().split('T')[0],
    rejection_reason: '',
    notes: '',
    resume_used: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application) {
      setFormData({
        company_name: application.company_name || '',
        job_title: application.job_title || '',
        job_type: (application.job_type as 'internship' | 'full-time') || 'internship',
        status: (application.status as 'applied' | 'interview' | 'rejected' | 'offer') || 'applied',
        application_date: application.application_date || new Date().toISOString().split('T')[0],
        rejection_reason: application.rejection_reason || '',
        notes: application.notes || '',
        resume_used: application.resume_used || ''
      });
    }
  }, [application]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      onCancel();
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name *</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => handleChange('company_name', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="job_title">Job Title *</Label>
          <Input
            id="job_title"
            value={formData.job_title}
            onChange={(e) => handleChange('job_title', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="job_type">Job Type</Label>
          <Select value={formData.job_type} onValueChange={(value: 'internship' | 'full-time') => handleChange('job_type', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: 'applied' | 'interview' | 'rejected' | 'offer') => handleChange('status', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="application_date">Application Date</Label>
          <Input
            id="application_date"
            type="date"
            value={formData.application_date}
            onChange={(e) => handleChange('application_date', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume_used">Resume Used</Label>
          <Input
            id="resume_used"
            value={formData.resume_used}
            onChange={(e) => handleChange('resume_used', e.target.value)}
            placeholder="e.g., Resume_v2.pdf"
          />
        </div>
      </div>

      {formData.status === 'rejected' && (
        <div className="space-y-2">
          <Label htmlFor="rejection_reason">Rejection Reason</Label>
          <Input
            id="rejection_reason"
            value={formData.rejection_reason}
            onChange={(e) => handleChange('rejection_reason', e.target.value)}
            placeholder="e.g., Not enough experience"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Any additional notes about this application..."
          rows={3}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Saving...' : application ? 'Update Application' : 'Add Application'}
        </Button>
      </div>
    </form>
  );
};