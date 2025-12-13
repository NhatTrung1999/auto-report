import ChartsView from '@/components/Charts';
import ColumnsView from '@/components/Columns';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import NotFound from './NotFound';
import { useAppDispatch } from '@/app/hooks';
import { getCodeID, getColumns } from '@/features/sql/sqlSlice';
import { Toaster } from '@/components/ui/sonner';

const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const codeId = params.get('CodeID');

  useEffect(() => {
    if (codeId) {
      const getSqlData = async () => {
        const res = await dispatch(getCodeID(codeId));

        if (!res.payload?.[0]) return;

        await dispatch(
          getColumns({
            host: res.payload[0]?.Host,
            port: Number(res.payload[0]?.Port),
            username: res.payload[0]?.UserName,
            password: res.payload[0]?.PWD,
            database: res.payload[0]?.DBName,
            SQLCode: res.payload[0]?.SQLCode,
          })
        );
      };
      getSqlData();
    }
  }, [codeId]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const sidebarWidthClass = 'lg:ml-64';

  return (
    <>
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
      <Toaster position="top-right" duration={3000} />
    </>
  );
};

export default AppRoutes;
