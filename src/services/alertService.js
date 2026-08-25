// Alert & Simulated SMS Service for SAMS
// Department of Computer Science, Federal University Dutse (FUD)
import { storage } from './storage';

export const alertService = {
  getAllAlerts() {
    const alerts = storage.getItem(storage.KEYS.ALERTS, []);
    return alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getAlertsByStudent(studentId) {
    return this.getAllAlerts().filter(a => a.studentId === studentId);
  },

  getUnreadCount() {
    return this.getAllAlerts().filter(a => a.status === 'unread').length;
  },

  markAsRead(alertId) {
    const alerts = storage.getItem(storage.KEYS.ALERTS, []);
    const updated = alerts.map(a => a.id === alertId ? { ...a, status: 'read' } : a);
    storage.setItem(storage.KEYS.ALERTS, updated);
    return true;
  },

  markAllAsRead() {
    const alerts = storage.getItem(storage.KEYS.ALERTS, []);
    const updated = alerts.map(a => ({ ...a, status: 'read' }));
    storage.setItem(storage.KEYS.ALERTS, updated);
    return true;
  },

  deleteAlert(alertId) {
    const alerts = storage.getItem(storage.KEYS.ALERTS, []);
    const updated = alerts.filter(a => a.id !== alertId);
    storage.setItem(storage.KEYS.ALERTS, updated);
    return true;
  },

  /**
   * Generates a risk alert and records a simulated SMS log.
   */
  generateAlertIfNew({
    studentId,
    studentName,
    matricNumber,
    matricNo,
    level,
    courseCode,
    type, // 'Attendance Warning' | 'CA Warning' | 'Critical Academic Warning'
    severity, // 'warning' | 'critical' | 'info'
    message,
    attendancePercentage,
    caPercentage,
    recipient = 'Level Coordinator & Student',
    phone
  }) {
    const alerts = storage.getItem(storage.KEYS.ALERTS, []);
    const matric = matricNo || matricNumber || 'FCP/CSC/22/001';

    // Check if duplicate alert for same student, course, and type exists within 12 hours
    const duplicate = alerts.find(a => 
      a.studentId === studentId && 
      a.courseCode === courseCode && 
      a.type === type &&
      (Date.now() - new Date(a.createdAt).getTime()) < 12 * 60 * 60 * 1000
    );

    if (duplicate) {
      return duplicate;
    }

    // Standardized Message Templates as specified in thesis
    let finalMessage = message;
    if (!finalMessage) {
      if (type.includes('Critical')) {
        finalMessage = `Your attendance (${attendancePercentage || 0}%) and CA (${caPercentage || 0}%) in ${courseCode} are critical. Academic advising is required.`;
      } else if (type.includes('Attendance')) {
        finalMessage = `Your attendance in ${courseCode} is ${attendancePercentage || 0}%, which is below the 60% limit. Please attend classes.`;
      } else {
        finalMessage = `Your CA score in ${courseCode} is ${caPercentage || 0}%, which is below the 40% limit. Please meet your lecturer.`;
      }
    }

    const alertId = `alt-${Date.now().toString().slice(-6)}`;
    const newAlert = {
      id: alertId,
      studentId,
      studentName,
      matricNumber: matric,
      matricNo: matric,
      level,
      courseCode,
      type,
      severity: severity || (type.includes('Critical') ? 'critical' : 'warning'),
      message: finalMessage,
      recipient,
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    const updatedAlerts = [newAlert, ...alerts];
    storage.setItem(storage.KEYS.ALERTS, updatedAlerts);

    // Generate simulated SMS notification
    this.generateSimulatedSms({
      alertId: newAlert.id,
      studentId,
      recipient: studentName,
      recipientName: studentName,
      phone: phone || '+2348030000000',
      recipientPhone: phone || '+2348030000000',
      message: `FUD SAMS ALERT: ${studentName} (${matric}) — ${finalMessage}`
    });

    return newAlert;
  },

  /**
   * Simulated SMS Generator (No real SMS API; logs to LocalStorage)
   */
  generateSimulatedSms({ alertId, studentId, recipient, recipientName, phone, recipientPhone, message }) {
    const logs = storage.getItem(storage.KEYS.SMS_LOGS, []);
    const smsId = `sms-${Date.now().toString().slice(-6)}`;
    const recName = recipientName || recipient || 'Student';
    const recPhone = recipientPhone || phone || '+2348030000000';
    
    const newLog = {
      id: smsId,
      alertId: alertId || null,
      studentId,
      recipient: recName,
      recipientName: recName,
      phone: recPhone,
      recipientPhone: recPhone,
      message,
      status: 'Simulated',
      deliveryStatus: 'DELIVERED (SIMULATED)',
      gateway: 'FUD SAMS Gateway (Simulation)',
      createdAt: new Date().toISOString(),
      dispatchedAt: new Date().toISOString()
    };

    const updatedLogs = [newLog, ...logs];
    storage.setItem(storage.KEYS.SMS_LOGS, updatedLogs);
    return newLog;
  },

  getAllSmsLogs() {
    const logs = storage.getItem(storage.KEYS.SMS_LOGS, []);
    return logs.sort((a, b) => new Date(b.dispatchedAt || b.createdAt) - new Date(a.dispatchedAt || a.createdAt));
  },

  getSmsLogsByStudent(studentId) {
    return this.getAllSmsLogs().filter(s => s.studentId === studentId);
  },

  /**
   * Coordinator Intervention Log
   */
  logIntervention({ studentId, studentName, matricNumber, coordinatorName, actionType, notes, followUpDate }) {
    const interventions = storage.getItem(storage.KEYS.INTERVENTIONS, []);
    const newIntervention = {
      id: `int-${Date.now().toString().slice(-6)}`,
      studentId,
      studentName,
      matricNumber,
      coordinatorName: coordinatorName || 'Mal. Ibrahim Sani',
      actionType, // 'Counseling Session' | 'Parent Contacted' | 'Assigned Tutorial' | 'Official Warning Letter'
      notes,
      followUpDate,
      createdAt: new Date().toISOString()
    };

    const updated = [newIntervention, ...interventions];
    storage.setItem(storage.KEYS.INTERVENTIONS, updated);
    return newIntervention;
  },

  getAllInterventions() {
    const list = storage.getItem(storage.KEYS.INTERVENTIONS, []);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};
