import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  UserCheck, 
  X, 
  Layers, 
  GraduationCap,
  Calendar
} from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    creditUnits: 3,
    level: 100,
    semester: 'First Semester',
    lecturerId: '',
    description: '',
    totalClassesPlanned: 12
  });

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sams_data_updated', handleUpdate);
    return () => window.removeEventListener('sams_data_updated', handleUpdate);
  }, []);

  const loadData = () => {
    setCourses(courseService.getAll());
    setLecturers(userService.getLecturers());
  };

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      code: '',
      title: '',
      creditUnits: 3,
      level: 100,
      semester: 'First Semester',
      lecturerId: lecturers[0]?.id || '',
      description: '',
      totalClassesPlanned: 12
    });
    setShowModal(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      title: course.title,
      creditUnits: course.creditUnits,
      level: course.level,
      semester: course.semester || 'First Semester',
      lecturerId: course.lecturerId || '',
      description: course.description || '',
      totalClassesPlanned: course.totalClassesPlanned || 12
    });
    setShowModal(true);
  };

  const toast = useToast();
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, code: '', title: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedLecturer = lecturers.find(l => l.id === formData.lecturerId);
    const payload = {
      ...formData,
      lecturerName: selectedLecturer?.name || 'Unassigned'
    };

    if (editingCourse) {
      courseService.update(editingCourse.id, payload);
      toast.success(`Course ${formData.code} updated successfully.`);
    } else {
      courseService.create(payload);
      toast.success(`New course ${formData.code} created and assigned.`);
    }
    setShowModal(false);
    loadData();
  };

  const handleConfirmDelete = () => {
    if (!deleteModal.id) return;
    courseService.delete(deleteModal.id);
    toast.info(`Course ${deleteModal.code} deleted.`);
    setDeleteModal({ open: false, id: null, code: '', title: '' });
    loadData();
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = 
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lecturerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || c.level === Number(levelFilter);
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Course Offerings & Lecturer Allocations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Curriculum management for 100 Level and 200 Level Computer Science.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-fud-900 hover:bg-fud-800 text-white rounded-xl text-xs font-semibold shadow-sm transition self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course code, title, or assigned lecturer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fud-500 focus:border-fud-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Level Filter:</label>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-fud-500"
          >
            <option value="all">All Levels ({courses.length})</option>
            <option value="100">100 Level ({courses.filter(c => c.level === 100).length})</option>
            <option value="200">200 Level ({courses.filter(c => c.level === 200).length})</option>
          </select>
        </div>
      </div>

      {/* Courses Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200 shadow-subtle p-5 hover:shadow-card hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono font-bold text-sm text-fud-900 bg-fud-50 border border-fud-200 px-2.5 py-1 rounded-lg">
                  {c.code}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    {c.level}L
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                    {c.creditUnits} Units
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-sm text-slate-900 mb-1 leading-snug">{c.title}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {c.description || 'Comprehensive foundational coursework for Department of Computer Science.'}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <UserCheck size={14} className="text-fud-500" />
                  <span className="font-medium text-slate-900">{c.lecturerName || 'Unassigned'}</span>
                </div>
                <span className="text-[11px] text-slate-400">Lecturer</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg">
                <div className="flex items-center gap-1 text-[11px]">
                  <Users size={12} className="text-slate-400" />
                  <span><strong>{c.enrolledCount || 12}</strong> Enrolled</span>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <Calendar size={12} className="text-slate-400" />
                  <span><strong>{c.totalClassesPlanned || 12}</strong> Sessions</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-1">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => setDeleteModal({ open: true, id: c.id, code: c.code, title: c.title })}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Delete Course"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                {editingCourse ? `Edit Course: ${editingCourse.code}` : 'Add New Department Course'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSC 207"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Credit Units</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={formData.creditUnits}
                    onChange={(e) => setFormData({ ...formData, creditUnits: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database Management Systems"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 bg-white"
                  >
                    <option value={100}>100 Level</option>
                    <option value={200}>200 Level</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Lecturer</label>
                  <select
                    value={formData.lecturerId}
                    onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 bg-white"
                  >
                    <option value="">-- Choose Lecturer --</option>
                    {lecturers.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Description & Syllabus Summary</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline key topics and syllabus requirements..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-fud-900 hover:bg-fud-800 text-white rounded-lg font-semibold shadow-sm transition"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Course Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, code: '', title: '' })}
        onConfirm={handleConfirmDelete}
        title={`Delete Course: ${deleteModal.code}`}
        description={`Are you sure you want to remove ${deleteModal.code} (${deleteModal.title}) from the curriculum? Enrolled student associations and attendance registers will be detached.`}
        confirmLabel="Delete Course"
        variant="danger"
      />
    </div>
  );
}
