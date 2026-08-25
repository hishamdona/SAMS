import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import DemoSwitcher from '../components/common/DemoSwitcher';
import SmsSimulatorModal from '../components/common/SmsSimulatorModal';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Demo Helper Bar for Supervisor Presentation */}
      <DemoSwitcher onOpenSmsModal={() => setSmsModalOpen(true)} />

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <Navbar
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onOpenSmsModal={() => setSmsModalOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet context={{ openSmsModal: () => setSmsModalOpen(true) }} />
          </main>
        </div>
      </div>

      {/* Global Simulated SMS Notification Log Modal */}
      <SmsSimulatorModal
        isOpen={smsModalOpen}
        onClose={() => setSmsModalOpen(false)}
      />
    </div>
  );
}
