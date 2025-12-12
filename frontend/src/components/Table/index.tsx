import { useAppSelector } from '@/app/hooks';
import { Card, CardContent } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

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
  ...[...Array(10)].map((_, index) => ({
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

const TableView: React.FC = () => {
  const { executeSqlCodeData } = useAppSelector((state) => state.sql);

  console.log(executeSqlCodeData);

  return (
    <Card className="mt-6">
      <CardContent>
        <Card className="border border-gray-200 rounded-xl overflow-auto max-h-[600px] p-0">
          <Table className="min-w-full border-separate border-spacing-0">
            <TableHeader className="bg-gray-50 sticky top-0 z-30">
              <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                {/* <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-r border-gray-200">
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
                </TableHead> */}
                {executeSqlCodeData.columns.map((item, i) => (
                  <TableHead
                    key={i}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-r border-gray-200"
                  >
                    {item}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white divide-y divide-gray-200">
              {/* {sampleData.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50 group">
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 bg-white group-hover:bg-gray-50">
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
              ))} */}
              {executeSqlCodeData.data.map((item, i) => (
                <TableRow key={i} className="hover:bg-gray-50 group">
                  {executeSqlCodeData.columns.map((itemChild, i) => (
                    <TableCell
                      key={i}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600 border-r border-gray-200"
                    >
                      {item[itemChild]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </CardContent>
    </Card>
  );
};

export default TableView;
