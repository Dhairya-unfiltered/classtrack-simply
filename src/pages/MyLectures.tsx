
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, ArrowUpRight } from 'lucide-react';
import { 
  lectures, 
  subjects,
  Lecture,
  Subject
} from '@/data/mockData';

const MyLectures = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [studentSubjects, setStudentSubjects] = useState<Subject[]>([]);
  const [upcomingLectures, setUpcomingLectures] = useState<Lecture[]>([]);
  const [pastLectures, setPastLectures] = useState<Lecture[]>([]);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'student') {
      navigate('/dashboard');
      return;
    }

    // Get subjects for this student
    const enrolledSubjects = subjects.filter(subject => 
      subject.studentIds.includes(user.id)
    );
    setStudentSubjects(enrolledSubjects);

    // Get lectures for these subjects
    const subjectIds = enrolledSubjects.map(subject => subject.id);
    const studentLectures = lectures.filter(lecture => 
      subjectIds.includes(lecture.subjectId)
    );
    
    // Sort lectures by date
    const sortedLectures = [...studentLectures].sort((a, b) => 
      new Date(a.date + 'T' + a.startTime).getTime() - 
      new Date(b.date + 'T' + b.startTime).getTime()
    );

    // Current date for comparison
    const currentDate = new Date();
    
    // Filter upcoming and past lectures
    const upcoming = sortedLectures.filter(lecture => 
      new Date(lecture.date + 'T' + lecture.startTime) >= currentDate
    );
    
    const past = sortedLectures.filter(lecture => 
      new Date(lecture.date + 'T' + lecture.startTime) < currentDate
    ).reverse(); // Most recent first
    
    setUpcomingLectures(upcoming);
    setPastLectures(past);
  }, [isAuthenticated, user, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? `${subject.code}: ${subject.name}` : 'Unknown Subject';
  };

  const filterLecturesBySubject = (lectures: Lecture[], filterValue: string) => {
    if (filterValue === 'all') return lectures;
    return lectures.filter(lecture => lecture.subjectId === filterValue);
  };

  const handleFilterChange = (value: string) => {
    setCurrentFilter(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Lectures</h1>
          <p className="text-muted-foreground">
            View all your scheduled lectures
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={currentFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('all')}
            className={currentFilter === 'all' ? 'bg-brand-500 hover:bg-brand-600' : ''}
          >
            All Subjects
          </Button>
          {studentSubjects.map(subject => (
            <Button
              key={subject.id}
              variant={currentFilter === subject.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange(subject.id)}
              className={currentFilter === subject.id ? 'bg-brand-500 hover:bg-brand-600' : ''}
            >
              {subject.code}
            </Button>
          ))}
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Lectures</TabsTrigger>
            <TabsTrigger value="past">Past Lectures</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {filterLecturesBySubject(upcomingLectures, currentFilter).length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filterLecturesBySubject(upcomingLectures, currentFilter).map((lecture) => (
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
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{formatDate(lecture.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{lecture.startTime} - {lecture.endTime}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{lecture.room}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto flex items-center"
                        onClick={() => navigate(`/my-attendance/${lecture.subjectId}`)}
                      >
                        View Attendance
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No upcoming lectures found.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {filterLecturesBySubject(pastLectures, currentFilter).length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filterLecturesBySubject(pastLectures, currentFilter).map((lecture) => (
                  <Card key={lecture.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 pb-2">
                      <CardTitle className="text-lg">
                        {lecture.title}
                      </CardTitle>
                      <CardDescription>
                        {getSubjectName(lecture.subjectId)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{formatDate(lecture.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{lecture.startTime} - {lecture.endTime}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{lecture.room}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto flex items-center"
                        onClick={() => navigate(`/my-attendance/${lecture.subjectId}`)}
                      >
                        View Attendance
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No past lectures found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MyLectures;
