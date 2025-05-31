import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  onAddApplication: () => void;
}

export const DashboardHeader = ({ onAddApplication }: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 py-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Job Application Tracker</h1>
            <p className="text-gray-600">Welcome back, {user?.user_metadata?.first_name || 'there'}!</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button onClick={onAddApplication} className="flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              Add Application
            </Button>
            <Button variant="outline" onClick={signOut} className="flex items-center justify-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
