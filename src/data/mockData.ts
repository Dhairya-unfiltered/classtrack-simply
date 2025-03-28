
// User Types
export type UserRole = 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string; // In a real app, this would be hashed
}

// Subject/Course
export interface Subject {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  studentIds: string[];
}

// Lecture
export interface Lecture {
  id: string;
  subjectId: string;
  facultyId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
}

// Attendance
export interface AttendanceRecord {
  id: string;
  lectureId: string;
  studentId: string;
  status: 'present' | 'absent';
  markedBy: string; // faculty ID
  markedAt: string; // timestamp
}

// Mock Data
export const users: User[] = [
  {
    id: '1',
    name: 'Professor Smith',
    email: 'faculty@example.com',
    role: 'faculty',
    password: 'password123',
  },
  {
    id: '2',
    name: 'Professor Johnson',
    email: 'johnson@example.com',
    role: 'faculty',
    password: 'password123',
  },
  {
    id: '3',
    name: 'Alice Student',
    email: 'student@example.com',
    role: 'student',
    password: 'password123',
  },
  {
    id: '4',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'student',
    password: 'password123',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'student',
    password: 'password123',
  },
  {
    id: '6',
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'student',
    password: 'password123',
  },
];

export const subjects: Subject[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    facultyId: '1',
    studentIds: ['3', '4', '5', '6'],
  },
  {
    id: '2',
    name: 'Data Structures',
    code: 'CS201',
    facultyId: '1',
    studentIds: ['3', '4', '6'],
  },
  {
    id: '3',
    name: 'Database Management Systems',
    code: 'CS301',
    facultyId: '2',
    studentIds: ['3', '5', '6'],
  },
  {
    id: '4',
    name: 'Software Engineering',
    code: 'CS401',
    facultyId: '2',
    studentIds: ['4', '5', '6'],
  },
];

export const lectures: Lecture[] = [
  {
    id: '1',
    subjectId: '1',
    facultyId: '1',
    title: 'Introduction to Programming',
    date: '2023-06-15',
    startTime: '09:00',
    endTime: '10:30',
    room: 'Room 101',
  },
  {
    id: '2',
    subjectId: '1',
    facultyId: '1',
    title: 'Variables and Data Types',
    date: '2023-06-17',
    startTime: '09:00',
    endTime: '10:30',
    room: 'Room 101',
  },
  {
    id: '3',
    subjectId: '2',
    facultyId: '1',
    title: 'Arrays and Linked Lists',
    date: '2023-06-16',
    startTime: '11:00',
    endTime: '12:30',
    room: 'Room 102',
  },
  {
    id: '4',
    subjectId: '3',
    facultyId: '2',
    title: 'SQL Basics',
    date: '2023-06-16',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 201',
  },
  {
    id: '5',
    subjectId: '4',
    facultyId: '2',
    title: 'Software Development Life Cycle',
    date: '2023-06-18',
    startTime: '10:00',
    endTime: '11:30',
    room: 'Room 202',
  },
];

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    lectureId: '1',
    studentId: '3',
    status: 'present',
    markedBy: '1',
    markedAt: '2023-06-15T09:15:00Z',
  },
  {
    id: '2',
    lectureId: '1',
    studentId: '4',
    status: 'present',
    markedBy: '1',
    markedAt: '2023-06-15T09:15:00Z',
  },
  {
    id: '3',
    lectureId: '1',
    studentId: '5',
    status: 'absent',
    markedBy: '1',
    markedAt: '2023-06-15T09:15:00Z',
  },
  {
    id: '4',
    lectureId: '1',
    studentId: '6',
    status: 'present',
    markedBy: '1',
    markedAt: '2023-06-15T09:15:00Z',
  },
  {
    id: '5',
    lectureId: '2',
    studentId: '3',
    status: 'present',
    markedBy: '1',
    markedAt: '2023-06-17T09:10:00Z',
  },
  {
    id: '6',
    lectureId: '2',
    studentId: '4',
    status: 'absent',
    markedBy: '1',
    markedAt: '2023-06-17T09:10:00Z',
  },
  {
    id: '7',
    lectureId: '2',
    studentId: '5',
    status: 'present',
    markedBy: '1',
    markedAt: '2023-06-17T09:10:00Z',
  },
  {
    id: '8',
    lectureId: '3',
    studentId: '3',
    status: 'present',
    markedBy: '1',
    markedAt: '2023-06-16T11:15:00Z',
  },
  {
    id: '9',
    lectureId: '3',
    studentId: '4',
    status: 'present',
    markedBy: '1',
    markedAt: '2023-06-16T11:15:00Z',
  },
];
