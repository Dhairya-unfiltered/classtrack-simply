
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  LogOut,
  Menu,
  User,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = user?.role === 'faculty' 
    ? [
        { name: 'Dashboard', icon: <BookOpen className="h-5 w-5" />, path: '/dashboard' },
        { name: 'Schedule Lecture', icon: <Calendar className="h-5 w-5" />, path: '/schedule-lecture' },
        { name: 'Mark Attendance', icon: <CheckSquare className="h-5 w-5" />, path: '/mark-attendance' },
        { name: 'Attendance Records', icon: <CheckSquare className="h-5 w-5" />, path: '/attendance-records' },
      ]
    : [
        { name: 'Dashboard', icon: <BookOpen className="h-5 w-5" />, path: '/dashboard' },
        { name: 'My Lectures', icon: <Calendar className="h-5 w-5" />, path: '/my-lectures' },
        { name: 'My Attendance', icon: <CheckSquare className="h-5 w-5" />, path: '/my-attendance' },
      ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Mobile Header */}
      {isMobile && (
        <header className="bg-white border-b p-4 flex items-center justify-between md:hidden">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="mr-2">
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <h1 className="font-bold text-xl text-brand-700">ClassTrack</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm">{user?.name}</span>
            <User className="h-5 w-5 text-gray-500" />
          </div>
        </header>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r w-full md:w-64 md:flex md:flex-col md:min-h-screen p-4",
          isMobile ? "fixed inset-0 z-50 transform transition-transform duration-200 ease-in-out" : "relative",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Logo and Title */}
        <div className="hidden md:flex items-center mb-8">
          <h1 className="font-bold text-xl text-brand-700">ClassTrack</h1>
        </div>

        {/* Close button for mobile */}
        {isMobile && sidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="absolute top-4 right-4 md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        )}

        {/* User Info */}
        <div className="mb-8 p-4 border rounded-lg bg-brand-50">
          <div className="font-medium">{user?.name}</div>
          <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
        </div>

        {/* Menu Links */}
        <nav className="space-y-2 mb-auto">
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate(item.path);
                if (isMobile) setSidebarOpen(false);
              }}
            >
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Button>
          ))}
        </nav>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="mt-6 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 p-4 md:p-8", 
        isMobile && sidebarOpen ? "hidden" : "block"
      )}>
        {children}
      </main>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
