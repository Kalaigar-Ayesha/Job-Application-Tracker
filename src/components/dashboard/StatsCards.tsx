
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from '@/integrations/supabase/types';
import { Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';

type JobApplication = Database['public']['Tables']['job_applications']['Row'];

interface StatsCardsProps {
  applications: JobApplication[];
}

export const StatsCards = ({ applications }: StatsCardsProps) => {
  const totalApplications = applications.length;
  const appliedCount = applications.filter(app => app.status === 'applied').length;
  const interviewCount = applications.filter(app => app.status === 'interview').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;
  const offerCount = applications.filter(app => app.status === 'offer').length;

  const stats = [
    {
      title: 'Total Applications',
      value: totalApplications,
      icon: Briefcase,
      color: 'text-blue-600'
    },
    {
      title: 'Pending',
      value: appliedCount,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Interviews',
      value: interviewCount,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Rejected',
      value: rejectedCount,
      icon: XCircle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
