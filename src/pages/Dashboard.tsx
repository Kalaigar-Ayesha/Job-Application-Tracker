
import { useState } from 'react';
import { useJobApplications } from '@/hooks/useJobApplications';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ApplicationForm } from '@/components/applications/ApplicationForm';
import { ApplicationsList } from '@/components/applications/ApplicationsList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Database } from '@/integrations/supabase/types';

type JobApplication = Database['public']['Tables']['job_applications']['Row'];

export const Dashboard = () => {
  const { applications, loading, createApplication, updateApplication, deleteApplication } = useJobApplications();
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);

  const handleAddApplication = () => {
    setEditingApplication(null);
    setShowForm(true);
  };

  const handleEditApplication = (application: JobApplication) => {
    setEditingApplication(application);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingApplication(null);
  };

  const handleSubmit = async (data: any) => {
    if (editingApplication) {
      await updateApplication(editingApplication.id, data);
    } else {
      await createApplication(data);
    }
    handleCloseForm();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onAddApplication={handleAddApplication} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards applications={applications} />
        
        <ApplicationsList 
          applications={applications}
          onEdit={handleEditApplication}
          onDelete={deleteApplication}
        />
      </main>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingApplication ? 'Edit Application' : 'Add New Application'}
            </DialogTitle>
          </DialogHeader>
          <ApplicationForm
            application={editingApplication}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
