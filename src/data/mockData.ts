
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

// Get today and tomorrow dates
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

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
    date: formatDate(today),
    startTime: '09:00',
    endTime: '10:30',
    room: 'Room 101',
  },
  {
    id: '2',
    subjectId: '1',
    facultyId: '1',
    title: 'Variables and Data Types',
    date: formatDate(tomorrow),
    startTime: '09:00',
    endTime: '10:30',
    room: 'Room 101',
  },
  {
    id: '3',
    subjectId: '2',
    facultyId: '1',
    title: 'Arrays and Linked Lists',
    date: formatDate(today),
    startTime: '11:00',
    endTime: '12:30',
    room: 'Room 102',
  },
  {
    id: '4',
    subjectId: '3',
    facultyId: '2',
    title: 'SQL Basics',
    date: formatDate(tomorrow),
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 201',
  },
  {
    id: '5',
    subjectId: '4',
    facultyId: '2',
    title: 'Software Development Life Cycle',
    date: formatDate(tomorrow),
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
];

// Function to add or update attendance records
export const addOrUpdateAttendanceRecord = (record: Omit<AttendanceRecord, 'id' | 'markedAt'>) => {
  const existingIndex = attendanceRecords.findIndex(
    r => r.lectureId === record.lectureId && r.studentId === record.studentId
  );
  
  if (existingIndex >= 0) {
    // Update existing record
    attendanceRecords[existingIndex] = {
      ...attendanceRecords[existingIndex],
      status: record.status,
      markedBy: record.markedBy,
      markedAt: new Date().toISOString()
    };
    return attendanceRecords[existingIndex];
  } else {
    // Add new record
    const newId = (attendanceRecords.length + 1).toString();
    const newRecord = {
      id: newId,
      ...record,
      markedAt: new Date().toISOString()
    };
    attendanceRecords.push(newRecord);
    return newRecord;
  }
};

// Function to add a new lecture
export const addLecture = (lecture: Omit<Lecture, 'id'>): Lecture => {
  const newId = (lectures.length + 1).toString();
  const newLecture = {
    id: newId,
    ...lecture
  };
  lectures.push(newLecture);
  return newLecture;
};
