// import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

// --- TYPE DECLARATIONS (TypeScript) ---

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  setClose: () => void; // 👈 Mới: Hàm để đóng sidebar
}

interface SidebarItemProps {
  icon: string;
  label: string; 
  active?: boolean;
}

// --- CORE COMPONENTS ---

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
}) => (
  <a
    href="#"
    className={`flex items-center p-3 rounded-lg transition duration-200 
      ${
        active
          ? 'bg-teal-500 text-white font-semibold shadow-md'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </a>
);

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => (
  <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md fixed w-full z-30">
    <div className="flex items-center">
      <button
        onClick={toggleSidebar}
        className="p-2 mr-4 text-gray-600 hover:bg-gray-100 rounded-full transition duration-200" // 👈 Hiện trên mọi màn hình
        title={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
      >
        {isSidebarOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        )}
      </button>

      <div className="text-xl font-bold tracking-wider text-teal-600">
        MyApp
      </div>
    </div>
    <nav className="space-x-4">
      <a
        href="#"
        className="text-gray-600 hover:text-teal-600 transition duration-200"
      >
        Dashboard
      </a>
      <a
        href="#"
        className="text-gray-600 hover:text-teal-600 transition duration-200"
      >
        Settings
      </a>
    </nav>
  </header>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setClose }) => ( // 👈 Nhận setClose
  <>
    {/* Overlay */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
        onClick={setClose} // 👈 Thêm hàm đóng
      ></div>
    )}
    
    <aside
      className={`
        w-64 fixed top-0 left-0 bottom-0 
        bg-gray-50 text-gray-800 flex flex-col pt-16 border-r border-gray-200 
        shadow-lg z-20 
        transition-transform duration-300 ease-in-out
        
        // Điều khiển bởi isOpen trên mọi màn hình
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      `}
    >
      <nav className="p-4 space-y-2">
        <SidebarItem icon="🏠" label="Overview" active={true} />
        <SidebarItem icon="📊" label="Analytics" />
        <SidebarItem icon="⚙️" label="Management" />
        <SidebarItem icon="🔔" label="Notifications" />
      </nav>
    </aside>
  </>
);

const DashboardTable: React.FC = () => (
  <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Projects & Status</h3>
    
    <div className="overflow-x-auto"> 
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned To
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress (%)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Update
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Corporate Website Migration
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Completed
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
              High
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              Alice Johnson
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              2025-09-01
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              2025-11-15
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600">
              100%
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              1 day ago
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Mobile App Feature X Launch
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                In Review
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-semibold">
              Medium
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              Bob Williams
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              2025-10-20
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              2026-01-10
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600">
              85%
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              1 hour ago
            </td>
          </tr>
          {[...Array(5)].map((_, index) => (
            <tr key={index + 3} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Marketing Campaign Q1-{index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${index % 3 === 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                  {index % 3 === 0 ? 'Planned' : 'Stalled'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Low
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                User {index + 3}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                2026-01-01
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                2026-03-31
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600">
                {10 + index * 10}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                3 days ago
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const sidebarWidthClass = 'lg:ml-64';

  return (
    <div className="flex min-h-svh flex-col bg-gray-100 text-gray-800">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={isSidebarOpen} setClose={closeSidebar} />

        <main
          className={`
            flex flex-1 flex-col p-8 overflow-y-auto 
            transition-all duration-300 ease-in-out
            ml-0
            ${isSidebarOpen ? sidebarWidthClass : 'lg:ml-0'} 
          `}
        >
          <h2 className="text-3xl font-light mb-6 text-gray-700 border-b border-gray-300 pb-2">
            Main Dashboard
          </h2>

          <DashboardTable />
        </main>
      </div>
    </div>
  );
};

export default App;