'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

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

const ChartLineView: React.FC = () => {
  const { executeSqlCodeData, chartConfig, loading, error } = useAppSelector(
    (state) => state.sql
  );

  const data = executeSqlCodeData.data || [];
  const columns = executeSqlCodeData.columns || [];

  // Dùng config từ Properties, fallback về cột đầu/thứ hai
  const xKey = chartConfig.xAxis || columns[0] || '';
  const yKey = chartConfig.yAxis || columns[1] || '';

  // Config động cho tooltip
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
          <CardTitle>Line Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Line Chart</CardTitle>
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
          <CardTitle>Line Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-gray-500">
            No data. Run a query and set X/Y axis in Properties.
          </p>
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce(
    (sum: number, item: any) => sum + (Number(item[yKey]) || 0),
    0
  );

  console.log(executeSqlCodeData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart</CardTitle>
        <CardDescription>
          {yKey} by {xKey} ({data.length} records)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={dynamicChartConfig}>
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                typeof value === 'string' ? value.slice(0, 10) : value
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey={yKey}
              type="monotone"
              stroke={`var(--color-${yKey})`}
              strokeWidth={2}
              dot={{ fill: `var(--color-${yKey})` }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium">
          Total {yKey}: {total.toLocaleString()}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">Data from latest query</div>
      </CardFooter>
    </Card>
  );
};

export default ChartLineView;
