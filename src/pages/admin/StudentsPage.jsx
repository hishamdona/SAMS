import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import RiskBadge from '../../components/common/RiskBadge';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { 
  GraduationCap, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  FileText, 
  X, 
  Phone, 
  Mail, 
  BookOpen,
  ArrowUpDown
} from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Student form state
  const [formData, setFormData] = useState({
    matricNumber: '',
    name: '',
    gender: 'Male',
    level: 100,
    phone: '',
    email: '',
    stateOfOrigin: 'Jigawa',
    advisor: 'Mal. Ibrahim Sani'
  });

  useEffect(() => {
    loadStudents();
    const handleUpdate = () => loadStudents();
    window.addEventListener('sams_data_updated', handleUpdate);
    return () => window.removeEventListener('sams_data_updated', handleUpdate);
  }, []);

  const loadStudents = () => {
    setStudents(studentService.getAllWithRiskMetrics('all'));
  };

  const handleOpenCreate = () => {
    setEditingStudent(null);
    const nextNum = (students.length + 1).toString().padStart(3, '0');
    setFormData({
      matricNumber: `FCP/CSC/23/${nextNum}`,
      name: '',
      gender: 'Male',
      level: 100,
      phone: '+23480',
      email: '',
      stateOfOrigin: 'Jigawa',
      advisor: 'Mal. Ibrahim Sani'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (stu) => {
    setEditingStudent(stu);
    setFormData({
      matricNumber: stu.matricNumber,
      name: stu.name,
      gender: stu.gender || 'Male',
      level: stu.level,
      phone: stu.phone || '',
      email: stu.email || '',
      stateOfOrigin: stu.stateOfOrigin || 'Jigawa',
      advisor: stu.advisor || 'Mal. Ibrahim Sani'
    });
    setShowModal(true);
  };

  const toast = useToast();
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '', matric: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      studentService.update(editingStudent.id, formData);
      toast.success(`Student record for ${formData.name} updated successfully.`);
    } else {
      studentService.create(formData);
      toast.success(`Student ${formData.name} registered successfully.`);
    }
    setShowModal(false);
    loadStudents();
  };

  const handleConfirmDelete = () => {
    if (!deleteModal.id) return;
    studentService.delete(deleteModal.id);
    toast.info(`Student ${deleteModal.name} removed from registry.`);
    setDeleteModal({ open: false, id: null, name: '', matric: '' });
    loadStudents();
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.matricNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || s.level === Number(levelFilter);
    const matchesStatus = statusFilter === 'all' || s.riskStatus === statusFilter;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Student Directory & Academic Records</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered 100 Level and 200 Level Computer Science students with live risk diagnostics.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-fud-900 hover:bg-fud-800 text-white rounded-xl text-xs font-semibold shadow-sm transition self-start sm:self-auto"
        >
          <UserPlus size={15} />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or matric number (e.g. FCP/CSC/22/001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fud-500 focus:border-fud-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Level:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-fud-500"
            >
              <option value="all">All Levels</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Risk Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-fud-500"
            >
              <option value="all">All Standings</option>
              <option value="Safe">Safe</option>
              <option value="At-Risk">At-Risk</option>
              <option value="Critical At-Risk">Critical At-Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student & Matric No.</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Avg CA Score</th>
                <th className="py-3 px-4">Risk Status</th>
                <th className="py-3 px-4">Enrolled Courses</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No student records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-fud-50 text-fud-800 border border-fud-200 flex items-center justify-center font-bold text-xs shrink-0">
                          {stu.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{stu.name}</div>
                          <div className="text-[11px] text-fud-700 font-mono font-medium">{stu.matricNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                        {stu.level} Level
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              stu.attendancePercentage < 60 ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, stu.attendancePercentage)}%` }}
                          ></div>
                        </div>
                        <span className={`font-semibold text-[11px] ${
                          stu.attendancePercentage < 60 ? 'text-rose-600 font-bold' : 'text-slate-700'
                        }`}>
                          {stu.attendancePercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              stu.caPercentage < 40 ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, stu.caPercentage)}%` }}
                          ></div>
                        </div>
                        <span className={`font-semibold text-[11px] ${
                          stu.caPercentage < 40 ? 'text-rose-600 font-bold' : 'text-slate-700'
                        }`}>
                          {stu.caPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge status={stu.riskStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      <div className="flex items-center gap-1">
                        <BookOpen size={12} className="text-slate-400" />
                        <span>{(stu.enrolledCourses || []).length} Courses</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/coordinator/reports?student=${stu.id}`}
                          className="p-1.5 text-slate-500 hover:text-fud-600 hover:bg-slate-100 rounded-lg transition"
                          title="View Full Academic Dossier Report"
                        >
                          <FileText size={14} />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(stu)}
                          className="p-1.5 text-slate-500 hover:text-fud-600 hover:bg-slate-100 rounded-lg transition"
                          title="Edit Student Record"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: stu.id, name: stu.name, matric: stu.matricNumber || stu.matricNo })}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                {editingStudent ? `Edit Student: ${editingStudent.name}` : 'Register New Student'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Matriculation Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FCP/CSC/22/001"
                    value={formData.matricNumber}
                    onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 bg-white"
                  >
                    <option value={100}>100 Level</option>
                    <option value={200}>200 Level</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name (Surname First)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Garba Usman Aliyu"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State of Origin</label>
                  <input
                    type="text"
                    placeholder="e.g. Jigawa"
                    value={formData.stateOfOrigin}
                    onChange={(e) => setFormData({ ...formData, stateOfOrigin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number (For SMS)</label>
                  <input
                    type="text"
                    required
                    placeholder="+2348012345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="student@sams.fud.edu.ng"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500"
                  />
                </div>
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
                  {editingStudent ? 'Update Record' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Student Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, name: '', matric: '' })}
        onConfirm={handleConfirmDelete}
        title={`Delete Student Record: ${deleteModal.name}`}
        description={`Are you sure you want to delete the academic record for ${deleteModal.name} (${deleteModal.matric})? This will remove all associated course enrollments, test marks, and attendance records.`}
        confirmLabel="Delete Student"
        variant="danger"
      />
    </div>
  );
}
