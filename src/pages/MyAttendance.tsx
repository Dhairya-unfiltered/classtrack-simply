import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
  attendanceRecords,
  Lecture,
  AttendanceRecord
} from '@/data/mockData';

const MyAttendance = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState(null);
  const [subjectLectures, setSubjectLectures] = useState<Lecture[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/dashboard');
      return;
    }

    if (!subjectId) {
      navigate('/dashboard');
      return;
    }

    const foundSubject = subjects.find(s => s.id === subjectId);
    if (!foundSubject) {
      navigate('/dashboard');
      return;
    }
    setSubject(foundSubject);

    const foundLectures = lectures.filter(l => l.subjectId === subjectId);
    setSubjectLectures(foundLectures);

    const lectureIds = foundLectures.map(lecture => lecture.id);
    const studentAttendance = attendanceRecords.filter(
      record => record.studentId === user.id && lectureIds.includes(record.lectureId)
    );
    setAttendance(studentAttendance);
  }, [subjectId, user, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getAttendanceForLecture = (lectureId: string) => {
    return attendance.find(record => record.lectureId === lectureId);
  };

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(record => record.status === 'present').length;
    return Math.round((presentCount / attendance.length) * 100);
  };

  const attendancePercentage = calculateAttendancePercentage();

  if (!subject) {
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
          <h1 className="text-2xl font-bold tracking-tight">My Attendance</h1>
          <p className="text-muted-foreground">{subject.code}: {subject.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>
                Your attendance rate for this subject
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2 relative">
                    <span className={`${
                      attendancePercentage > 75 
                        ? 'text-green-600' 
                        : attendancePercentage > 50 
                          ? 'text-amber-600' 
                          : 'text-red-600'
                    }`}>
                      {attendancePercentage}%
                    </span>
                  </div>
                  <p className="text-muted-foreground">Overall Attendance</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Overall Attendance</span>
                  <span className="font-medium">{attendancePercentage}%</span>
                </div>
                <Progress 
                  value={attendancePercentage} 
                  className="h-2"
                  indicatorClassName={
                    attendancePercentage > 75 
                      ? 'bg-green-500' 
                      : attendancePercentage > 50 
                        ? 'bg-amber-500' 
                        : 'bg-red-500'
                  }
                />
              </div>
              
              <div className="pt-4 text-sm text-center">
                <p className={`font-medium ${
                  attendancePercentage > 75 
                    ? 'text-green-600' 
                    : attendancePercentage > 50 
                      ? 'text-amber-600' 
                      : 'text-red-600'
                }`}>
                  {attendancePercentage > 75 
                    ? 'Excellent! Keep up the good attendance.' 
                    : attendancePercentage > 50 
                      ? 'Average attendance. Try to attend more classes.' 
                      : 'Poor attendance. You need to improve your attendance.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>
                Detailed breakdown of your attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {attendance.filter(record => record.status === 'present').length}
                  </p>
                  <p className="text-sm text-green-800">Classes Attended</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {attendance.filter(record => record.status === 'absent').length}
                  </p>
                  <p className="text-sm text-red-800">Classes Missed</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {subjectLectures.length}
                  </p>
                  <p className="text-sm text-blue-800">Total Classes</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {subjectLectures.length - attendance.length}
                  </p>
                  <p className="text-sm text-purple-800">Upcoming Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lecture Attendance History</CardTitle>
            <CardDescription>
              Your attendance record for each lecture in this subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Lecture</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectLectures.sort((a, b) => 
                  new Date(b.date).getTime() - new Date(a.date).getTime()
                ).map(lecture => {
                  const record = getAttendanceForLecture(lecture.id);
                  const status = record ? record.status : "Upcoming";
                  
                  return (
                    <TableRow key={lecture.id}>
                      <TableCell>{formatDate(lecture.date)}</TableCell>
                      <TableCell className="font-medium">{lecture.title}</TableCell>
                      <TableCell>{lecture.startTime} - {lecture.endTime}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status === 'present' 
                            ? 'bg-green-100 text-green-800' 
                            : status === 'absent' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {status === 'present' 
                            ? 'Present' 
                            : status === 'absent' 
                              ? 'Absent' 
                              : 'Upcoming'}
                        </span>
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

export default MyAttendance;
