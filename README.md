# Student Academic Monitoring System (SAMS)
### Federal University Dutse (FUD) — Department of Computer Science

> **A Final-Year Undergraduate Academic Early-Warning Decision Support Prototype**  
> *Developed for the Department of Computer Science, Faculty of Computing, Federal University Dutse, Jigawa State, Nigeria.*

---

## 🌟 Executive Overview

The **Student Academic Monitoring System (SAMS)** is an early-warning web application designed to track undergraduate students' lecture attendance and Continuous Assessment (CA) performance in real-time. By applying statutory institutional thresholds, SAMS automatically identifies at-risk students and triggers cellular SMS notifications and counseling interventions before semester examinations.

---

## 🏛️ Statutory Risk Engine Rules

SAMS strictly implements the institutional early-warning classification criteria:

| Risk Classification | Condition / Statutory Rule | Visual Indicator | Recommended Academic Action |
| :--- | :--- | :---: | :--- |
| 🟢 **Safe** | $\text{Attendance} \ge 60\% \text{ AND } \text{CA Score} \ge 40\%$ | Green Badge | Normal academic standing; encourage continued performance. |
| 🟡 **At-Risk (Attendance)** | $\text{Attendance} < 60\% \text{ AND } \text{CA Score} \ge 40\%$ | Amber Badge | Lecture attendance warning; notify student and Level Coordinator. |
| 🟡 **At-Risk (CA)** | $\text{Attendance} \ge 60\% \text{ AND } \text{CA Score} < 40\%$ | Amber Badge | Academic difficulty in coursework; recommend lecturer consultation. |
| 🔴 **Critical At-Risk** | $\text{Attendance} < 60\% \text{ AND } \text{CA Score} < 40\%$ | Red Badge | Severe dual deficiency; immediate coordinator counseling and SMS notice. |

---

## 👥 Demo Personas & Login Credentials

Every role has a 1-click instant login button on the login screen. Password for all accounts is `Password123`:

| Role | Name / Institutional Title | Email Address | Default Password | Monitored Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Prof. A. B. Danbaba | `admin@sams.fud.edu.ng` | `Password123` | HOD Departmental Admin & Settings |
| **Level Coordinator** | Mal. Ibrahim Sani | `coordinator@sams.fud.edu.ng` | `Password123` | 100L & 200L Cohort Surveillance |
| **Course Lecturer** | Dr. M. A. Dutse | `lecturer@sams.fud.edu.ng` | `Password123` | CSC 201 & CSC 101 Courses |
| **Student** | Usman Aminu Ibrahim | `student@sams.fud.edu.ng` | `Password123` | 200L Student (`FCP/CSC/22/001`) |

---

## 🚀 Netlify Deployment Instructions

### Method 1: Netlify Git Continuous Deployment (Recommended)
1. Push this repository to GitHub or GitLab.
2. In your [Netlify Dashboard](https://app.netlify.com/), click **"Add new site"** > **"Import an existing project"**.
3. Select your repository.
4. Netlify will auto-detect settings from `netlify.toml`:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Click **"Deploy site"**.

### Method 2: Netlify CLI
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build the production bundle
npm run build

# 3. Deploy to production
netlify deploy --prod --dir=dist
```

### Method 3: Netlify Drag & Drop
1. Run `npm run build` locally to generate the `dist` folder.
2. Open [Netlify Drop](https://app.netlify.com/drop).
3. Drag and drop the `dist/` directory into your browser.

---

## 🛠️ Technology Stack

- **Core Framework**: React 18 (Vite Bundler)
- **Routing**: React Router DOM (with `_redirects` SPA fallback)
- **Styling**: Tailwind CSS (with custom FUD navy branding `#0A2540`)
- **Visualizations**: Recharts Data Visualization Suite
- **Icons**: Lucide React
- **Data & State**: Zero-Backend `LocalStorage` client persistence with dynamic event dispatchers

---

## 📋 Comprehensive Feature Summary

1. **Authentication & Role-Based Navigation**:
   - Secure persona switcher and route protection guards.
2. **Lecturer Attendance Register**:
   - Interactive date selection, "Mark All Present/Absent", dynamic percentage computation.
3. **Lecturer Continuous Assessment Spreadsheet**:
   - 3-component mark entry (Test 15, Quiz 15, Assignment 10 = Max 40) with automated score clamping.
4. **Level Coordinator Surveillance Dashboard**:
   - Real-time KPI summaries, risk distribution donut chart, weekly attendance progression, and search table.
5. **Interactive Academic Dossier Modal**:
   - Instant multi-course diagnostic drilldown for any student.
6. **Simulated Cellular SMS Gateway**:
   - Real-time logging of student warning SMS alerts with phone numbers and timestamps.
7. **Official Print-Ready Reports**:
   - Individual Student Dossier and Consolidated Departmental Cohort Surveillance Reports with official FUD letterhead.
8. **Student Portal**:
   - Privacy-isolated student dashboard with attendance gauges, CA comparison charts, and early warnings inbox.
9. **Universal Toast & Confirmation Modal Suite**:
   - Accessible feedback on all save, update, and delete actions.

---

## ⚠️ Known MVP Scope & Limitations

1. **Client-Side Persistence**:
   - All data is stored in the browser's `LocalStorage`. Resetting browser storage will return the app to the initial seed dataset (or click "Reset Seed").
2. **Simulated Cellular SMS**:
   - Dispatched SMS alerts are logged and displayed in the SAMS Simulated SMS Gateway instead of sending real cellular packets via paid GSM modems or Twilio APIs.
3. **Institutional Scope**:
   - Configured for 100L and 200L Computer Science undergraduate courses (`CSC 101`–`106`, `CSC 201`–`205`) as specified in the thesis project scope.

---
*Federal University Dutse • Department of Computer Science • Final Year Project Prototype*
