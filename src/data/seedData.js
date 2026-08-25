// Seed Data for Student Academic Monitoring System (SAMS)
// Department of Computer Science, Federal University Dutse (FUD)

export const initialSystemSettings = {
  institution: "Federal University Dutse",
  faculty: "Faculty of Computing",
  department: "Department of Computer Science",
  session: "2025/2026",
  semester: "First Semester",
  attendanceThreshold: 60, // below 60% is At-Risk
  caThreshold: 40,         // below 40% is At-Risk
  smsSimulationEnabled: true,
  lastUpdated: new Date().toISOString(),
};

// 1. Users
export const initialUsers = [
  {
    id: "usr-admin-1",
    name: "Prof. A. B. Danbaba",
    email: "admin@sams.fud.edu.ng",
    password: "Password123",
    role: "admin",
    phone: "+2348031234567",
    title: "Head of Department",
    department: "Computer Science",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    lastLogin: "2026-08-25T14:20:00Z"
  },
  {
    id: "usr-lecturer-1",
    name: "Dr. M. A. Dutse",
    email: "lecturer@sams.fud.edu.ng",
    password: "Password123",
    role: "lecturer",
    phone: "+2348029876543",
    title: "Senior Lecturer",
    department: "Computer Science",
    assignedCourses: ["CSC 101", "CSC 201"],
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    lastLogin: "2026-08-25T13:10:00Z"
  },
  {
    id: "usr-lecturer-2",
    name: "Dr. Amina Bello",
    email: "amina.bello@sams.fud.edu.ng",
    password: "Password123",
    role: "lecturer",
    phone: "+2348034567890",
    title: "Lecturer I",
    department: "Computer Science",
    assignedCourses: ["CSC 102", "CSC 103", "CSC 202", "CSC 203"],
    status: "active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    lastLogin: "2026-08-24T11:00:00Z"
  },
  {
    id: "usr-lecturer-3",
    name: "Mr. Charles Eze",
    email: "charles.eze@sams.fud.edu.ng",
    password: "Password123",
    role: "lecturer",
    phone: "+2348051239876",
    title: "Lecturer II",
    department: "Computer Science",
    assignedCourses: ["CSC 104", "CSC 105", "CSC 204", "CSC 205"],
    status: "active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    lastLogin: "2026-08-24T09:45:00Z"
  },
  {
    id: "usr-lecturer-4",
    name: "Mrs. Hauwa Mohammed",
    email: "hauwa.mohammed@sams.fud.edu.ng",
    password: "Password123",
    role: "lecturer",
    phone: "+2348061122334",
    title: "Lecturer II",
    department: "Computer Science",
    assignedCourses: ["CSC 106"],
    status: "active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    lastLogin: "2026-08-24T08:30:00Z"
  },
  {
    id: "usr-coord-1",
    name: "Mal. Ibrahim Sani",
    email: "coordinator@sams.fud.edu.ng",
    password: "Password123",
    role: "coordinator",
    phone: "+2348065554321",
    title: "Level Coordinator (100L & 200L)",
    department: "Computer Science",
    managedLevels: [100, 200],
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    lastLogin: "2026-08-25T12:00:00Z"
  },
  {
    id: "usr-student-1",
    name: "Usman Aminu Ibrahim",
    email: "student@sams.fud.edu.ng",
    password: "Password123",
    role: "student",
    phone: "+2348101112233",
    matricNo: "FCP/CSC/22/001",
    matricNumber: "FCP/CSC/22/001",
    studentId: "stu-200-01",
    level: 200,
    department: "Computer Science",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    lastLogin: "2026-08-25T15:00:00Z"
  }
];

// 2. Courses (CSC 101 to CSC 106, CSC 201 to CSC 205)
export const initialCourses = [
  // 100 Level Courses
  {
    id: "crs-csc101",
    code: "CSC 101",
    title: "Introduction to Computer Science",
    units: 3,
    creditUnits: 3,
    level: 100,
    semester: "First Semester",
    lecturerId: "usr-lecturer-1",
    lecturerName: "Dr. M. A. Dutse",
    description: "Historical development of computers, hardware/software concepts, data representation, basic algorithms.",
    totalClassesPlanned: 12,
    enrolledCount: 16
  },
  {
    id: "crs-csc102",
    code: "CSC 102",
    title: "Basic Computer Organisation & Architecture",
    units: 3,
    creditUnits: 3,
    level: 100,
    semester: "First Semester",
    lecturerId: "usr-lecturer-2",
    lecturerName: "Dr. Amina Bello",
    description: "Digital logic, boolean algebra, logic gates, memory hierarchies, instruction set architecture.",
    totalClassesPlanned: 12,
    enrolledCount: 16
  },
  {
    id: "crs-csc103",
    code: "CSC 103",
    title: "Intro to Problem Solving & Algorithms",
    units: 2,
    creditUnits: 2,
    level: 100,
    semester: "First Semester",
    lecturerId: "usr-lecturer-2",
    lecturerName: "Dr. Amina Bello",
    description: "Algorithmic thinking, flowcharting, pseudocodes, modular decomposition, control structures.",
    totalClassesPlanned: 10,
    enrolledCount: 16
  },
  {
    id: "crs-csc104",
    code: "CSC 104",
    title: "Introduction to Web Technologies",
    units: 2,
    creditUnits: 2,
    level: 100,
    semester: "First Semester",
    lecturerId: "usr-lecturer-3",
    lecturerName: "Mr. Charles Eze",
    description: "Internet fundamentals, HTML5, CSS3, basic client-side scripting, website deployment.",
    totalClassesPlanned: 10,
    enrolledCount: 16
  },
  {
    id: "crs-csc105",
    code: "CSC 105",
    title: "Applications of Computer Packages",
    units: 2,
    creditUnits: 2,
    level: 100,
    semester: "First Semester",
    lecturerId: "usr-lecturer-3",
    lecturerName: "Mr. Charles Eze",
    description: "Word processing, spreadsheet modelling, presentations, database access and productivity suites.",
    totalClassesPlanned: 10,
    enrolledCount: 16
  },
  {
    id: "crs-csc106",
    code: "CSC 106",
    title: "Discrete Mathematics for Computing",
    units: 3,
    creditUnits: 3,
    level: 100,
    semester: "First Semester",
    lecturerId: "usr-lecturer-4",
    lecturerName: "Mrs. Hauwa Mohammed",
    description: "Set theory, predicate calculus, relations, matrices, combinatorics, proof techniques.",
    totalClassesPlanned: 12,
    enrolledCount: 16
  },

  // 200 Level Courses
  {
    id: "crs-csc201",
    code: "CSC 201",
    title: "Computer Programming I (C++ / OOP)",
    units: 3,
    creditUnits: 3,
    level: 200,
    semester: "First Semester",
    lecturerId: "usr-lecturer-1",
    lecturerName: "Dr. M. A. Dutse",
    description: "Structured programming, pointers, object-oriented concepts, classes, inheritance, polymorphism in C++.",
    totalClassesPlanned: 12,
    enrolledCount: 16
  },
  {
    id: "crs-csc202",
    code: "CSC 202",
    title: "Computer Programming II (Java)",
    units: 3,
    creditUnits: 3,
    level: 200,
    semester: "First Semester",
    lecturerId: "usr-lecturer-2",
    lecturerName: "Dr. Amina Bello",
    description: "Java syntax, OOP implementation, abstract window toolkit, exception handling, multithreading.",
    totalClassesPlanned: 12,
    enrolledCount: 16
  },
  {
    id: "crs-csc203",
    code: "CSC 203",
    title: "Discrete Structures",
    units: 3,
    creditUnits: 3,
    level: 200,
    semester: "First Semester",
    lecturerId: "usr-lecturer-2",
    lecturerName: "Dr. Amina Bello",
    description: "Graphs, trees, finite state automata, algebraic structures, formal languages.",
    totalClassesPlanned: 12,
    enrolledCount: 16
  },
  {
    id: "crs-csc204",
    code: "CSC 204",
    title: "Database Design and Management",
    units: 3,
    creditUnits: 3,
    level: 200,
    semester: "First Semester",
    lecturerId: "usr-lecturer-3",
    lecturerName: "Mr. Charles Eze",
    description: "Relational database concepts, ER modelling, normalization, SQL, transaction management.",
    totalClassesPlanned: 12,
    enrolledCount: 16
  },
  {
    id: "crs-csc205",
    code: "CSC 205",
    title: "Operating Systems I",
    units: 2,
    creditUnits: 2,
    level: 200,
    semester: "First Semester",
    lecturerId: "usr-lecturer-3",
    lecturerName: "Mr. Charles Eze",
    description: "Process management, CPU scheduling, synchronization, deadlocks, memory virtualization.",
    totalClassesPlanned: 10,
    enrolledCount: 16
  }
];

// 3. Students (32 Realistic Nigerian FUD Computer Science Students with FCP/CSC/YY/NNN Matric format)
export const initialStudents = [
  // --- 100 LEVEL STUDENTS (16 Students - FCP/CSC/23/001 to 016) ---
  // Safe Students
  {
    id: "stu-100-01",
    matricNo: "FCP/CSC/23/001",
    matricNumber: "FCP/CSC/23/001",
    name: "Fatima Abubakar",
    gender: "Female",
    level: 100,
    phone: "+2348030010001",
    email: "f.abubakar@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // At-Risk due to Attendance (Low Attendance 50%, CA 70%)
  {
    id: "stu-100-02",
    matricNo: "FCP/CSC/23/002",
    matricNumber: "FCP/CSC/23/002",
    name: "Bello Sani Aliyu",
    gender: "Male",
    level: 100,
    phone: "+2348030010002",
    email: "b.aliyu@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Kano",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // Critical At-Risk (Attendance 12.5% & CA 32.5%)
  {
    id: "stu-100-03",
    matricNo: "FCP/CSC/23/003",
    matricNumber: "FCP/CSC/23/003",
    name: "Emmanuel Chukwu",
    gender: "Male",
    level: 100,
    phone: "+2348030010003",
    email: "e.chukwu@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Enugu",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // Safe
  {
    id: "stu-100-04",
    matricNo: "FCP/CSC/23/004",
    matricNumber: "FCP/CSC/23/004",
    name: "Zainab Kabir Umar",
    gender: "Female",
    level: 100,
    phone: "+2348030010004",
    email: "z.umar@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Kaduna",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // At-Risk due to CA (Attendance 87.5%, CA 37.5%)
  {
    id: "stu-100-05",
    matricNo: "FCP/CSC/23/005",
    matricNumber: "FCP/CSC/23/005",
    name: "Abdulrahman Musa",
    gender: "Male",
    level: 100,
    phone: "+2348030010005",
    email: "a.musa@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Katsina",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // Safe
  {
    id: "stu-100-06",
    matricNo: "FCP/CSC/23/006",
    matricNumber: "FCP/CSC/23/006",
    name: "Maryam Danladi",
    gender: "Female",
    level: 100,
    phone: "+2348030010006",
    email: "m.danladi@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // Critical At-Risk (Attendance 25% & CA 30%)
  {
    id: "stu-100-07",
    matricNo: "FCP/CSC/23/007",
    matricNumber: "FCP/CSC/23/007",
    name: "David Ayomide Oladipo",
    gender: "Male",
    level: 100,
    phone: "+2348030010007",
    email: "d.oladipo@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Osun",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // Safe
  {
    id: "stu-100-08",
    matricNo: "FCP/CSC/23/008",
    matricNumber: "FCP/CSC/23/008",
    name: "Aisha Mohammed Bello",
    gender: "Female",
    level: 100,
    phone: "+2348030010008",
    email: "a.bello@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Bauchi",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // At-Risk due to Attendance (Attendance 37.5%, CA 65%)
  {
    id: "stu-100-09",
    matricNo: "FCP/CSC/23/009",
    matricNumber: "FCP/CSC/23/009",
    name: "Kabir Shehu Jalingo",
    gender: "Male",
    level: 100,
    phone: "+2348030010009",
    email: "k.jalingo@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Taraba",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // Safe
  {
    id: "stu-100-10",
    matricNo: "FCP/CSC/23/010",
    matricNumber: "FCP/CSC/23/010",
    name: "Blessing Nkechi Obi",
    gender: "Female",
    level: 100,
    phone: "+2348030010010",
    email: "b.obi@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Anambra",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // Safe
  {
    id: "stu-100-11",
    matricNo: "FCP/CSC/23/011",
    matricNumber: "FCP/CSC/23/011",
    name: "Haruna Yusuf Gwarzo",
    gender: "Male",
    level: 100,
    phone: "+2348030010011",
    email: "h.gwarzo@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Kano",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // Critical At-Risk (Attendance 0% & CA 25%)
  {
    id: "stu-100-12",
    matricNo: "FCP/CSC/23/012",
    matricNumber: "FCP/CSC/23/012",
    name: "Nafisa Lawal Kazaure",
    gender: "Female",
    level: 100,
    phone: "+2348030010012",
    email: "n.kazaure@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // Safe
  {
    id: "stu-100-13",
    matricNo: "FCP/CSC/23/013",
    matricNumber: "FCP/CSC/23/013",
    name: "Abubakar Siddiq Tahir",
    gender: "Male",
    level: 100,
    phone: "+2348030010013",
    email: "a.tahir@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // At-Risk due to CA (Attendance 75%, CA 35%)
  {
    id: "stu-100-14",
    matricNo: "FCP/CSC/23/014",
    matricNumber: "FCP/CSC/23/014",
    name: "Hadiza Bashir Gaya",
    gender: "Female",
    level: 100,
    phone: "+2348030010014",
    email: "h.gaya@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Kano",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // Safe
  {
    id: "stu-100-15",
    matricNo: "FCP/CSC/23/015",
    matricNumber: "FCP/CSC/23/015",
    name: "Usman Farouq Dutse",
    gender: "Male",
    level: 100,
    phone: "+2348030010015",
    email: "u.dutse@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },
  // Safe
  {
    id: "stu-100-16",
    matricNo: "FCP/CSC/23/016",
    matricNumber: "FCP/CSC/23/016",
    name: "Khadija Abdullahi Taura",
    gender: "Female",
    level: 100,
    phone: "+2348030010016",
    email: "k.taura@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
    status: "active"
  },

  // --- 200 LEVEL STUDENTS (16 Students - FCP/CSC/22/001 to 016) ---
  // Safe (Demo Student)
  {
    id: "stu-200-01",
    matricNo: "FCP/CSC/22/001",
    matricNumber: "FCP/CSC/22/001",
    name: "Usman Aminu Ibrahim",
    gender: "Male",
    level: 200,
    phone: "+2348101112233",
    email: "student@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // Safe
  {
    id: "stu-200-02",
    matricNo: "FCP/CSC/22/002",
    matricNumber: "FCP/CSC/22/002",
    name: "Khadija Mustapha Ringim",
    gender: "Female",
    level: 200,
    phone: "+2348030020002",
    email: "k.ringim@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // At-Risk due to CA (Attendance 75%, CA 35%)
  {
    id: "stu-200-03",
    matricNo: "FCP/CSC/22/003",
    matricNumber: "FCP/CSC/22/003",
    name: "Victor Ifeanyi Eze",
    gender: "Male",
    level: 200,
    phone: "+2348030020003",
    email: "v.eze@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Imo",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // Safe
  {
    id: "stu-200-04",
    matricNo: "FCP/CSC/22/004",
    matricNumber: "FCP/CSC/22/004",
    name: "Aisha Gambo Hadejia",
    gender: "Female",
    level: 200,
    phone: "+2348030020004",
    email: "a.hadejia@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // Critical At-Risk (Attendance 12.5% & CA 27.5%)
  {
    id: "stu-200-05",
    matricNo: "FCP/CSC/22/005",
    matricNumber: "FCP/CSC/22/005",
    name: "Yakubu Idris Birnin-Kudu",
    gender: "Male",
    level: 200,
    phone: "+2348030020005",
    email: "y.idris@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // Safe
  {
    id: "stu-200-06",
    matricNo: "FCP/CSC/22/006",
    matricNumber: "FCP/CSC/22/006",
    name: "Precious Chioma Adams",
    gender: "Female",
    level: 200,
    phone: "+2348030020006",
    email: "p.adams@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Edo",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // At-Risk due to Attendance (Attendance 25.0%, CA 65%)
  {
    id: "stu-200-07",
    matricNo: "FCP/CSC/22/007",
    matricNumber: "FCP/CSC/22/007",
    name: "Mustapha Alkasim Gumel",
    gender: "Male",
    level: 200,
    phone: "+2348030020007",
    email: "m.gumel@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // Safe
  {
    id: "stu-200-08",
    matricNo: "FCP/CSC/22/008",
    matricNumber: "FCP/CSC/22/008",
    name: "Hauwa Suleiman Jahun",
    gender: "Female",
    level: 200,
    phone: "+2348030020008",
    email: "h.jahun@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // Critical At-Risk (Attendance 0% & CA 22.5%)
  {
    id: "stu-200-09",
    matricNo: "FCP/CSC/22/009",
    matricNumber: "FCP/CSC/22/009",
    name: "Samuel Olumide Adeyemi",
    gender: "Male",
    level: 200,
    phone: "+2348030020009",
    email: "s.adeyemi@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Oyo",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // Safe
  {
    id: "stu-200-10",
    matricNo: "FCP/CSC/22/010",
    matricNumber: "FCP/CSC/22/010",
    name: "Rakiya Ahmad Babura",
    gender: "Female",
    level: 200,
    phone: "+2348030020010",
    email: "r.babura@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // Safe
  {
    id: "stu-200-11",
    matricNo: "FCP/CSC/22/011",
    matricNumber: "FCP/CSC/22/011",
    name: "Ahmad Tijjani Roni",
    gender: "Male",
    level: 200,
    phone: "+2348030020011",
    email: "a.roni@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // Safe
  {
    id: "stu-200-12",
    matricNo: "FCP/CSC/22/012",
    matricNumber: "FCP/CSC/22/012",
    name: "Grace Ngozi Okafor",
    gender: "Female",
    level: 200,
    phone: "+2348030020012",
    email: "g.okafor@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Enugu",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // At-Risk due to Attendance (Attendance 50%, CA 80%)
  {
    id: "stu-200-13",
    matricNo: "FCP/CSC/22/013",
    matricNumber: "FCP/CSC/22/013",
    name: "Ibrahim Dahiru Kazaure",
    gender: "Male",
    level: 200,
    phone: "+2348030020013",
    email: "i.kazaure@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // Safe
  {
    id: "stu-200-14",
    matricNo: "FCP/CSC/22/014",
    matricNumber: "FCP/CSC/22/014",
    name: "Zainab Mukhtar Dutse",
    gender: "Female",
    level: 200,
    phone: "+2348030020014",
    email: "z.dutse@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // Critical At-Risk (Attendance 25% & CA 30%)
  {
    id: "stu-200-15",
    matricNo: "FCP/CSC/22/015",
    matricNumber: "FCP/CSC/22/015",
    name: "Chukwudi Paul Nwachukwu",
    gender: "Male",
    level: 200,
    phone: "+2348030020015",
    email: "c.nwachukwu@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Abia",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  },
  // Safe
  {
    id: "stu-200-16",
    matricNo: "FCP/CSC/22/016",
    matricNumber: "FCP/CSC/22/016",
    name: "Halima Sani Birniwa",
    gender: "Female",
    level: 200,
    phone: "+2348030020016",
    email: "h.birniwa@sams.fud.edu.ng",
    coordinatorId: "usr-coord-1",
    advisor: "Mal. Ibrahim Sani",
    department: "Computer Science",
    session: "2025/2026",
    stateOfOrigin: "Jigawa",
    enrolledCourses: ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"],
    status: "active"
  }
];

// 4. Enrollments (Linking all 32 students to their respective semester courses)
export const generateInitialEnrollments = () => {
  const list = [];
  initialStudents.forEach(stu => {
    (stu.enrolledCourses || []).forEach(courseCode => {
      const course = initialCourses.find(c => c.code === courseCode);
      list.push({
        id: `enr-${stu.id}-${courseCode.toLowerCase().replace(/\s+/g, '')}`,
        studentId: stu.id,
        studentName: stu.name,
        matricNo: stu.matricNo,
        courseId: course ? course.id : `crs-${courseCode.toLowerCase().replace(/\s+/g, '')}`,
        courseCode: courseCode,
        level: stu.level,
        session: "2025/2026",
        semester: "First Semester",
        enrolledAt: "2026-05-15T09:00:00Z"
      });
    });
  });
  return list;
};

export const initialEnrollments = generateInitialEnrollments();

// 5. Attendance Sessions (Weekly attendance records)
export const initialAttendanceSessions = [
  // CSC 101 Sessions (8 Weekly Sessions)
  {
    id: "att-csc101-s1", courseCode: "CSC 101", date: "2026-06-03", topic: "Introduction to Computing History & Architecture",
    records: {
      "stu-100-01": "present", "stu-100-02": "absent",  "stu-100-03": "absent", "stu-100-04": "present",
      "stu-100-05": "present", "stu-100-06": "present", "stu-100-07": "absent", "stu-100-08": "present",
      "stu-100-09": "absent",  "stu-100-10": "present", "stu-100-11": "present", "stu-100-12": "absent",
      "stu-100-13": "present", "stu-100-14": "present", "stu-100-15": "present", "stu-100-16": "present"
    }
  },
  {
    id: "att-csc101-s2", courseCode: "CSC 101", date: "2026-06-10", topic: "Number Systems & Binary Conversions",
    records: {
      "stu-100-01": "present", "stu-100-02": "present", "stu-100-03": "absent", "stu-100-04": "present",
      "stu-100-05": "present", "stu-100-06": "present", "stu-100-07": "absent", "stu-100-08": "present",
      "stu-100-09": "present", "stu-100-10": "present", "stu-100-11": "present", "stu-100-12": "absent",
      "stu-100-13": "present", "stu-100-14": "present", "stu-100-15": "present", "stu-100-16": "present"
    }
  },
  {
    id: "att-csc101-s3", courseCode: "CSC 101", date: "2026-06-17", topic: "Computer Hardware Components & Motherboard",
    records: {
      "stu-100-01": "present", "stu-100-02": "absent",  "stu-100-03": "absent", "stu-100-04": "present",
      "stu-100-05": "present", "stu-100-06": "present", "stu-100-07": "absent", "stu-100-08": "present",
      "stu-100-09": "absent",  "stu-100-10": "present", "stu-100-11": "present", "stu-100-12": "absent",
      "stu-100-13": "present", "stu-100-14": "present", "stu-100-15": "present", "stu-100-16": "present"
    }
  },
  {
    id: "att-csc101-s4", courseCode: "CSC 101", date: "2026-06-24", topic: "System Software vs Application Software",
    records: {
      "stu-100-01": "present", "stu-100-02": "absent",  "stu-100-03": "absent", "stu-100-04": "present",
      "stu-100-05": "present", "stu-100-06": "present", "stu-100-07": "present", "stu-100-08": "present",
      "stu-100-09": "absent",  "stu-100-10": "present", "stu-100-11": "present", "stu-100-12": "absent",
      "stu-100-13": "present", "stu-100-14": "present", "stu-100-15": "present", "stu-100-16": "present"
    }
  },
  {
    id: "att-csc101-s5", courseCode: "CSC 101", date: "2026-07-01", topic: "Data Representation & Boolean Logic",
    records: {
      "stu-100-01": "present", "stu-100-02": "present", "stu-100-03": "absent", "stu-100-04": "present",
      "stu-100-05": "present", "stu-100-06": "present", "stu-100-07": "absent", "stu-100-08": "present",
      "stu-100-09": "absent",  "stu-100-10": "present", "stu-100-11": "present", "stu-100-12": "absent",
      "stu-100-13": "present", "stu-100-14": "present", "stu-100-15": "present", "stu-100-16": "present"
    }
  },
  {
    id: "att-csc101-s6", courseCode: "CSC 101", date: "2026-07-08", topic: "Computer Networks & Internet Protocols",
    records: {
      "stu-100-01": "present", "stu-100-02": "absent",  "stu-100-03": "present", "stu-100-04": "present",
      "stu-100-05": "present", "stu-100-06": "present", "stu-100-07": "absent", "stu-100-08": "present",
      "stu-100-09": "absent",  "stu-100-10": "present", "stu-100-11": "present", "stu-100-12": "absent",
      "stu-100-13": "present", "stu-100-14": "present", "stu-100-15": "present", "stu-100-16": "present"
    }
  },
  {
    id: "att-csc101-s7", courseCode: "CSC 101", date: "2026-07-15", topic: "Basic Cyber Security & Ethics",
    records: {
      "stu-100-01": "present", "stu-100-02": "absent",  "stu-100-03": "absent", "stu-100-04": "present",
      "stu-100-05": "present", "stu-100-06": "present", "stu-100-07": "absent", "stu-100-08": "present",
      "stu-100-09": "present", "stu-100-10": "present", "stu-100-11": "present", "stu-100-12": "absent",
      "stu-100-13": "present", "stu-100-14": "present", "stu-100-15": "present", "stu-100-16": "present"
    }
  },
  {
    id: "att-csc101-s8", courseCode: "CSC 101", date: "2026-07-22", topic: "Algorithms & Flowcharting Review",
    records: {
      "stu-100-01": "present", "stu-100-02": "present", "stu-100-03": "absent", "stu-100-04": "present",
      "stu-100-05": "present", "stu-100-06": "present", "stu-100-07": "absent", "stu-100-08": "present",
      "stu-100-09": "absent",  "stu-100-10": "present", "stu-100-11": "present", "stu-100-12": "absent",
      "stu-100-13": "present", "stu-100-14": "present", "stu-100-15": "present", "stu-100-16": "present"
    }
  },

  // CSC 201 Sessions (8 Weekly Sessions)
  {
    id: "att-csc201-s1", courseCode: "CSC 201", date: "2026-06-04", topic: "Review of C++ Syntax & Pointer Fundamentals",
    records: {
      "stu-200-01": "present", "stu-200-02": "present", "stu-200-03": "present", "stu-200-04": "present",
      "stu-200-05": "absent",  "stu-200-06": "present", "stu-200-07": "absent",  "stu-200-08": "present",
      "stu-200-09": "absent",  "stu-200-10": "present", "stu-200-11": "present", "stu-200-12": "present",
      "stu-200-13": "absent",  "stu-200-14": "present", "stu-200-15": "absent",  "stu-200-16": "present"
    }
  },
  {
    id: "att-csc201-s2", courseCode: "CSC 201", date: "2026-06-11", topic: "Dynamic Memory Allocation & Pointers to Objects",
    records: {
      "stu-200-01": "present", "stu-200-02": "present", "stu-200-03": "absent",  "stu-200-04": "present",
      "stu-200-05": "absent",  "stu-200-06": "present", "stu-200-07": "absent",  "stu-200-08": "present",
      "stu-200-09": "absent",  "stu-200-10": "present", "stu-200-11": "present", "stu-200-12": "present",
      "stu-200-13": "present", "stu-200-14": "present", "stu-200-15": "absent",  "stu-200-16": "present"
    }
  },
  {
    id: "att-csc201-s3", courseCode: "CSC 201", date: "2026-06-18", topic: "Classes, Constructors & Destructors",
    records: {
      "stu-200-01": "present", "stu-200-02": "present", "stu-200-03": "present", "stu-200-04": "present",
      "stu-200-05": "absent",  "stu-200-06": "present", "stu-200-07": "present", "stu-200-08": "present",
      "stu-200-09": "absent",  "stu-200-10": "present", "stu-200-11": "present", "stu-200-12": "present",
      "stu-200-13": "absent",  "stu-200-14": "present", "stu-200-15": "present", "stu-200-16": "present"
    }
  },
  {
    id: "att-csc201-s4", courseCode: "CSC 201", date: "2026-06-25", topic: "Operator Overloading & Friend Functions",
    records: {
      "stu-200-01": "present", "stu-200-02": "present", "stu-200-03": "absent",  "stu-200-04": "present",
      "stu-200-05": "absent",  "stu-200-06": "present", "stu-200-07": "absent",  "stu-200-08": "present",
      "stu-200-09": "absent",  "stu-200-10": "present", "stu-200-11": "present", "stu-200-12": "present",
      "stu-200-13": "present", "stu-200-14": "present", "stu-200-15": "absent",  "stu-200-16": "present"
    }
  },
  {
    id: "att-csc201-s5", courseCode: "CSC 201", date: "2026-07-02", topic: "Inheritance Types & Access Specifiers",
    records: {
      "stu-200-01": "present", "stu-200-02": "present", "stu-200-03": "present", "stu-200-04": "present",
      "stu-200-05": "present", "stu-200-06": "present", "stu-200-07": "absent",  "stu-200-08": "present",
      "stu-200-09": "absent",  "stu-200-10": "present", "stu-200-11": "present", "stu-200-12": "present",
      "stu-200-13": "absent",  "stu-200-14": "present", "stu-200-15": "absent",  "stu-200-16": "present"
    }
  },
  {
    id: "att-csc201-s6", courseCode: "CSC 201", date: "2026-07-09", topic: "Polymorphism & Virtual Functions",
    records: {
      "stu-200-01": "present", "stu-200-02": "present", "stu-200-03": "absent",  "stu-200-04": "present",
      "stu-200-05": "absent",  "stu-200-06": "present", "stu-200-07": "absent",  "stu-200-08": "present",
      "stu-200-09": "absent",  "stu-200-10": "present", "stu-200-11": "present", "stu-200-12": "present",
      "stu-200-13": "present", "stu-200-14": "present", "stu-200-15": "absent",  "stu-200-16": "present"
    }
  },
  {
    id: "att-csc201-s7", courseCode: "CSC 201", date: "2026-07-16", topic: "File Handling & Stream I/O Operations",
    records: {
      "stu-200-01": "present", "stu-200-02": "present", "stu-200-03": "present", "stu-200-04": "present",
      "stu-200-05": "absent",  "stu-200-06": "present", "stu-200-07": "absent",  "stu-200-08": "present",
      "stu-200-09": "absent",  "stu-200-10": "present", "stu-200-11": "present", "stu-200-12": "present",
      "stu-200-13": "absent",  "stu-200-14": "present", "stu-200-15": "absent",  "stu-200-16": "present"
    }
  },
  {
    id: "att-csc201-s8", courseCode: "CSC 201", date: "2026-07-23", topic: "Templates & Standard Template Library (STL)",
    records: {
      "stu-200-01": "present", "stu-200-02": "present", "stu-200-03": "present", "stu-200-04": "present",
      "stu-200-05": "absent",  "stu-200-06": "present", "stu-200-07": "present", "stu-200-08": "present",
      "stu-200-09": "absent",  "stu-200-10": "present", "stu-200-11": "present", "stu-200-12": "present",
      "stu-200-13": "present", "stu-200-14": "present", "stu-200-15": "present", "stu-200-16": "present"
    }
  }
];

// 6. CA Scores (With assignment, quiz, test, total, and percentage)
export const initialCaScores = [
  // 100L Students in CSC 101
  {
    id: "ca-csc101-01", enrollmentId: "enr-stu-100-01-csc101", studentId: "stu-100-01", courseCode: "CSC 101",
    assignment: 9, quiz: 13, test: 14, test1: 13, test2: 14, total: 36, totalCa: 36, maxCa: 40, percentage: 90
  },
  {
    id: "ca-csc101-02", enrollmentId: "enr-stu-100-02-csc101", studentId: "stu-100-02", courseCode: "CSC 101",
    assignment: 7, quiz: 10, test: 11, test1: 10, test2: 11, total: 28, totalCa: 28, maxCa: 40, percentage: 70
  },
  { // Critical At-Risk (CA 32.5% + Att 12.5%)
    id: "ca-csc101-03", enrollmentId: "enr-stu-100-03-csc101", studentId: "stu-100-03", courseCode: "CSC 101",
    assignment: 4, quiz: 5, test: 4, test1: 5, test2: 4, total: 13, totalCa: 13, maxCa: 40, percentage: 32.5
  },
  {
    id: "ca-csc101-04", enrollmentId: "enr-stu-100-04-csc101", studentId: "stu-100-04", courseCode: "CSC 101",
    assignment: 8, quiz: 14, test: 13, test1: 14, test2: 13, total: 35, totalCa: 35, maxCa: 40, percentage: 87.5
  },
  { // At-Risk due to CA (37.5%)
    id: "ca-csc101-05", enrollmentId: "enr-stu-100-05-csc101", studentId: "stu-100-05", courseCode: "CSC 101",
    assignment: 4, quiz: 6, test: 5, test1: 6, test2: 5, total: 15, totalCa: 15, maxCa: 40, percentage: 37.5
  },
  {
    id: "ca-csc101-06", enrollmentId: "enr-stu-100-06-csc101", studentId: "stu-100-06", courseCode: "CSC 101",
    assignment: 8, quiz: 12, test: 13, test1: 12, test2: 13, total: 33, totalCa: 33, maxCa: 40, percentage: 82.5
  },
  { // Critical At-Risk (CA 30% + Att 25%)
    id: "ca-csc101-07", enrollmentId: "enr-stu-100-07-csc101", studentId: "stu-100-07", courseCode: "CSC 101",
    assignment: 3, quiz: 4, test: 5, test1: 4, test2: 5, total: 12, totalCa: 12, maxCa: 40, percentage: 30
  },
  {
    id: "ca-csc101-08", enrollmentId: "enr-stu-100-08-csc101", studentId: "stu-100-08", courseCode: "CSC 101",
    assignment: 8, quiz: 11, test: 12, test1: 11, test2: 12, total: 31, totalCa: 31, maxCa: 40, percentage: 77.5
  },
  {
    id: "ca-csc101-09", enrollmentId: "enr-stu-100-09-csc101", studentId: "stu-100-09", courseCode: "CSC 101",
    assignment: 7, quiz: 10, test: 9, test1: 10, test2: 9, total: 26, totalCa: 26, maxCa: 40, percentage: 65
  },
  {
    id: "ca-csc101-10", enrollmentId: "enr-stu-100-10-csc101", studentId: "stu-100-10", courseCode: "CSC 101",
    assignment: 9, quiz: 13, test: 14, test1: 13, test2: 14, total: 36, totalCa: 36, maxCa: 40, percentage: 90
  },
  {
    id: "ca-csc101-11", enrollmentId: "enr-stu-100-11-csc101", studentId: "stu-100-11", courseCode: "CSC 101",
    assignment: 7, quiz: 12, test: 11, test1: 12, test2: 11, total: 30, totalCa: 30, maxCa: 40, percentage: 75
  },
  { // Critical At-Risk (CA 25% + Att 0%)
    id: "ca-csc101-12", enrollmentId: "enr-stu-100-12-csc101", studentId: "stu-100-12", courseCode: "CSC 101",
    assignment: 3, quiz: 3, test: 4, test1: 3, test2: 4, total: 10, totalCa: 10, maxCa: 40, percentage: 25
  },
  {
    id: "ca-csc101-13", enrollmentId: "enr-stu-100-13-csc101", studentId: "stu-100-13", courseCode: "CSC 101",
    assignment: 8, quiz: 13, test: 13, test1: 13, test2: 13, total: 34, totalCa: 34, maxCa: 40, percentage: 85
  },
  { // At-Risk due to CA (35%)
    id: "ca-csc101-14", enrollmentId: "enr-stu-100-14-csc101", studentId: "stu-100-14", courseCode: "CSC 101",
    assignment: 4, quiz: 5, test: 5, test1: 5, test2: 5, total: 14, totalCa: 14, maxCa: 40, percentage: 35
  },
  {
    id: "ca-csc101-15", enrollmentId: "enr-stu-100-15-csc101", studentId: "stu-100-15", courseCode: "CSC 101",
    assignment: 8, quiz: 12, test: 12, test1: 12, test2: 12, total: 32, totalCa: 32, maxCa: 40, percentage: 80
  },
  {
    id: "ca-csc101-16", enrollmentId: "enr-stu-100-16-csc101", studentId: "stu-100-16", courseCode: "CSC 101",
    assignment: 9, quiz: 14, test: 14, test1: 14, test2: 14, total: 37, totalCa: 37, maxCa: 40, percentage: 92.5
  },

  // 200L Students in CSC 201
  {
    id: "ca-csc201-01", enrollmentId: "enr-stu-200-01-csc201", studentId: "stu-200-01", courseCode: "CSC 201",
    assignment: 8, quiz: 12, test: 13, test1: 12, test2: 13, total: 33, totalCa: 33, maxCa: 40, percentage: 82.5
  },
  {
    id: "ca-csc201-02", enrollmentId: "enr-stu-200-02-csc201", studentId: "stu-200-02", courseCode: "CSC 201",
    assignment: 9, quiz: 14, test: 13, test1: 14, test2: 13, total: 36, totalCa: 36, maxCa: 40, percentage: 90
  },
  { // At-Risk due to CA (35%)
    id: "ca-csc201-03", enrollmentId: "enr-stu-200-03-csc201", studentId: "stu-200-03", courseCode: "CSC 201",
    assignment: 4, quiz: 5, test: 5, test1: 5, test2: 5, total: 14, totalCa: 14, maxCa: 40, percentage: 35
  },
  {
    id: "ca-csc201-04", enrollmentId: "enr-stu-200-04-csc201", studentId: "stu-200-04", courseCode: "CSC 201",
    assignment: 8, quiz: 11, test: 12, test1: 11, test2: 12, total: 31, totalCa: 31, maxCa: 40, percentage: 77.5
  },
  { // Critical At-Risk (CA 27.5% + Att 12.5%)
    id: "ca-csc201-05", enrollmentId: "enr-stu-200-05-csc201", studentId: "stu-200-05", courseCode: "CSC 201",
    assignment: 3, quiz: 4, test: 4, test1: 4, test2: 4, total: 11, totalCa: 11, maxCa: 40, percentage: 27.5
  },
  {
    id: "ca-csc201-06", enrollmentId: "enr-stu-200-06-csc201", studentId: "stu-200-06", courseCode: "CSC 201",
    assignment: 8, quiz: 13, test: 14, test1: 13, test2: 14, total: 35, totalCa: 35, maxCa: 40, percentage: 87.5
  },
  {
    id: "ca-csc201-07", enrollmentId: "enr-stu-200-07-csc201", studentId: "stu-200-07", courseCode: "CSC 201",
    assignment: 7, quiz: 9, test: 10, test1: 9, test2: 10, total: 26, totalCa: 26, maxCa: 40, percentage: 65
  },
  {
    id: "ca-csc201-08", enrollmentId: "enr-stu-200-08-csc201", studentId: "stu-200-08", courseCode: "CSC 201",
    assignment: 9, quiz: 12, test: 12, test1: 12, test2: 12, total: 33, totalCa: 33, maxCa: 40, percentage: 82.5
  },
  { // Critical At-Risk (CA 22.5% + Att 0%)
    id: "ca-csc201-09", enrollmentId: "enr-stu-200-09-csc201", studentId: "stu-200-09", courseCode: "CSC 201",
    assignment: 3, quiz: 3, test: 3, test1: 3, test2: 3, total: 9, totalCa: 9, maxCa: 40, percentage: 22.5
  },
  {
    id: "ca-csc201-10", enrollmentId: "enr-stu-200-10-csc201", studentId: "stu-200-10", courseCode: "CSC 201",
    assignment: 8, quiz: 11, test: 13, test1: 11, test2: 13, total: 32, totalCa: 32, maxCa: 40, percentage: 80
  },
  {
    id: "ca-csc201-11", enrollmentId: "enr-stu-200-11-csc201", studentId: "stu-200-11", courseCode: "CSC 201",
    assignment: 7, quiz: 10, test: 11, test1: 10, test2: 11, total: 28, totalCa: 28, maxCa: 40, percentage: 70
  },
  {
    id: "ca-csc201-12", enrollmentId: "enr-stu-200-12-csc201", studentId: "stu-200-12", courseCode: "CSC 201",
    assignment: 9, quiz: 14, test: 14, test1: 14, test2: 14, total: 37, totalCa: 37, maxCa: 40, percentage: 92.5
  },
  {
    id: "ca-csc201-13", enrollmentId: "enr-stu-200-13-csc201", studentId: "stu-200-13", courseCode: "CSC 201",
    assignment: 8, quiz: 12, test: 12, test1: 12, test2: 12, total: 32, totalCa: 32, maxCa: 40, percentage: 80
  },
  {
    id: "ca-csc201-14", enrollmentId: "enr-stu-200-14-csc201", studentId: "stu-200-14", courseCode: "CSC 201",
    assignment: 8, quiz: 13, test: 14, test1: 13, test2: 14, total: 35, totalCa: 35, maxCa: 40, percentage: 87.5
  },
  { // Critical At-Risk (CA 30% + Att 25%)
    id: "ca-csc201-15", enrollmentId: "enr-stu-200-15-csc201", studentId: "stu-200-15", courseCode: "CSC 201",
    assignment: 4, quiz: 4, test: 4, test1: 4, test2: 4, total: 12, totalCa: 12, maxCa: 40, percentage: 30
  },
  {
    id: "ca-csc201-16", enrollmentId: "enr-stu-200-16-csc201", studentId: "stu-200-16", courseCode: "CSC 201",
    assignment: 9, quiz: 13, test: 14, test1: 13, test2: 14, total: 36, totalCa: 36, maxCa: 40, percentage: 90
  }
];

// 7. Initial Realistic Alerts
export const initialAlerts = [
  {
    id: "alt-001",
    studentId: "stu-200-05",
    studentName: "Yakubu Idris Birnin-Kudu",
    matricNumber: "FCP/CSC/22/005",
    matricNo: "FCP/CSC/22/005",
    level: 200,
    courseCode: "CSC 201",
    type: "Critical Academic Warning",
    severity: "critical",
    message: "Critical At-Risk alert: Student attendance is 12.5% (below 60%) and CA score is 27.5% (below 40%) in CSC 201.",
    recipient: "Level Coordinator & Student",
    status: "unread",
    createdAt: "2026-08-20T10:15:00Z"
  },
  {
    id: "alt-002",
    studentId: "stu-200-09",
    studentName: "Samuel Olumide Adeyemi",
    matricNumber: "FCP/CSC/22/009",
    matricNo: "FCP/CSC/22/009",
    level: 200,
    courseCode: "CSC 201",
    type: "Critical Academic Warning",
    severity: "critical",
    message: "Critical At-Risk alert: Student attendance is 0% and CA score is 22.5% in CSC 201. Urgent counseling required.",
    recipient: "Level Coordinator & Student",
    status: "unread",
    createdAt: "2026-08-21T08:30:00Z"
  },
  {
    id: "alt-003",
    studentId: "stu-200-07",
    studentName: "Mustapha Alkasim Gumel",
    matricNumber: "FCP/CSC/22/007",
    matricNo: "FCP/CSC/22/007",
    level: 200,
    courseCode: "CSC 201",
    type: "Attendance Warning",
    severity: "warning",
    message: "Attendance Warning: Student attendance in CSC 201 is 25.0%, which is below the mandatory 60% threshold.",
    recipient: "Level Coordinator & Student",
    status: "read",
    createdAt: "2026-08-22T14:45:00Z"
  },
  {
    id: "alt-004",
    studentId: "stu-100-03",
    studentName: "Emmanuel Chukwu",
    matricNumber: "FCP/CSC/23/003",
    matricNo: "FCP/CSC/23/003",
    level: 100,
    courseCode: "CSC 101",
    type: "Critical Academic Warning",
    severity: "critical",
    message: "Critical At-Risk alert: Emmanuel Chukwu has recorded 12.5% attendance and 32.5% CA score in CSC 101.",
    recipient: "Level Coordinator & Student",
    status: "unread",
    createdAt: "2026-08-23T09:12:00Z"
  },
  {
    id: "alt-005",
    studentId: "stu-100-05",
    studentName: "Abdulrahman Musa",
    matricNumber: "FCP/CSC/23/005",
    matricNo: "FCP/CSC/23/005",
    level: 100,
    courseCode: "CSC 101",
    type: "CA Warning",
    severity: "warning",
    message: "CA Warning: Continuous Assessment score is 37.5% in CSC 101 (below 40% threshold). Remedial assistance advised.",
    recipient: "Level Coordinator & Student",
    status: "unread",
    createdAt: "2026-08-24T16:05:00Z"
  },
  {
    id: "alt-006",
    studentId: "stu-200-15",
    studentName: "Chukwudi Paul Nwachukwu",
    matricNumber: "FCP/CSC/22/015",
    matricNo: "FCP/CSC/22/015",
    level: 200,
    courseCode: "CSC 201",
    type: "Critical Academic Warning",
    severity: "critical",
    message: "Critical At-Risk alert: Student attendance is 25% and CA score is 30% in CSC 201. Departmental review required.",
    recipient: "Level Coordinator & Student",
    status: "unread",
    createdAt: "2026-08-25T08:00:00Z"
  }
];

// 8. Simulated SMS Logs
export const initialSmsLogs = [
  {
    id: "sms-001",
    alertId: "alt-001",
    studentId: "stu-200-05",
    recipientName: "Yakubu Idris Birnin-Kudu",
    recipientPhone: "+2348030020005",
    message: "FUD SAMS ALERT: Yakubu Idris (FCP/CSC/22/005), you are in CRITICAL AT-RISK status in CSC 201 (Att: 12.5%, CA: 27.5%). Report to Level Coordinator immediately.",
    status: "DELIVERED (SIMULATED)",
    dispatchedAt: "2026-08-20T10:15:05Z"
  },
  {
    id: "sms-002",
    alertId: "alt-002",
    studentId: "stu-200-09",
    recipientName: "Samuel Olumide Adeyemi",
    recipientPhone: "+2348030020009",
    message: "FUD SAMS ALERT: Samuel Adeyemi (FCP/CSC/22/009), you are in CRITICAL AT-RISK status in CSC 201 (Att: 0%, CA: 22.5%). Please see Mal. Ibrahim Sani.",
    status: "DELIVERED (SIMULATED)",
    dispatchedAt: "2026-08-21T08:30:05Z"
  },
  {
    id: "sms-003",
    alertId: "alt-003",
    studentId: "stu-200-07",
    recipientName: "Mustapha Alkasim Gumel",
    recipientPhone: "+2348030020007",
    message: "FUD SAMS WARNING: Mustapha Gumel (FCP/CSC/22/007), your attendance in CSC 201 is 25.0% (below minimum 60%). Regularize attendance to avoid exam disqualification.",
    status: "DELIVERED (SIMULATED)",
    dispatchedAt: "2026-08-22T14:45:05Z"
  },
  {
    id: "sms-004",
    alertId: "alt-004",
    studentId: "stu-100-03",
    recipientName: "Emmanuel Chukwu",
    recipientPhone: "+2348030010003",
    message: "FUD SAMS ALERT: Emmanuel Chukwu (FCP/CSC/23/003), you are in CRITICAL AT-RISK status in CSC 101 (Att: 12.5%, CA: 32.5%). Contact Dept Coordinator.",
    status: "DELIVERED (SIMULATED)",
    dispatchedAt: "2026-08-23T09:12:05Z"
  }
];
