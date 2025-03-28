
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle2, School2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('faculty');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      // Redirect based on role
      navigate('/dashboard');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Set demo credentials
    if (value === 'faculty') {
      setEmail('faculty@example.com');
    } else {
      setEmail('student@example.com');
    }
    
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-800">ClassTrack</h1>
          <p className="text-gray-600">Attendance Management System</p>
        </div>
        
        <Tabs defaultValue="faculty" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="faculty" className="flex items-center gap-2">
              <UserCircle2 className="h-4 w-4" />
              <span>Faculty</span>
            </TabsTrigger>
            <TabsTrigger value="student" className="flex items-center gap-2">
              <School2 className="h-4 w-4" />
              <span>Student</span>
            </TabsTrigger>
          </TabsList>
          
          <Card className="border-t-4 border-t-brand-500 shadow-md">
            <TabsContent value="faculty">
              <CardHeader>
                <CardTitle>Faculty Login</CardTitle>
                <CardDescription>
                  Login to manage your classes and attendance records.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="faculty@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600">
                    Login
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="student">
              <CardHeader>
                <CardTitle>Student Login</CardTitle>
                <CardDescription>
                  Login to view your attendance and scheduled lectures.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentEmail">Email</Label>
                    <Input 
                      id="studentEmail" 
                      type="email" 
                      placeholder="student@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentPassword">Password</Label>
                    <Input 
                      id="studentPassword" 
                      type="password" 
                      placeholder="Enter your password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600">
                    Login
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Card>
        </Tabs>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo Credentials:</p>
          <p>Faculty: faculty@example.com | Student: student@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
