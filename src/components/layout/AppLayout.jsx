import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="md:hidden">
        <MobileNav />
      </div>
      <main className="md:ml-[240px] p-4 md:p-6 lg:p-8 min-h-screen pt-16 md:pt-4">
        <Outlet />
      </main>
    </div>
  );
}