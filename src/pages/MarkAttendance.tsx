
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Clock, Calendar, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  lectures, 
  subjects, 
  users, 
  attendanceRecords, 
  addOrUpdateAttendanceRecord,
  AttendanceRecord, 
  User 
} from '@/data/mockData';

const MarkAttendance = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [lecture, setLecture] = useState(null);
  const [subject, setSubject] = useState(null);
  const [students, setStudents] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!lectureId) {
      navigate('/dashboard');
      return;
    }

    // Find the lecture
    const foundLecture = lectures.find(l => l.id === lectureId);
    if (!foundLecture) {
      navigate('/dashboard');
      return;
    }
    setLecture(foundLecture);

    // Find the subject
    const foundSubject = subjects.find(s => s.id === foundLecture.subjectId);
    if (!foundSubject) {
      navigate('/dashboard');
      return;
    }
    setSubject(foundSubject);

    // Get students enrolled in this subject
    const enrolledStudents = users.filter(
      u => u.role === 'student' && foundSubject.studentIds.includes(u.id)
    );
    setStudents(enrolledStudents);

    // Check if attendance has already been marked
    const existingAttendance = attendanceRecords.filter(
      record => record.lectureId === lectureId
    );

    if (existingAttendance.length > 0) {
      // Pre-populate attendance from records
      const attendanceMap = {};
      existingAttendance.forEach(record => {
        attendanceMap[record.studentId] = record.status === 'present';
      });
      setAttendance(attendanceMap);
    } else {
      // Initialize all students as present by default
      const initialAttendance = {};
      enrolledStudents.forEach(student => {
        initialAttendance[student.id] = true;
      });
      setAttendance(initialAttendance);
    }
  }, [lectureId, isAuthenticated, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleToggleAttendance = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleMarkAll = (status: boolean) => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    
    // Save attendance records for each student
    students.forEach(student => {
      const isPresent = attendance[student.id];
      addOrUpdateAttendanceRecord({
        lectureId: lectureId,
        studentId: student.id,
        status: isPresent ? 'present' : 'absent',
        markedBy: user.id
      });
    });
    
    // Show success message
    toast({
      title: "Attendance Marked",
      description: "The attendance has been successfully recorded.",
    });
    
    setIsLoading(false);
    
    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  if (!lecture || !subject) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">{lecture.title}</h1>
          <p className="text-muted-foreground">{subject.code}: {subject.name}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lecture Details</CardTitle>
            <CardDescription>
              Information about the lecture session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(lecture.date)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{lecture.startTime} - {lecture.endTime}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{lecture.room}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>
              Select students who are present in the lecture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end space-x-2 mb-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleMarkAll(true)}
              >
                Mark All Present
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleMarkAll(false)}
              >
                Mark All Absent
              </Button>
            </div>
            
            <div className="space-y-4">
              {students.map(student => (
                <div key={student.id} className="flex items-center p-3 border rounded-md">
                  <Checkbox 
                    id={`student-${student.id}`}
                    checked={attendance[student.id] || false}
                    onCheckedChange={() => handleToggleAttendance(student.id)}
                    className="mr-4"
                  />
                  <label 
                    htmlFor={`student-${student.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    {student.name}
                  </label>
                  <span className={`text-sm ${attendance[student.id] ? 'text-green-600' : 'text-red-600'}`}>
                    {attendance[student.id] ? 'Present' : 'Absent'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-brand-500 hover:bg-brand-600"
            >
              {isLoading ? 'Saving...' : 'Save Attendance'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MarkAttendance;
