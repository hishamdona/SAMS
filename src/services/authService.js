// Mock Authentication Service for SAMS
import { storage } from './storage';

export const authService = {
  getCurrentUser() {
    return storage.getItem(storage.KEYS.AUTH_USER, null);
  },

  getAllUsers() {
    return storage.getItem(storage.KEYS.USERS, []);
  },

  login(email, password) {
    const users = this.getAllUsers();
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (user) {
      const authUser = { ...user, lastLogin: new Date().toISOString() };
      storage.setItem(storage.KEYS.AUTH_USER, authUser);
      return { success: true, user: authUser };
    }

    return { success: false, error: 'Invalid email or password. Use demo credentials or 1-click login.' };
  },

  demoLogin(role) {
    const users = this.getAllUsers();
    const user = users.find(u => u.role === role);
    if (user) {
      const authUser = { ...user, lastLogin: new Date().toISOString() };
      storage.setItem(storage.KEYS.AUTH_USER, authUser);
      return { success: true, user: authUser };
    }
    return { success: false, error: `No demo account found for role ${role}` };
  },

  logout() {
    localStorage.removeItem(storage.KEYS.AUTH_USER);
    storage.notifyStateChange(storage.KEYS.AUTH_USER, null);
  },

  switchUserById(userId) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      storage.setItem(storage.KEYS.AUTH_USER, user);
      return { success: true, user };
    }
    return { success: false, error: 'User not found' };
  },

  updateProfile(updatedData) {
    const current = this.getCurrentUser();
    if (!current) return { success: false, error: 'Not logged in' };

    const users = this.getAllUsers();
    const updatedUsers = users.map(u => u.id === current.id ? { ...u, ...updatedData } : u);
    storage.setItem(storage.KEYS.USERS, updatedUsers);

    const newAuthUser = { ...current, ...updatedData };
    storage.setItem(storage.KEYS.AUTH_USER, newAuthUser);
    return { success: true, user: newAuthUser };
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  getRoleHomePath(role) {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'lecturer':
        return '/lecturer/dashboard';
      case 'coordinator':
        return '/coordinator/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/login';
    }
  }
};
