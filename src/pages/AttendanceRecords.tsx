
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, Calendar, MapPin, Download } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  lectures,
  subjects,
  users,
  attendanceRecords,
  User
} from '@/data/mockData';

const AttendanceRecords = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [lecture, setLecture] = useState(null);
  const [subject, setSubject] = useState(null);
  const [students, setStudents] = useState<User[]>([]);
  const [records, setRecords] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'faculty') {
      navigate('/dashboard');
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

    // Get attendance records for this lecture
    const lectureRecords = attendanceRecords.filter(
      record => record.lectureId === lectureId
    );
    setRecords(lectureRecords);
  }, [lectureId, isAuthenticated, user, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getAttendanceStatus = (studentId: string) => {
    const record = records.find(r => r.studentId === studentId);
    return record ? record.status : 'Not Marked';
  };

  const getAttendanceSummary = () => {
    if (records.length === 0) return { present: 0, absent: 0, percentage: 0 };
    
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const percentage = Math.round((present / records.length) * 100);
    
    return { present, absent, percentage };
  };

  const summary = getAttendanceSummary();

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
          <h1 className="text-2xl font-bold tracking-tight">{lecture.title} - Attendance Records</h1>
          <p className="text-muted-foreground">{subject.code}: {subject.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Lecture Details</CardTitle>
              <CardDescription>
                Information about the lecture session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
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
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>
                Overview of student attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{summary.present}</p>
                  <p className="text-sm text-muted-foreground">Present</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
                  <p className="text-sm text-muted-foreground">Absent</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${
                    summary.percentage > 75 
                      ? 'text-green-600' 
                      : summary.percentage > 50 
                        ? 'text-amber-600' 
                        : 'text-red-600'
                  }`}>
                    {summary.percentage}%
                  </p>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Student Attendance</CardTitle>
              <CardDescription>
                Detailed attendance records for each student
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Time Marked</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => {
                  const record = records.find(r => r.studentId === student.id);
                  const status = getAttendanceStatus(student.id);
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status === 'present' 
                            ? 'bg-green-100 text-green-800' 
                            : status === 'absent' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {status === 'present' ? 'Present' : status === 'absent' ? 'Absent' : 'Not Marked'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {record 
                          ? new Date(record.markedAt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            }) 
                          : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceRecords;
