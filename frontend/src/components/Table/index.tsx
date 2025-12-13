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
import { Skeleton } from '../ui/skeleton';

const TableSkeleton: React.FC = () => (
  <TableBody>
    {[...Array(5)].map((_, rowIndex) => (
      <TableRow key={rowIndex} className="hover:bg-gray-50">
        {[...Array(4)].map((_, cellIndex) => (
          <TableCell key={cellIndex} className="px-6 py-4 whitespace-nowrap">
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

const formatDateValue = (value: any): string | any => {
  if (typeof value === 'string' && value.includes('T')) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return value.split('T')[0];
      }
    } catch (e) {
      console.log(e);
    }
  }
  return value;
};

const TableView: React.FC = () => {
  const { executeSqlCodeData, loading } = useAppSelector((state) => state.sql);

  const hasData =
    executeSqlCodeData?.data && executeSqlCodeData.data.length > 0;
  const hasColumns =
    executeSqlCodeData?.columns && executeSqlCodeData.columns.length > 0;

  return (
    <Card className="mt-6">
      <CardContent>
        <Card className="border border-gray-200 rounded-xl overflow-auto max-h-[600px] p-0">
          <Table className="min-w-full border-separate border-spacing-0">
            <TableHeader className="bg-gray-50 sticky top-0 z-30">
              <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                {/* {executeSqlCodeData.columns.map((item, i) => (
                  <TableHead
                    key={i}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-r border-gray-200"
                  >
                    {item}
                  </TableHead>
                ))} */}
                {loading || hasColumns ? (
                  executeSqlCodeData.columns.map((item, i) => (
                    <TableHead
                      key={i}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-r border-gray-200"
                    >
                      {item}
                    </TableHead>
                  ))
                ) : (
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            {loading ? (
              <TableSkeleton />
            ) : hasData ? (
              <TableBody className="bg-white divide-y divide-gray-200">
                {executeSqlCodeData.data.map((item, i) => (
                  <TableRow key={i} className="hover:bg-gray-50 group">
                    {executeSqlCodeData.columns.map((itemChild, i) => (
                      <TableCell
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600 border-r border-gray-200"
                      >
                        {formatDateValue(item[itemChild])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={executeSqlCodeData.columns.length || 1}
                    className="h-24 text-center text-gray-500"
                  >
                    No results returned.
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {/* <TableBody className="bg-white divide-y divide-gray-200">
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
            </TableBody> */}
          </Table>
        </Card>
      </CardContent>
    </Card>
  );
};

export default TableView;
