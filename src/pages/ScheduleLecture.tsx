
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { subjects } from '@/data/mockData';

const ScheduleLecture = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [facultySubjects, setFacultySubjects] = useState([]);
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');

  // Get subject ID from query parameters if available
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const subjectParam = searchParams.get('subject');
    
    if (subjectParam) {
      setSubjectId(subjectParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'faculty') {
      navigate('/dashboard');
      return;
    }

    // Get subjects taught by this faculty
    const facultySubjects = subjects.filter(subject => subject.facultyId === user.id);
    setFacultySubjects(facultySubjects);

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);

    // Set default times
    setStartTime('09:00');
    setEndTime('10:30');
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !subjectId || !date || !startTime || !endTime || !room) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate times
    if (startTime >= endTime) {
      toast({
        title: "Invalid Times",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would create a new lecture in the database
    toast({
      title: "Lecture Scheduled",
      description: "The lecture has been successfully scheduled.",
    });
    
    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Schedule a Lecture</h1>
          <p className="text-muted-foreground">Create a new lecture for students to attend</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Lecture Details</CardTitle>
              <CardDescription>
                Enter the details for the new lecture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Lecture Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter lecture title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={subjectId} 
                  onValueChange={setSubjectId}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultySubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.code}: {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Room Number</Label>
                  <Input 
                    id="room" 
                    placeholder="Enter room number" 
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime" 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input 
                    id="endTime" 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit"
                className="bg-brand-500 hover:bg-brand-600"
              >
                Schedule Lecture
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleLecture;
