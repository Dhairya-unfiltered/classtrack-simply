
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ScheduleLecture from "./pages/ScheduleLecture";
import MarkAttendance from "./pages/MarkAttendance";
import AttendanceRecords from "./pages/AttendanceRecords";
import MyLectures from "./pages/MyLectures";
import MyAttendance from "./pages/MyAttendance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schedule-lecture" element={<ScheduleLecture />} />
            <Route path="/mark-attendance/:lectureId" element={<MarkAttendance />} />
            <Route path="/attendance-records/:lectureId" element={<AttendanceRecords />} />
            <Route path="/my-lectures" element={<MyLectures />} />
            <Route path="/my-attendance/:subjectId" element={<MyAttendance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
