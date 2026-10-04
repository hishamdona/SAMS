import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Polygon
import os

OUTPUT_DIR = "/Volumes/DevelopmentDrive/development/SAMS/new_diagrams"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Set standard academic typography
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

# -------------------------------------------------------------
# FIGURE 3.1: Agile Scrum Methodology Adapted for SAMS
# -------------------------------------------------------------
# -------------------------------------------------------------
# FIGURE 3.1: System Development Process Flow Diagram (Adapted from SMISHNET Process Model)
# -------------------------------------------------------------
def generate_figure_3_1():
    fig, ax = plt.subplots(figsize=(15, 10.5), dpi=300)
    ax.set_xlim(0, 15)
    ax.set_ylim(0, 11)
    ax.axis('off')

    # Title
    ax.text(7.5, 10.5, "System Development Process Flow and Implementation Phases for SAMS",
            fontsize=15.5, weight='bold', ha='center', color='#0A2540')

    def draw_box(x, y, w, h, text, facecolor, edgecolor, text_color="#0F172A", shape="rect"):
        if shape == "rect":
            patch = patches.Rectangle((x - w/2, y - h/2), w, h, linewidth=1.5,
                                      edgecolor=edgecolor, facecolor=facecolor)
        elif shape == "round":
            patch = FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.15",
                                   linewidth=1.8, edgecolor=edgecolor, facecolor=facecolor)
        elif shape == "hexagon":
            # hexagon points
            d = 0.25 * w
            pts = [
                [x - w/2 + d, y + h/2],
                [x + w/2 - d, y + h/2],
                [x + w/2, y],
                [x + w/2 - d, y - h/2],
                [x - w/2 + d, y - h/2],
                [x - w/2, y]
            ]
            patch = Polygon(pts, closed=True, linewidth=1.8, edgecolor=edgecolor, facecolor=facecolor)
        ax.add_patch(patch)
        ax.text(x, y, text, ha='center', va='center', fontsize=9.2, weight='bold',
                color=text_color, linespacing=1.25)

    def draw_arrow(x1, y1, x2, y2, color="#334155", lw=1.6):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", lw=lw, color=color))

    # ROW 1 (Top: Y = 8.5)
    # Box 1A (Top Left): Stakeholder Interviews
    draw_box(2.0, 9.2, 2.8, 1.1, "STAKEHOLDER INTERVIEWS\n(2 LECTURERS, 2 COORD.,\n& HOD COMPUTER SCIENCE)",
             facecolor="#DCE6F1", edgecolor="#4F81BD", text_color="#1F497D")

    # Box 1B (Bottom Left): Classroom Observation & FUD Handbook
    draw_box(2.0, 7.8, 2.8, 1.1, "CLASSROOM OBSERVATION\n& FUD SENATE ACADEMIC\nREGULATIONS HANDBOOK",
             facecolor="#DCE6F1", edgecolor="#4F81BD", text_color="#1F497D")

    # Merging Arrows to Combined Requirements (x=5.2, y=8.5)
    ax.plot([3.4, 4.0], [9.2, 9.2], color="#334155", lw=1.6)
    ax.plot([3.4, 4.0], [7.8, 7.8], color="#334155", lw=1.6)
    ax.plot([4.0, 4.0], [7.8, 9.2], color="#334155", lw=1.6)
    draw_arrow(4.0, 8.5, 4.4, 8.5)

    # Box 2: Combined Requirements Specification
    draw_box(5.5, 8.5, 2.2, 1.1, "COMBINED\nREQUIREMENTS\nSPECIFICATION",
             facecolor="#FDE9D9", edgecolor="#F79646", text_color="#C0504D")
    draw_arrow(6.6, 8.5, 7.4, 8.5)

    # Box 3: Data Preparation and Schema Modeling
    draw_box(8.5, 8.5, 2.2, 1.1, "DATA ENTITY\nANALYSIS &\nEXPLORATION",
             facecolor="#EBF1DE", edgecolor="#9BBB59", text_color="#4F6228")
    draw_arrow(9.6, 8.5, 10.4, 8.5)

    # Box 4: Normalized Database Schema (3NF)
    draw_box(11.5, 8.5, 2.2, 1.1, "DATABASE\nNORMALIZATION\n(3NF SCHEMA MYSQL)",
             facecolor="#EBF1DE", edgecolor="#9BBB59", text_color="#4F6228")

    # Snake down from Row 1 to Row 2
    # Arrow from Box 4 right edge down to Row 2
    ax.plot([12.6, 13.5], [8.5, 8.5], color="#334155", lw=1.6)
    ax.plot([13.5, 13.5], [8.5, 5.8], color="#334155", lw=1.6)
    draw_arrow(13.5, 5.8, 12.6, 5.8)

    # ROW 2 (Middle: Y = 5.8, flows from right to left)
    # Box 5: Core Architecture Setup
    draw_box(11.5, 5.8, 2.2, 1.1, "CORE ARCHITECTURE\nSETUP (LARAVEL 10\nMVC & BLADE)",
             facecolor="#FDE9D9", edgecolor="#F79646", text_color="#C0504D")
    draw_arrow(10.4, 5.8, 9.6, 5.8)

    # Box 6: Attendance & CA Capture Grid Implementation
    draw_box(8.5, 5.8, 2.2, 1.1, "ATTENDANCE & CA\nDATA CAPTURE\nMODULE GRIDS",
             facecolor="#FFF2CC", edgecolor="#D6B656", text_color="#7F6000")
    draw_arrow(7.4, 5.8, 6.6, 5.8)

    # Box 7: Rule-Based Early Warning Engine
    draw_box(5.5, 5.8, 2.2, 1.1, "RULE-BASED EARLY\nWARNING DECISION\nENGINE (<60% & <40%)",
             facecolor="#FFF2CC", edgecolor="#D6B656", text_color="#7F6000")
    draw_arrow(4.4, 5.8, 3.6, 5.8)

    # Box 8: SMS Gateway & DOMPDF Integration
    draw_box(2.2, 5.8, 2.8, 1.1, "SMS GATEWAY API (TERMII)\n& DOMPDF EXECUTIVE\nREPORT GENERATOR",
             facecolor="#FDE9D9", edgecolor="#F79646", text_color="#C0504D")

    # Snake down from Row 2 to Row 3
    ax.plot([0.8, 0.8], [5.8, 3.0], color="#334155", lw=1.6)
    ax.plot([0.8, 1.0], [5.8, 5.8], color="#334155", lw=1.6)
    draw_arrow(0.8, 3.0, 1.4, 3.0)

    # ROW 3 (Bottom: Y = 3.0, flows from left to right)
    # Box 9: Role-Based Dashboards
    draw_box(2.4, 3.0, 2.0, 1.1, "ROLE-BASED\nDASHBOARDS\n(STUDENT, LECT.,\nCOORD., HOD)",
             facecolor="#E1D5E7", edgecolor="#9673A6", text_color="#5B3878")
    draw_arrow(3.4, 3.0, 4.2, 3.0)

    # Box 10: Black-Box Functional Testing
    draw_box(5.3, 3.0, 2.2, 1.1, "BLACK-BOX\nFUNCTIONAL TESTING\n(100% PASS RATE)",
             facecolor="#EBF1DE", edgecolor="#9BBB59", text_color="#4F6228")
    draw_arrow(6.4, 3.0, 7.2, 3.0)

    # Box 11: System Usability Scale (SUS) Evaluation
    draw_box(8.3, 3.0, 2.2, 1.1, "SYSTEM USABILITY\nSCALE (SUS) SURVEY\n(N=32, SCORE=82.1)",
             facecolor="#EBF1DE", edgecolor="#9BBB59", text_color="#4F6228")
    draw_arrow(9.4, 3.0, 10.3, 3.0)

    # Box 12: Final Result (Hexagon shape in deep green)
    draw_box(11.8, 3.0, 2.8, 1.1, "RESULT OBTAINED:\nDEPLOYED & VERIFIED\nSAMS PLATFORM",
             facecolor="#70AD47", edgecolor="#385723", text_color="#FFFFFF", shape="hexagon")

    # Legend / Note box at very bottom
    note_box = FancyBboxPatch((1.0, 0.6), 13.0, 0.9, boxstyle="round,pad=0.1",
                              facecolor="#F8FAFC", edgecolor="#CBD5E1", linewidth=1.2)
    ax.add_patch(note_box)
    ax.text(7.5, 1.2, "DEVELOPMENT ITERATION CYCLE & REFINEMENT WITH PROJECT SUPERVISOR (MAL. ABDULLAHI ISHAQ)",
            fontsize=9.5, weight='bold', ha='center', color='#0A2540')
    ax.text(7.5, 0.8, "Continuous bi-weekly review meetings conducted within the Department of Computer Science, Federal University Dutse.",
            fontsize=8.5, style='italic', ha='center', color='#475569')

    plt.tight_layout()
    fig.savefig(os.path.join(OUTPUT_DIR, "figure_3_1_methodology.png"), dpi=300)
    plt.close()
    print("Generated figure_3_1_methodology.png in process block diagram style!")


# -------------------------------------------------------------
# FIGURE 3.2: Three-Layer System Architecture of SAMS
# -------------------------------------------------------------
def generate_figure_3_2():
    fig, ax = plt.subplots(figsize=(15, 11), dpi=300)
    ax.set_xlim(0, 15)
    ax.set_ylim(0, 11)
    ax.axis('off')

    # Main Title
    ax.text(7.5, 10.6, "Three-Layer System Architecture of SAMS",
            fontsize=16, weight='bold', ha='center', color='#0A2540')

    # LAYER 1: Presentation Layer
    l1_box = FancyBboxPatch((0.6, 7.3), 13.8, 2.6, boxstyle="round,pad=0.2",
                            facecolor="#F0F9FF", edgecolor="#0284C7", linewidth=2.2)
    ax.add_patch(l1_box)
    ax.text(1.0, 9.45, "1. PRESENTATION LAYER (Client-Side Web Interfaces)",
            fontsize=12, weight='bold', color='#0369A1')
    ax.text(14.0, 9.45, "HTML5 • CSS3 • JavaScript • Bootstrap 5",
            fontsize=9.5, weight='bold', ha='right', color='#0284C7')

    dashboards = [
        ("Course Lecturer Portal", "• Daily attendance register grid\n• CA score entry (Test, Quiz, Assign)\n• Course performance summaries", 0.9),
        ("Level Coordinator Portal", "• 100L/200L cohort surveillance\n• Early-warning risk triage view\n• Manual SMS broadcast triggers", 4.3),
        ("HOD / Administrator Portal", "• Department-wide analytics & stats\n• User & staff account provisioning\n• Official PDF progress download", 7.7),
        ("Student Personal Portal", "• Attendance percentage tracker\n• Continuous assessment breakdown\n• SMS early-warning inbox history", 11.1),
    ]
    for d_title, d_desc, x in dashboards:
        c_box = FancyBboxPatch((x, 7.6), 3.0, 1.6, boxstyle="round,pad=0.1",
                               facecolor="#FFFFFF", edgecolor="#38BDF8", linewidth=1.5)
        ax.add_patch(c_box)
        ax.text(x + 1.5, 8.8, d_title, fontsize=9.2, weight='bold', ha='center', color='#0C4A6E')
        ax.text(x + 0.15, 8.4, d_desc, fontsize=7.6, color='#334155', linespacing=1.3)

    # Communication Space 1
    ax.annotate('', xy=(7.5, 6.75), xytext=(7.5, 7.3),
                arrowprops=dict(arrowstyle="<->", lw=2.2, color="#0A2540"))
    ax.text(7.8, 7.0, "HTTP / HTTPS REST Requests & Form Submissions (JSON / HTML)",
            fontsize=8.8, weight='bold', color='#0F172A', va='center')

    # LAYER 2: Application Layer
    l2_box = FancyBboxPatch((0.6, 3.8), 13.8, 2.75, boxstyle="round,pad=0.2",
                            facecolor="#F8FAFC", edgecolor="#4F46E5", linewidth=2.2)
    ax.add_patch(l2_box)
    ax.text(1.0, 6.15, "2. APPLICATION LAYER (Server-Side Logic Engine & Middleware)",
            fontsize=12, weight='bold', color='#3730A3')
    ax.text(14.0, 6.15, "PHP 8.2 • Laravel 10 MVC Framework",
            fontsize=9.5, weight='bold', ha='right', color='#4F46E5')

    app_modules = [
        ("Authentication & RBAC", "• Session & password encryption (bcrypt)\n• Role-based access control middleware\n• CSRF & XSS protection filters", 0.9, 3.0),
        ("Rule-Based Early Warning Engine", "• Evaluates attendance threshold (<60%)\n• Evaluates CA threshold (<40%)\n• Flags Safe, At-Risk & Critical states", 4.1, 3.6),
        ("SMS Gateway API Dispatcher", "• RESTful HTTP client integration\n• Out-of-band cellular SMS dispatch\n• Delivery logs & recipient queue", 7.9, 3.1),
        ("DOMPDF Report Engine", "• Converts Blade HTML to PDF\n• FUD official letterhead formatting\n• Dossiers for HOD & Coordinators", 11.2, 3.0),
    ]
    for title, desc, mx, mw in app_modules:
        m_box = FancyBboxPatch((mx, 4.05), mw, 1.85, boxstyle="round,pad=0.1",
                               facecolor="#FFFFFF", edgecolor="#818CF8", linewidth=1.5)
        ax.add_patch(m_box)
        ax.text(mx + mw/2, 5.5, title, fontsize=8.8, weight='bold', ha='center', color='#312E81')
        ax.text(mx + 0.15, 5.0, desc, fontsize=7.5, color='#334155', linespacing=1.3)

    # Communication Space 2
    ax.annotate('', xy=(7.5, 3.25), xytext=(7.5, 3.8),
                arrowprops=dict(arrowstyle="<->", lw=2.2, color="#0A2540"))
    ax.text(7.8, 3.5, "Eloquent ORM Queries & SQL Data Transactions (Normalized Relational Access)",
            fontsize=8.8, weight='bold', color='#0F172A', va='center')

    # LAYER 3: Data Layer
    l3_box = FancyBboxPatch((0.6, 0.4), 13.8, 2.65, boxstyle="round,pad=0.2",
                            facecolor="#F0FDF4", edgecolor="#16A34A", linewidth=2.2)
    ax.add_patch(l3_box)
    ax.text(1.0, 2.65, "3. DATA LAYER (Relational Database Management System)",
            fontsize=12, weight='bold', color='#15803D')
    ax.text(14.0, 2.65, "MySQL 8.0 Engine • Normalized to 3NF",
            fontsize=9.5, weight='bold', ha='right', color='#16A34A')

    db_tables = [
        ("users", "id, name, email, role,\npassword, phone, title"),
        ("students", "id, matric_no, name,\nlevel, coord_id, phone"),
        ("courses", "id, course_code, title,\nunits (CCMAS compliance)"),
        ("enrollments", "id, student_id, course_id,\nsession, semester"),
        ("attendances", "id, enrollment_id,\nclass_date, status"),
        ("ca_scores", "id, enrollment_id, test,\nquiz, assign, total_ca"),
        ("risk_alerts", "id, student_id, type,\nseverity, sms_status"),
    ]
    for idx, (t_name, t_fields) in enumerate(db_tables):
        tx = 0.9 + idx * 1.9
        t_box = FancyBboxPatch((tx, 0.65), 1.75, 1.7, boxstyle="round,pad=0.08",
                               facecolor="#FFFFFF", edgecolor="#4ADE80", linewidth=1.2)
        ax.add_patch(t_box)
        ax.text(tx + 0.87, 2.0, t_name, fontsize=8.8, weight='bold', ha='center', color='#14532D')
        ax.text(tx + 0.1, 1.6, t_fields, fontsize=7.0, color='#334155', linespacing=1.25)

    plt.tight_layout()
    fig.savefig(os.path.join(OUTPUT_DIR, "figure_3_2_architecture.png"), dpi=300)
    plt.close()
    print("Generated figure_3_2_architecture.png")

# -------------------------------------------------------------
# FIGURE 3.3: UML Use Case Diagram for SAMS
# -------------------------------------------------------------
def generate_figure_3_3():
    fig, ax = plt.subplots(figsize=(15, 10), dpi=300)
    ax.set_xlim(0, 15)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Title
    ax.text(7.5, 9.6, "UML Use Case Diagram for SAMS User Roles and Module Interactions",
            fontsize=15, weight='bold', ha='center', color='#0A2540')

    # System Boundary Box
    sys_box = FancyBboxPatch((3.8, 0.4), 7.4, 8.9, boxstyle="round,pad=0.1",
                             facecolor="#F8FAFC", edgecolor="#1E293B", linewidth=2.2, linestyle='--')
    ax.add_patch(sys_box)
    ax.text(7.5, 9.0, "Student Academic Monitoring System (SAMS)",
            fontsize=11.5, weight='bold', ha='center', color='#0F172A')

    # Use Cases (Ovals)
    use_cases = [
        ("UC-01: Authenticate / Login", 8.2),
        ("UC-02: Record Daily / Weekly Attendance", 7.3),
        ("UC-03: Input CA Test, Quiz & Assignment Scores", 6.4),
        ("UC-04: Evaluate Early Warning Rules (<60% & <40%)", 5.5),
        ("UC-05: Trigger & Broadcast SMS Risk Alerts", 4.6),
        ("UC-06: View Consolidated Student Risk Profiles", 3.7),
        ("UC-07: Generate & Download Official PDF Reports", 2.8),
        ("UC-08: View Personal Academic Standing & Alerts", 1.9),
        ("UC-09: Manage Users, Courses & Allocations", 1.0),
    ]

    for uc_text, y in use_cases:
        oval = patches.Ellipse((7.5, y), width=6.6, height=0.68,
                               facecolor="#EFF6FF", edgecolor="#2563EB", linewidth=1.5)
        ax.add_patch(oval)
        ax.text(7.5, y, uc_text, fontsize=9.2, weight='bold', ha='center', va='center', color='#1E40AF')

    # Draw Actor Function
    def draw_actor(x, y, name, role_desc):
        ax.add_patch(patches.Circle((x, y + 0.45), 0.22, facecolor="#F1F5F9", edgecolor="#0A2540", linewidth=1.8))
        ax.plot([x, x], [y + 0.23, y - 0.25], color="#0A2540", linewidth=1.8)
        ax.plot([x - 0.35, x + 0.35], [y + 0.08, y + 0.08], color="#0A2540", linewidth=1.8)
        ax.plot([x, x - 0.25], [y - 0.25, y - 0.65], color="#0A2540", linewidth=1.8)
        ax.plot([x, x + 0.25], [y - 0.25, y - 0.65], color="#0A2540", linewidth=1.8)
        ax.text(x, y - 0.9, name, fontsize=10, weight='bold', ha='center', color='#0A2540')
        ax.text(x, y - 1.12, role_desc, fontsize=7.8, style='italic', ha='center', color='#475569')

    # Left Actors: Lecturer & Student
    draw_actor(1.8, 6.8, "Lecturer", "Course Teaching Staff")
    draw_actor(1.8, 2.3, "Student", "100L / 200L Undergrad")

    # Right Actors: Level Coordinator & Administrator (HOD)
    draw_actor(13.2, 6.8, "Level Coordinator", "Cohort Academic Advisor")
    draw_actor(13.2, 2.3, "Administrator (HOD)", "Head of Department & Admin")

    # Association Lines
    # Lecturer -> UC-01, UC-02, UC-03
    ax.plot([2.2, 4.2], [6.8, 8.2], color="#0284C7", linewidth=1.5)
    ax.plot([2.2, 4.2], [6.8, 7.3], color="#0284C7", linewidth=1.5)
    ax.plot([2.2, 4.2], [6.8, 6.4], color="#0284C7", linewidth=1.5)

    # Student -> UC-01, UC-08
    ax.plot([2.2, 4.2], [2.3, 8.2], color="#0D9488", linewidth=1.5)
    ax.plot([2.2, 4.2], [2.3, 1.9], color="#0D9488", linewidth=1.5)

    # Level Coordinator -> UC-01, UC-05, UC-06, UC-07
    ax.plot([12.8, 10.8], [6.8, 8.2], color="#7C3AED", linewidth=1.5)
    ax.plot([12.8, 10.8], [6.8, 4.6], color="#7C3AED", linewidth=1.5)
    ax.plot([12.8, 10.8], [6.8, 3.7], color="#7C3AED", linewidth=1.5)
    ax.plot([12.8, 10.8], [6.8, 2.8], color="#7C3AED", linewidth=1.5)

    # Administrator (HOD) -> UC-01, UC-06, UC-07 (SUPERVISOR CORRECTION: HOD DOWNLOADS PDF!), UC-09
    ax.plot([12.8, 10.8], [2.3, 8.2], color="#DC2626", linewidth=1.6)
    ax.plot([12.8, 10.8], [2.3, 3.7], color="#DC2626", linewidth=1.6)
    ax.plot([12.8, 10.8], [2.3, 2.8], color="#DC2626", linewidth=2.2) # HOD -> UC-07
    ax.plot([12.8, 10.8], [2.3, 1.0], color="#DC2626", linewidth=1.6)

    # Automated Rule Engine trigger annotation
    ax.plot([7.5, 7.5], [5.16, 4.94], color="#B45309", linewidth=1.4, linestyle=":")
    ax.text(7.5, 5.05, "<<triggers>>", fontsize=7.8, style='italic', weight='bold', ha='center', color='#B45309',
            bbox=dict(boxstyle="round,pad=0.1", facecolor="#FFFFFF", edgecolor="none"))

    # Explicit Annotation for HOD PDF Download
    hod_note = FancyBboxPatch((11.4, 4.0), 3.2, 0.75, boxstyle="round,pad=0.1",
                              facecolor="#FEF2F2", edgecolor="#DC2626", linewidth=1.4)
    ax.add_patch(hod_note)
    ax.text(13.0, 4.45, "✔ HOD Official Access:", fontsize=8.2, weight='bold', color='#991B1B', ha='center')
    ax.text(13.0, 4.15, "HOD downloads departmental reports", fontsize=7.5, color='#7F1D1D', ha='center')

    plt.tight_layout()
    fig.savefig(os.path.join(OUTPUT_DIR, "figure_3_3_usecase.png"), dpi=300)
    plt.close()
    print("Generated figure_3_3_usecase.png")

# -------------------------------------------------------------
# FIGURE 3.4: System Operational Flowchart for SAMS
# -------------------------------------------------------------
def generate_figure_3_4():
    fig, ax = plt.subplots(figsize=(12, 15), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 15)
    ax.axis('off')

    # Title
    ax.text(6.0, 14.6, "System Operational Flowchart for SAMS Decision Logic and Alerting",
            fontsize=14, weight='bold', ha='center', color='#0A2540')

    # Helper: Pill (Terminator)
    def draw_terminator(x, y, text, bg="#DCFCE7", border="#16A34A", text_col="#14532D", w=4.2, h=0.65):
        box = FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.25",
                             facecolor=bg, edgecolor=border, linewidth=2.4)
        ax.add_patch(box)
        ax.text(x, y, text, fontsize=9.8, weight='bold', ha='center', va='center', color=text_col)

    # Helper: Rectangle (Process)
    def draw_process(x, y, w, h, text, bg="#F0F9FF", border="#0284C7", text_col="#0C4A6E"):
        box = FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.08",
                             facecolor=bg, edgecolor=border, linewidth=1.8)
        ax.add_patch(box)
        ax.text(x, y, text, fontsize=8.5, weight='bold', ha='center', va='center', color=text_col, linespacing=1.2)

    # Helper: Diamond (Decision)
    def draw_decision(x, y, w, h, text):
        pts = [[x, y + h/2], [x + w/2, y], [x, y - h/2], [x - w/2, y]]
        diamond = Polygon(pts, facecolor="#FEF3C7", edgecolor="#D97706", linewidth=2.2)
        ax.add_patch(diamond)
        ax.text(x, y, text, fontsize=8.2, weight='bold', ha='center', va='center', color='#92400E', linespacing=1.15)

    # Helper: Arrow
    def draw_arrow(x1, y1, x2, y2, label=None, label_pos=None):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", lw=1.8, color="#1E293B"))
        if label:
            lx, ly = label_pos if label_pos else ((x1 + x2)/2, (y1 + y2)/2)
            ax.text(lx, ly, label, fontsize=8.5, weight='bold', color="#DC2626" if "YES" in label else "#16A34A",
                    bbox=dict(boxstyle="round,pad=0.15", facecolor="#FFFFFF", edgecolor="none"))

    # Step 1: START
    draw_terminator(6.0, 13.8, "START: System Launch & Login")
    draw_arrow(6.0, 13.52, 6.0, 12.9)

    # Step 2: Authenticate
    draw_process(6.0, 12.5, 5.6, 0.7, "Authenticate User Credentials via bcrypt\n& Verify RBAC Role (Lecturer/Coordinator/Admin)")
    draw_arrow(6.0, 12.15, 6.0, 11.5)

    # Step 3: Lecturer Data Input
    draw_process(6.0, 11.1, 5.6, 0.7, "Lecturer Data Entry:\nSelect Course & Input Attendance Log or CA Scores")
    draw_arrow(6.0, 10.75, 6.0, 10.1)

    # Step 4: Persist in DB
    draw_process(6.0, 9.7, 5.6, 0.7, "Persist Records in MySQL Relational Database\n(Insert/Update attendances or ca_scores tables)")
    draw_arrow(6.0, 9.35, 6.0, 8.7)

    # Step 5: Compute Metrics
    draw_process(6.0, 8.3, 5.8, 0.7, "Compute Cumulative Academic Metrics:\nAttendance % = (Attended / Total) × 100\nTotal CA = Test (15) + Quiz (15) + Assign (10)")
    draw_arrow(6.0, 7.95, 6.0, 7.3)

    # Step 6: Decision Diamond 1 (Is Attendance < 60% OR CA < 40%?)
    draw_decision(6.0, 6.4, 5.2, 1.6, "Is Attendance < 60%\nOR CA Score < 40%?")

    # Branch NO -> Safe (Right side)
    draw_arrow(8.6, 6.4, 10.2, 6.4, label="NO (Safe)", label_pos=(9.2, 6.65))
    ax.plot([10.2, 10.2], [6.4, 4.2], color="#16A34A", linewidth=1.8)
    draw_process(10.2, 3.7, 2.6, 1.0, "Status: SAFE\n• Normal standing\n• Dashboard updated\n• No warning sent",
                 bg="#F0FDF4", border="#16A34A", text_col="#14532D")

    # Safe joins down to END
    ax.plot([10.2, 10.2], [3.2, 0.8], color="#16A34A", linewidth=1.8)
    ax.annotate('', xy=(7.9, 0.8), xytext=(10.2, 0.8),
                arrowprops=dict(arrowstyle="->", lw=1.8, color="#16A34A"))

    # Branch YES -> Decision Diamond 2
    draw_arrow(6.0, 5.6, 6.0, 4.9, label="YES (At-Risk)", label_pos=(6.85, 5.25))

    # Step 7: Decision Diamond 2 (Both conditions breached?)
    draw_decision(6.0, 4.1, 4.8, 1.5, "Both Conditions Breached?\n(Att < 60% AND CA < 40%)")

    # Branch YES -> Critical At-Risk (Left)
    draw_arrow(3.6, 4.1, 2.2, 4.1, label="YES", label_pos=(2.8, 4.35))
    ax.plot([2.2, 2.2], [4.1, 3.2], color="#DC2626", linewidth=1.8)
    draw_process(2.2, 2.7, 2.6, 1.0, "Classification:\nCRITICAL AT-RISK\n(Severe dual failure;\nUrgent counseling)",
                 bg="#FEF2F2", border="#DC2626", text_col="#991B1B")

    # Branch NO -> Single At-Risk
    draw_arrow(6.0, 3.35, 6.0, 2.6, label="NO", label_pos=(6.4, 3.0))
    draw_process(6.0, 2.2, 3.4, 0.8, "Classification:\nATTENDANCE AT-RISK (if Att < 60%)\nACADEMIC AT-RISK (if CA < 40%)")

    # Recombine Critical & Single to Alert Dispatch
    ax.plot([2.2, 2.2], [2.2, 1.5], color="#DC2626", linewidth=1.8)
    ax.plot([2.2, 6.0], [1.5, 1.5], color="#DC2626", linewidth=1.8)
    ax.annotate('', xy=(6.0, 1.7), xytext=(6.0, 1.8),
                arrowprops=dict(arrowstyle="->", lw=1.8, color="#0A2540"))

    # Alert Dispatch Box (Process)
    draw_process(6.0, 1.4, 7.2, 0.6,
                 "Trigger SMS Gateway API Alert to Student & Level Coordinator\n& Log Risk Incident in MySQL Database",
                 bg="#FEF2F2", border="#DC2626", text_col="#991B1B")

    # Arrow from Alert to END
    draw_arrow(6.0, 1.1, 6.0, 0.95)

    # Step 8: END Terminator (Bold, clearly shown with distinct red border/fill as requested by supervisor!)
    draw_terminator(6.0, 0.58, "END: OPERATION COMPLETED & SESSIONS SYNCHRONIZED",
                    bg="#FEE2E2", border="#DC2626", text_col="#991B1B", w=5.6, h=0.72)

    plt.tight_layout()
    fig.savefig(os.path.join(OUTPUT_DIR, "figure_3_4_flowchart.png"), dpi=300)
    plt.close()
    print("Generated figure_3_4_flowchart.png")


if __name__ == "__main__":
    generate_figure_3_1()
    generate_figure_3_2()
    generate_figure_3_3()
    generate_figure_3_4()
