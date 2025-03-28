
import { useState, useEffect } from 'react';
import { Calendar, Users, BookOpen, CheckSquare, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lecture, Subject, subjects, lectures, users, attendanceRecords } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

interface FacultyDashboardProps {
  facultyId: string;
}

const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ facultyId }) => {
  const [facultySubjects, setFacultySubjects] = useState<Subject[]>([]);
  const [upcomingLectures, setUpcomingLectures] = useState<Lecture[]>([]);
  const [recentLectures, setRecentLectures] = useState<Lecture[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get subjects taught by this faculty
    const facultySubjects = subjects.filter(subject => subject.facultyId === facultyId);
    setFacultySubjects(facultySubjects);

    // Get lectures for this faculty
    const facultyLectures = lectures.filter(lecture => lecture.facultyId === facultyId);
    
    // Sort lectures by date
    const sortedLectures = [...facultyLectures].sort((a, b) => 
      new Date(a.date + 'T' + a.startTime).getTime() - 
      new Date(b.date + 'T' + b.startTime).getTime()
    );

    // Current date for comparison
    const currentDate = new Date();
    
    // Filter upcoming and recent lectures
    const upcoming = sortedLectures.filter(lecture => 
      new Date(lecture.date + 'T' + lecture.startTime) >= currentDate
    ).slice(0, 5);
    
    const recent = sortedLectures.filter(lecture => 
      new Date(lecture.date + 'T' + lecture.startTime) < currentDate
    ).slice(0, 5);
    
    setUpcomingLectures(upcoming);
    setRecentLectures(recent);
  }, [facultyId]);

  // Get the total number of students enrolled in faculty's subjects
  const getTotalStudents = () => {
    const uniqueStudentIds = new Set<string>();
    facultySubjects.forEach(subject => {
      subject.studentIds.forEach(id => uniqueStudentIds.add(id));
    });
    return uniqueStudentIds.size;
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Get student name from id
  const getStudentName = (studentId: string) => {
    const student = users.find(user => user.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  // Get attendance percentage for a lecture
  const getAttendancePercentage = (lectureId: string) => {
    const lectureAttendance = attendanceRecords.filter(record => record.lectureId === lectureId);
    if (lectureAttendance.length === 0) return 0;
    
    const presentCount = lectureAttendance.filter(record => record.status === 'present').length;
    return Math.round((presentCount / lectureAttendance.length) * 100);
  };

  // Get subject name from id
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(subject => subject.id === subjectId);
    return subject ? `${subject.code}: ${subject.name}` : 'Unknown Subject';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Faculty Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your teaching activities.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subjects
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facultySubjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Courses you are teaching
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalStudents()}</div>
            <p className="text-xs text-muted-foreground">
              Students enrolled in your courses
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
              Recent Attendance
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentLectures.length > 0 
                ? `${getAttendancePercentage(recentLectures[0].id)}%` 
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Last lecture attendance rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Lectures */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Lectures</TabsTrigger>
          <TabsTrigger value="recent">Recent Lectures</TabsTrigger>
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
                  <CardFooter className="bg-gray-50 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto flex items-center"
                      onClick={() => navigate(`/mark-attendance/${lecture.id}`)}
                    >
                      Mark Attendance
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No upcoming lectures scheduled.</p>
              <Button 
                className="mt-4 bg-brand-500 hover:bg-brand-600"
                onClick={() => navigate('/schedule-lecture')}
              >
                Schedule New Lecture
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          {recentLectures.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentLectures.map((lecture) => {
                const attendancePercentage = getAttendancePercentage(lecture.id);
                
                return (
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
                          <span className="text-muted-foreground">Attendance:</span>
                          <span className={`font-medium ${
                            attendancePercentage > 75 
                              ? 'text-green-600' 
                              : attendancePercentage > 50 
                                ? 'text-amber-600' 
                                : 'text-red-600'
                          }`}>
                            {attendancePercentage}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto flex items-center"
                        onClick={() => navigate(`/attendance-records/${lecture.id}`)}
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
              <p className="text-muted-foreground">No recent lectures found.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="subjects" className="space-y-4">
          {facultySubjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {facultySubjects.map((subject) => {
                const subjectLectures = lectures.filter(
                  lecture => lecture.subjectId === subject.id
                );
                
                return (
                  <Card key={subject.id}>
                    <CardHeader>
                      <CardTitle>{subject.name}</CardTitle>
                      <CardDescription>{subject.code}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Students:</span>
                          <span className="font-medium">{subject.studentIds.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Lectures:</span>
                          <span className="font-medium">{subjectLectures.length}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/schedule-lecture?subject=${subject.id}`)}
                      >
                        Schedule Lecture
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/subject/${subject.id}`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No subjects assigned to you.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyDashboard;
