import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { Input } from '../ui/input';
import { setSearchTerm, updateFilteredData } from '@/features/sql/sqlSlice';

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

const formatDateValue = (value: any): any => {
  if (typeof value === 'string' && value.includes('T')) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return value.replace('T', ' ').replace('.000Z', '');
    }
  }
  return value;
};

const TableView: React.FC = () => {
  const { executeSqlCodeData, loading, searchTerm } = useAppSelector(
    (state) => state.sql
  );
  const dispatch = useAppDispatch();

  const rawData = executeSqlCodeData?.data || [];
  const columns = executeSqlCodeData?.columns || [];

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (column: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === column &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });
  };

  const sortedData = [...rawData].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
    if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

    const aNum = Number(aValue);
    const bNum = Number(bValue);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    return sortConfig.direction === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const filteredData = sortedData.filter((row) =>
    columns.some((col) => {
      const cellValue = row[col.name];
      if (cellValue == null) return false;
      return String(cellValue).toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  useEffect(() => {
    dispatch(updateFilteredData(filteredData));
  }, [dispatch, searchTerm]);

  const hasData = filteredData.length > 0;
  const hasColumns = columns.length > 0;
  // const hasData =
  //   executeSqlCodeData?.data && executeSqlCodeData.data.length > 0;
  // const hasColumns =
  //   executeSqlCodeData?.columns && executeSqlCodeData.columns.length > 0;

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Columns View</CardTitle>
        <Input
          type="text"
          placeholder="Searching..."
          className="w-[200px]"
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        />
      </CardHeader>
      <CardContent>
        <Card className="border border-gray-200 rounded-xl overflow-auto max-h-[500px] p-0">
          <Table className="min-w-full border-separate border-spacing-0">
            <TableHeader className="bg-gray-50 sticky top-0 z-30">
              <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                {loading || hasColumns ? (
                  columns.map((column, i) => {
                    const isSorted = sortConfig?.key === column.name;
                    const isAsc = isSorted && sortConfig?.direction === 'asc';
                    // const isDesc = isSorted && sortConfig?.direction === 'desc';
                    return (
                      <TableHead
                        key={i}
                        className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-r border-gray-200"
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                              <span>{column.name}</span>
                              {isSorted ? (
                                isAsc ? (
                                  <ArrowUp className="ml-2 h-4 w-4" />
                                ) : (
                                  <ArrowDown className="ml-2 h-4 w-4" />
                                )
                              ) : (
                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              onClick={() => handleSort(column.name)}
                            >
                              <ArrowUp className="mr-1 size-4" />
                              Asc
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSort(column.name)}
                            >
                              <ArrowDown className="mr-1 size-4" />
                              Desc
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableHead>
                    );
                  })
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
                {filteredData.map((row, i) => (
                  <TableRow key={i} className="hover:bg-gray-50 group">
                    {columns.map((col, i) => (
                      <TableCell
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600 border-r border-gray-200"
                      >
                        {formatDateValue(row[col.name])}
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
                    {searchTerm
                      ? 'No results match your search.'
                      : 'No results returned.'}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </Card>
      </CardContent>
    </Card>
  );
};

export default TableView;
