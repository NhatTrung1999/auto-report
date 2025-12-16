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
  const { executeSqlCodeData, chartConfig, loading, error } = useAppSelector(
    (state) => state.sql
  );

  const data = executeSqlCodeData.data || [];
  const columns = executeSqlCodeData.columns || [];

  const columnNames = columns.map((col) => col.name);

  // Dùng config từ Properties cho Pie: Value (số) + Label (tên)
  const valueKey =
    chartConfig.value ||
    columnNames.find((col) => typeof data[0]?.[col] === 'number') ||
    columnNames[1] ||
    '';
  const labelKey = chartConfig.label || columnNames[0] || '';

  // Chuẩn bị dữ liệu cho Pie Chart
  const pieData = data
    .map((item: any) => ({
      name: item[labelKey] || 'Unknown',
      value: Number(item[valueKey]) || 0,
    }))
    .filter((item: any) => item.value > 0);

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
            No data. Run a query and set Value/Label in Properties.
          </p>
        </CardContent>
      </Card>
    );
  }

  const total = pieData.reduce((sum: number, item: any) => sum + item.value, 0);

  console.log(total);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart</CardTitle>
        <CardDescription>
          Distribution of {valueKey} by {labelKey} ({pieData.length} items)
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={dynamicChartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
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
