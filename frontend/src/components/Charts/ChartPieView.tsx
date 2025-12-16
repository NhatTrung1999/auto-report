'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useAppSelector } from '@/app/hooks';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const ChartPieView: React.FC = () => {
  const { executeSqlCodeData, chartConfig, loading, error, filteredData } =
    useAppSelector((state) => state.sql);

  const displayData =
    filteredData.length > 0 ? filteredData : executeSqlCodeData.data || [];
  const rawDataLength = executeSqlCodeData.data?.length || 0;

  const columns = executeSqlCodeData.columns || [];
  const columnNames = columns.map((col) => col.name);

  // Dùng config từ Properties cho Pie: Value (số) + Label (tên)
  const valueKey =
    chartConfig.value ||
    columnNames.find(
      (col) => displayData[0] && typeof displayData[0][col] === 'number'
    ) ||
    columnNames[1] ||
    '';
  const labelKey = chartConfig.label || columnNames[0] || '';

  // Chuẩn bị dữ liệu cho Pie Chart
  const pieData = displayData
    .map((item: any) => ({
      name: String(item[labelKey] ?? 'Unknown'),
      value: Number(item[valueKey]) || 0,
    }))
    .filter((item) => item.value > 0);

  // Config động
  const dynamicChartConfig: ChartConfig = {
    value: {
      label: valueKey,
    },
  };

  // Gán màu cho từng slice
  pieData.forEach((_: any, index: number) => {
    const name = pieData[index].name;
    dynamicChartConfig[name] = {
      label: name,
      color: COLORS[index % COLORS.length],
    };
  });

  if (loading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center h-96">
          <p className="text-gray-500">Loading data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center h-96">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (pieData.length === 0 || !valueKey || !labelKey) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center h-96">
          <p className="text-gray-500">
            {pieData.length === 0 && rawDataLength > 0
              ? 'No data matches your current search.'
              : 'No valid data. Please run a query and configure Value/Label in Properties.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const total = pieData.reduce((sum: number, item: any) => sum + item.value, 0);

  const itemLabel =
    pieData.length < rawDataLength && rawDataLength > 0
      ? `${pieData.length} filtered items`
      : `${pieData.length} items`;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart</CardTitle>
        <CardDescription>
          Distribution of {valueKey} by {labelKey} ({itemLabel})
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={dynamicChartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend
              content={<ChartLegendContent />}
              verticalAlign="bottom"
              align="center"
            />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pieData.map((_, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total {valueKey}: {total.toLocaleString()}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Data from your latest query
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartPieView;
