import React, { useState, type ReactNode } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { TableIcon, PieChartIcon } from './assets/icons';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table';
import { Card, CardContent } from './components/ui/card';
import { ChartBarView } from './components/Charts/ChartBarView';
import { ChartLineView } from './components/Charts/ChartLineView';
import { ChartPieView } from './components/Charts/ChartPieView';
import { ChartScatterView } from './components/Charts/ChartScatterView';

// // Tạo placeholder đơn giản cho Scatter vì chưa có import
// const ChartScatterView: React.FC = () => (
//   <div className="flex items-center justify-center h-64 w-full bg-purple-50 border border-purple-400 rounded-lg text-purple-800 font-semibold">
//     <p>SCATTER CHART (Placeholder)</p>
//   </div>
// );

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  setClose: () => void;
}

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  to: string;
}

interface CollapsibleItemProps {
  icon: ReactNode;
  label: string;
  children: { label: string; path: string }[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center p-3 rounded-lg transition duration-200 
      ${
        active
          ? 'bg-gray-700 text-white font-semibold shadow-md'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

const CollapsibleSidebarItem: React.FC<CollapsibleItemProps> = ({
  icon,
  label,
  children,
}) => {
  const location = useLocation();
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [currentChartType, setCurrentChartType] = useState('');

  const isAnyChildActive = children.some((child) =>
    location.pathname.startsWith(child.path)
  );

  const [isMenuOpen, setIsMenuOpen] = useState(isAnyChildActive);

  React.useEffect(() => {
    if (isAnyChildActive && !isMenuOpen) {
      setIsMenuOpen(true);
    } else if (
      isMenuOpen &&
      !children.some((child) => location.pathname === child.path)
    ) {
    }
  }, [location.pathname]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen((prev) => !prev);
  };

  // const openPropertiesDialog = (type: string, e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setCurrentChartType(type);
  //   setIsDialogOpen(true);
  // };

  // const closePropertiesDialog = () => {
  //   setIsDialogOpen(false);
  //   setCurrentChartType('');
  // };

  return (
    <div>
      <a
        href="#"
        onClick={toggleMenu}
        className="flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
      >
        <span className="flex items-center">
          <span className="mr-3">{icon}</span>
          {label}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isMenuOpen ? 'rotate-90' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </a>

      <div
        className={`pl-8 pt-1 pb-1 space-y-1 overflow-hidden 
          transition-all duration-300 ease-in-out
          ${
            isMenuOpen
              ? 'max-h-96 opacity-100 translate-y-0'
              : 'max-h-0 opacity-0 -translate-y-2.5'
          }`}
      >
        {children.map((child) => {
          const isActiveChild = location.pathname === child.path;
          return (
            <div
              key={child.path}
              className="flex items-center justify-between group"
            >
              <Link
                to={child.path}
                className={`block grow p-2 rounded-lg text-sm transition duration-200
                  ${
                    isActiveChild
                      ? 'bg-gray-700 text-white font-semibold'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {child.label}
              </Link>

              {/* <button
                onClick={(e) => openPropertiesDialog(child.label, e)}
                className={`ml-2 p-1 rounded-md text-xs font-medium transition duration-150 
                  ${
                    isActiveChild
                      ? 'text-white bg-gray-600 hover:bg-gray-800'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
                title={`Properties for ${child.label} Chart`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button> */}
            </div>
          );
        })}
      </div>

      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Properties: {currentChartType} Chart</DialogTitle>
          </DialogHeader>

          <form>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Chart Type Options</Label>
                <div className="rounded-2xl border border-gray-200 bg-white h-[100px] p-2 overflow-y-auto no-scrollbar flex flex-col gap-2">
                  <p className="text-sm text-gray-500">
                    Tùy chỉnh trục X, Y, Series cho {currentChartType}.
                  </p>
                </div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Data Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Source</SelectLabel>
                      <SelectItem value="data_1">Data Set 1</SelectItem>
                      <SelectItem value="data_2">Data Set 2</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closePropertiesDialog}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Apply Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => (
  <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md fixed w-full z-30">
    <div className=" flex-1 flex items-center justify-between">
      <button
        onClick={toggleSidebar}
        className="p-2 mr-4 text-gray-600 hover:bg-gray-100 rounded-full transition duration-200"
        title={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
      >
        {isSidebarOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        )}
      </button>

      <div className="text-xl font-bold tracking-wider text-teal-600">
        Auto Report
      </div>
    </div>
  </header>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setClose }) => {
  const chartOptions = [
    { path: '/charts/line', label: 'Line' },
    { path: '/charts/bar', label: 'Bar' },
    { path: '/charts/pie', label: 'Pie' },
    { path: '/charts/scatter', label: 'Scatter' },
  ];

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
          <SidebarItem icon={<TableIcon />} label="Columns View" to="/" />

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

const sampleData = [
  {
    name: 'Corporate Website Migration',
    status: 'Completed',
    statusClass: 'bg-green-100 text-green-800',
    priority: 'High',
    priorityClass: 'text-red-600',
    assigned: 'Alice Johnson',
    startDate: '2025-09-01',
    dueDate: '2025-11-15',
    progress: '100%',
    lastUpdate: '1 day ago',
  },
  {
    name: 'Mobile App Feature X Launch',
    status: 'In Review',
    statusClass: 'bg-yellow-100 text-yellow-800',
    priority: 'Medium',
    priorityClass: 'text-orange-600',
    assigned: 'Bob Williams',
    startDate: '2025-10-20',
    dueDate: '2026-01-10',
    progress: '85%',
    lastUpdate: '1 hour ago',
  },
  ...[...Array(5)].map((_, index) => ({
    name: `Marketing Campaign Q1-${index + 1}`,
    status: index % 3 === 0 ? 'Planned' : 'Stalled',
    statusClass:
      index % 3 === 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800',
    priority: 'Low',
    priorityClass: 'text-gray-500',
    assigned: `User ${index + 3}`,
    startDate: '2026-01-01',
    dueDate: '2026-03-31',
    progress: `${10 + index * 10}%`,
    lastUpdate: '3 days ago',
  })),
];

const DashboardTable: React.FC = () => (
  <Card className="mt-6">
    <CardContent>
      <div className="border border-gray-200 rounded-xl overflow-auto max-h-[400px]">
        <Table className="min-w-full border-separate border-spacing-0">
          <TableHeader className="bg-gray-50 sticky top-0 z-30">
            <TableRow className="hover:bg-gray-50 border-b border-gray-200">
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 top-0 bg-gray-50 z-40 border-r border-gray-200">
                Project Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Priority
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Assigned To
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Start Date
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Due Date
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Progress (%)
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Update
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="bg-white divide-y divide-gray-200">
            {sampleData.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50 group">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                  {item.name}
                </TableCell>

                <TableCell className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.statusClass}`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell
                  className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${item.priorityClass} border-r border-gray-200`}
                >
                  {item.priority}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                  {item.assigned}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                  {item.startDate}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                  {item.dueDate}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600 border-r border-gray-200">
                  {item.progress}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.lastUpdate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

const ColumnsView: React.FC = () => {
  return (
    <>
      <h2 className="text-3xl font-light mb-6 text-gray-700 border-b border-gray-300 pb-2">
        Columns View
      </h2>
      <div className="flex items-center justify-end">
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="outline">Auto columns</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Auto columns</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Excel Functions</Label>
                  <div className="rounded-2xl border border-gray-200 bg-white h-[170px] p-2 overflow-y-auto no-scrollbar flex flex-col gap-2"></div>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Option</SelectLabel>
                        <SelectItem value="NONE">NONE</SelectItem>
                        <SelectItem value="SUM">SUM</SelectItem>
                        <SelectItem value="AVERAGE">AVERAGE</SelectItem>
                        <SelectItem value="MAX">MAX</SelectItem>
                        <SelectItem value="MIN">MIN</SelectItem>
                        <SelectItem value="TOPN">TOP N</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Clause</Label>
                  <div className="rounded-2xl border border-gray-200 bg-white h-[170px] p-2 overflow-y-auto no-scrollbar flex flex-col gap-2"></div>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Option</SelectLabel>
                        <SelectItem value="NONE">NONE</SelectItem>
                        <SelectItem value="GROUPBY">GROUP BY</SelectItem>
                        <SelectItem value="ORDERBY">ORDER BY</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
      <DashboardTable />
    </>
  );
};

const ChartsView: React.FC = () => {
  const location = useLocation();
  // Lấy loại biểu đồ từ URL
  const chartType = location.pathname.split('/').pop();

  let title = 'Charts View';
  // ChartComponent sẽ là component thực tế được render
  let ChartComponent: React.FC | null = null;

  if (chartType && chartType !== 'none') {
    const typeLabel = chartType.charAt(0).toUpperCase() + chartType.slice(1);
    title = `${typeLabel} Chart`;

    switch (chartType) {
      case 'line':
        ChartComponent = ChartLineView;
        break;
      case 'bar':
        ChartComponent = ChartBarView;
        break;
      case 'pie':
        ChartComponent = ChartPieView;
        break;
      case 'scatter':
        ChartComponent = ChartScatterView;
        break;
      default:
        title = 'Chart Type Not Found';
        ChartComponent = null;
        break;
    }
  } else {
    title = 'No visualization selected';
  }

  return (
    <>
      <h2 className="text-3xl font-light mb-6 text-gray-700 border-b border-gray-300 pb-2">
        {title}
      </h2>
      <div className="flex items-center justify-end">
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="outline">Properties</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Properties</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">X Axis</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Option</SelectLabel>
                        <SelectItem value="NONE">NONE</SelectItem>
                        <SelectItem value="SUM">SUM</SelectItem>
                        <SelectItem value="AVERAGE">AVERAGE</SelectItem>
                        <SelectItem value="MAX">MAX</SelectItem>
                        <SelectItem value="MIN">MIN</SelectItem>
                        <SelectItem value="TOPN">TOP N</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Y Axis</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Option</SelectLabel>
                        <SelectItem value="NONE">NONE</SelectItem>
                        <SelectItem value="GROUPBY">GROUP BY</SelectItem>
                        <SelectItem value="ORDERBY">ORDER BY</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
      <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>

        {/* Render Component được chọn. W-full để đảm bảo nó lấp đầy div cha */}
        {ChartComponent ? (
          <div className="w-full">
            <ChartComponent />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-100 border border-dashed border-gray-400 rounded-lg text-gray-600">
            {title === 'No visualization selected'
              ? 'Please select a chart type from the Charts View menu in the sidebar.'
              : 'Error: Cannot render chart component.'}
          </div>
        )}
      </div>
    </>
  );
};

const AppContent: React.FC = () => {
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
            <Route
              path="*"
              element={
                <div className="mt-6 p-8 bg-red-100 text-red-800 rounded-xl">
                  404: Page not found
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
