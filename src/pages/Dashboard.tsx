
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import FacultyDashboard from '@/components/dashboard/FacultyDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      {user.role === 'faculty' ? (
        <FacultyDashboard facultyId={user.id} />
      ) : (
        <StudentDashboard studentId={user.id} />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
