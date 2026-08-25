// User Management Service for SAMS
import { storage } from './storage';

export const userService = {
  getAll() {
    return storage.getItem(storage.KEYS.USERS, []);
  },

  getById(id) {
    const users = this.getAll();
    return users.find(u => u.id === id) || null;
  },

  getLecturers() {
    return this.getAll().filter(u => u.role === 'lecturer');
  },

  getCoordinators() {
    return this.getAll().filter(u => u.role === 'coordinator');
  },

  create(userData) {
    const users = this.getAll();
    const newUser = {
      id: `usr-${userData.role}-${Date.now().toString().slice(-4)}`,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      lastLogin: new Date().toISOString(),
      ...userData
    };
    const updated = [newUser, ...users];
    storage.setItem(storage.KEYS.USERS, updated);
    return newUser;
  },

  update(id, userData) {
    const users = this.getAll();
    const updated = users.map(u => u.id === id ? { ...u, ...userData } : u);
    storage.setItem(storage.KEYS.USERS, updated);

    // If active logged-in user was updated, update auth object
    const authUser = storage.getItem(storage.KEYS.AUTH_USER);
    if (authUser && authUser.id === id) {
      storage.setItem(storage.KEYS.AUTH_USER, { ...authUser, ...userData });
    }

    return this.getById(id);
  },

  delete(id) {
    const users = this.getAll();
    const updated = users.filter(u => u.id !== id);
    storage.setItem(storage.KEYS.USERS, updated);
    return true;
  },

  toggleStatus(id) {
    const user = this.getById(id);
    if (!user) return null;
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    return this.update(id, { status: newStatus });
  }
};
