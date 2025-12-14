'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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

const ChartBarView: React.FC = () => {
  const { executeSqlCodeData, chartConfig, loading, error } = useAppSelector(
    (state) => state.sql
  );

  const data = executeSqlCodeData.data || [];
  const columns = executeSqlCodeData.columns || [];

  // Dùng config từ Properties, fallback về cột đầu/thứ hai
  const xKey = chartConfig.xAxis || columns[0] || '';
  const yKey = chartConfig.yAxis || columns[1] || '';

  // Config động cho legend và tooltip
  const dynamicChartConfig: ChartConfig = {};
  columns.forEach((col: string, index: number) => {
    dynamicChartConfig[col] = {
      label: col,
      color: `var(--chart-${(index % 5) + 1})`,
    };
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bar Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bar Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0 || !xKey || !yKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bar Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-gray-500">
            No data. Run a query and set X/Y axis in Properties.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Tính tổng cho footer
  const total = data.reduce((sum: number, item: any) => {
    const val = Number(item[yKey]);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>
          {yKey} by {xKey} ({data.length} records)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={dynamicChartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                typeof value === 'string' ? value.slice(0, 10) : value
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey={yKey}
              fill={`var(--color-${yKey})`}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total {yKey}: {total.toLocaleString()}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Data from your latest query
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartBarView;
