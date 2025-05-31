import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/integrations/supabase/types';
import { Edit, Trash2, Building, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

type JobApplication = Database['public']['Tables']['job_applications']['Row'];

interface ApplicationsListProps {
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'applied':
      return 'bg-blue-100 text-blue-800';
    case 'interview':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'offer':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getJobTypeColor = (jobType: string) => {
  switch (jobType) {
    case 'internship':
      return 'bg-orange-100 text-orange-800';
    case 'full-time':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ApplicationsList = ({ applications, onEdit, onDelete }: ApplicationsListProps) => {
  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-500">
            Start tracking your job applications by clicking the "Add Application" button above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Applications</h2>
        <p className="text-sm sm:text-base text-gray-600">{applications.length} total applications</p>
      </div>
      
      <div className="grid gap-4">
        {applications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 space-y-1.5">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Building className="h-5 w-5 text-gray-600 shrink-0" />
                    <span className="truncate">{application.company_name}</span>
                  </CardTitle>
                  <p className="text-sm sm:text-base font-medium text-gray-700 truncate">
                    {application.job_title}
                  </p>
                </div>
                <div className="flex gap-2 self-start">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(application)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(application.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
                <Badge className={getStatusColor(application.status)}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
                <Badge className={getJobTypeColor(application.job_type)}>
                  {application.job_type === 'full-time' ? 'Full-time' : 'Internship'}
                </Badge>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <Calendar className="h-4 w-4 shrink-0" />
                  {format(new Date(application.application_date), 'MMM dd, yyyy')}
                </div>
              </div>
              
              {application.rejection_reason && (
                <div className="mb-3">
                  <p className="text-xs sm:text-sm font-medium text-red-600 mb-1">Rejection Reason:</p>
                  <p className="text-xs sm:text-sm text-gray-700">{application.rejection_reason}</p>
                </div>
              )}
              
              {application.notes && (
                <div className="mb-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Notes:</p>
                  <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">{application.notes}</p>
                </div>
              )}
              
              {application.resume_used && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Resume Used:</p>
                  <p className="text-xs sm:text-sm text-gray-700 truncate">{application.resume_used}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
