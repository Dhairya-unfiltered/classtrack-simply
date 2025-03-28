import { useState, useEffect } from 'react';
import { Calendar, BookOpen, CheckSquare, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lecture, Subject, subjects, lectures, attendanceRecords } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface StudentDashboardProps {
  studentId: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ studentId }) => {
  const [studentSubjects, setStudentSubjects] = useState<Subject[]>([]);
  const [upcomingLectures, setUpcomingLectures] = useState<Lecture[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const studentSubjects = subjects.filter(subject => 
      subject.studentIds.includes(studentId)
    );
    setStudentSubjects(studentSubjects);

    const subjectIds = studentSubjects.map(subject => subject.id);
    const studentLectures = lectures.filter(lecture => 
      subjectIds.includes(lecture.subjectId)
    );
    
    const sortedLectures = [...studentLectures].sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.startTime);
      const dateB = new Date(b.date + 'T' + b.startTime);
      return dateA.getTime() - dateB.getTime();
    });

    const currentDate = new Date();
    
    const upcoming = sortedLectures.filter(lecture => {
      const lectureDate = new Date(lecture.date + 'T' + lecture.startTime);
      return lectureDate >= currentDate;
    }).slice(0, 5);
    
    setUpcomingLectures(upcoming);
  }, [studentId]);

  const calculateSubjectAttendance = (subjectId: string) => {
    const subjectLectures = lectures.filter(lecture => lecture.subjectId === subjectId);
    const lectureIds = subjectLectures.map(lecture => lecture.id);
    
    const studentAttendance = attendanceRecords.filter(record => 
      record.studentId === studentId && lectureIds.includes(record.lectureId)
    );
    
    if (studentAttendance.length === 0) return 0;
    
    const presentCount = studentAttendance.filter(record => record.status === 'present').length;
    return Math.round((presentCount / studentAttendance.length) * 100);
  };

  const calculateOverallAttendance = () => {
    const studentAttendance = attendanceRecords.filter(record => record.studentId === studentId);
    
    if (studentAttendance.length === 0) return 0;
    
    const presentCount = studentAttendance.filter(record => record.status === 'present').length;
    return Math.round((presentCount / studentAttendance.length) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(subject => subject.id === subjectId);
    return subject ? `${subject.code}: ${subject.name}` : 'Unknown Subject';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome! Here's an overview of your courses and attendance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enrolled Subjects
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentSubjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Courses you are enrolled in
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Lectures
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingLectures.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled in the next days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Attendance
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateOverallAttendance()}%</div>
            <Progress 
              value={calculateOverallAttendance()} 
              className="h-2 mt-2"
              indicatorClassName={
                calculateOverallAttendance() > 75 
                  ? 'bg-green-500' 
                  : calculateOverallAttendance() > 50 
                    ? 'bg-amber-500' 
                    : 'bg-red-500'
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Status
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${
              calculateOverallAttendance() > 75 
                ? 'text-green-600' 
                : calculateOverallAttendance() > 50 
                  ? 'text-amber-600' 
                  : 'text-red-600'
            }`}>
              {calculateOverallAttendance() > 75 
                ? 'Good Standing' 
                : calculateOverallAttendance() > 50 
                  ? 'Average' 
                  : 'Poor - Attention Required'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Lectures</TabsTrigger>
          <TabsTrigger value="subjects">My Subjects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingLectures.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingLectures.map((lecture) => (
                <Card key={lecture.id} className="overflow-hidden">
                  <CardHeader className="bg-brand-50 pb-2">
                    <CardTitle className="text-lg">
                      {lecture.title}
                    </CardTitle>
                    <CardDescription>
                      {getSubjectName(lecture.subjectId)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{formatDate(lecture.date)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{lecture.startTime} - {lecture.endTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Room:</span>
                        <span className="font-medium">{lecture.room}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No upcoming lectures scheduled.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="subjects" className="space-y-4">
          {studentSubjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {studentSubjects.map((subject) => {
                const attendancePercentage = calculateSubjectAttendance(subject.id);
                
                return (
                  <Card key={subject.id}>
                    <CardHeader>
                      <CardTitle>{subject.name}</CardTitle>
                      <CardDescription>{subject.code}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-muted-foreground">Attendance:</span>
                            <span className={`text-sm font-medium ${
                              attendancePercentage > 75 
                                ? 'text-green-600' 
                                : attendancePercentage > 50 
                                  ? 'text-amber-600' 
                                  : 'text-red-600'
                            }`}>
                              {attendancePercentage}%
                            </span>
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
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto flex items-center"
                        onClick={() => navigate(`/my-attendance/${subject.id}`)}
                      >
                        View Details
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">You are not enrolled in any subjects.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
