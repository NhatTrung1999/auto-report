import CollapsibleSidebarItem from './CollapsibleSidebarItem';
import SidebarItem from './SidebarItem';
import { TableIcon, PieChartIcon } from '../../assets/icons';
import { useLocation } from 'react-router';

interface SidebarProps {
  isOpen: boolean;
  setClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setClose }) => {
  const location = useLocation();

  const chartOptions = [
    { path: '/charts/line', label: 'Line' },
    { path: '/charts/bar', label: 'Bar' },
    { path: '/charts/pie', label: 'Pie' },
    { path: '/charts/scatter', label: 'Scatter' },
  ]

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
          onClick={setClose}
        ></div>
      )}

      <aside
        className={`
                w-64 fixed top-0 left-0 bottom-0 
                bg-gray-50 text-gray-800 flex flex-col pt-16 border-r border-gray-200 
                shadow-lg z-20 
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            `}
      >
        <nav className="p-4 space-y-2">
          <SidebarItem
            icon={<TableIcon />}
            label="Columns View"
            to={`/${location.search}`}
          />

          <CollapsibleSidebarItem
            icon={<PieChartIcon />}
            label="Charts View"
            children={chartOptions}
          />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
