import ChartsView from '@/components/Charts';
import ColumnsView from '@/components/Columns';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import NotFound from './NotFound';

const AppRoutes: React.FC = () => {
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
          <Routes>
            <Route path="/" element={<ColumnsView />} />
            <Route path="/charts/:type" element={<ChartsView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AppRoutes;
