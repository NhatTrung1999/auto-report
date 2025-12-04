import { Button } from "@/components/ui/button";
import React, { useState } from 'react';

// --- TYPE DECLARATIONS (TypeScript) ---

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItemProps {
  icon: string;
  label: string; // Updated label to English
  active?: boolean;
}

// --- CORE COMPONENTS ---

// 1. Sidebar Item Component
const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active = false }) => (
  <a 
    href="#"
    className={`flex items-center p-3 rounded-lg transition duration-200 
      ${active 
        ? 'bg-teal-500 text-white font-semibold shadow-md'
        : 'text-gray-700 hover:bg-gray-100'
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    {label}
  </a>
);

// 2. HEADER Component (Labels updated to English)
const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => (
  <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md fixed w-full z-20">
    <div className="flex items-center">
      {/* Button to toggle the sidebar */}
      <button 
        onClick={toggleSidebar} 
        className="p-2 mr-4 text-gray-600 hover:bg-gray-100 rounded-full transition duration-200"
        title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        {/* Toggle Icon */}
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
      {/* English Navigation Links */}
      <a href="#" className="text-gray-600 hover:text-teal-600 transition duration-200">Dashboard</a>
      <a href="#" className="text-gray-600 hover:text-teal-600 transition duration-200">Settings</a>
    </nav>
  </header>
);

// 3. SIDEBAR Component (Fixed position with Translate animation)
const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => (
  <aside 
    className={`
      w-64 fixed top-0 left-0 bottom-0 
      bg-gray-50 text-gray-800 flex flex-col pt-16 border-r border-gray-200 
      shadow-lg z-10 
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    `}
  >
    <nav className="p-4 space-y-2">
      {/* English Sidebar Items */}
      <SidebarItem icon="🏠" label="Overview" active={true} />
      <SidebarItem icon="📊" label="Analytics" />
      <SidebarItem icon="⚙️" label="Management" />
      <SidebarItem icon="🔔" label="Notifications" />
    </nav>
  </aside>
);

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  const sidebarWidthClass = 'ml-64'; 

  return (
    <div className="flex min-h-svh flex-col bg-gray-100 text-gray-800">
      
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} /> 
      
      <div className="flex flex-1 pt-16">
        
        <Sidebar isOpen={isSidebarOpen} />
        
        {/* MAIN CONTENT (Offset by Sidebar width) */}
        <main 
          className={`
            flex flex-1 flex-col p-8 overflow-y-auto 
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? sidebarWidthClass : 'ml-0'} 
          `}
        >
          
          {/* English Main Title */}
          <h2 className="text-3xl font-light mb-6 text-gray-700 border-b border-gray-300 pb-2">Main Dashboard</h2>

          <div className="flex flex-1 items-center justify-center border border-dashed border-gray-300 rounded-xl p-10 bg-white shadow-sm">
            {/* English Button Text */}
            <Button className="px-8 py-4 text-lg bg-teal-500 hover:bg-teal-600 transition duration-300 shadow-lg">
                🚀 Get Started
            </Button>
          </div>
          
        </main>
      </div>

    </div>
  )
}

export default App;