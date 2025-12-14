'use client';

import { TrendingUp } from 'lucide-react';
import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

const ChartScatterView: React.FC = () => {
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
          <CardTitle>Scatter Chart</CardTitle>
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
          <CardTitle>Scatter Chart</CardTitle>
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
          <CardTitle>Scatter Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-gray-500">
            No data. Run a query and set X/Y axis in Properties.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart</CardTitle>
        <CardDescription>
          {yKey} vs {xKey} ({data.length} points)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={dynamicChartConfig}>
          <ScatterChart
            accessibilityLayer
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid
              vertical={false}
              horizontal={false}
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              dataKey={xKey}
              name={xKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              type="number"
              dataKey={yKey}
              name={yKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Scatter
              name={`${yKey} vs ${xKey}`}
              data={data}
              fill={`var(--color-${yKey})`}
              shape="circle"
              radius={6}
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Showing correlation between {xKey} and {yKey}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Data from your latest query
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartScatterView;
