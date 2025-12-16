'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

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
  const { executeSqlCodeData, chartConfig, loading, error, filteredData } =
    useAppSelector((state) => state.sql);

  const displayData =
    filteredData.length > 0 ? filteredData : executeSqlCodeData.data || [];
  const rawDataLength = executeSqlCodeData.data?.length || 0;

  const columns = executeSqlCodeData.columns || [];
  const columnNames = columns.map((col) => col.name);

  // Dùng config từ Properties, fallback về cột đầu/thứ hai
  const xKey = chartConfig.xAxis || columnNames[0] || '';
  const yKey = chartConfig.yAxis || columnNames[1] || '';

  // Config động cho tooltip
  const dynamicChartConfig: ChartConfig = {};
  columnNames.forEach((col: string, index: number) => {
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

  if (displayData.length === 0 || !xKey || !yKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Line Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-gray-500">
            {displayData.length === 0 && rawDataLength > 0
              ? 'No data matches your current search.'
              : 'No data available. Please run a query and configure X/Y axis in Properties.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const total = displayData.reduce(
    (sum: number, item: any) => sum + (Number(item[yKey]) || 0),
    0
  );

  const recordLabel =
    displayData.length < rawDataLength
      ? `${displayData.length} filtered records`
      : `${displayData.length} records`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart</CardTitle>
        <CardDescription>
          {yKey} by {xKey} ({recordLabel})
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={dynamicChartConfig}>
          <LineChart data={displayData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              angle={-45}
              textAnchor="end"
              height={80}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              domain={[
                (dataMin: number) => Math.min(0, dataMin * 1.1),
                (dataMax: number) => dataMax * 1.1,
              ]}
              tickFormatter={(value: number) => {
                if (value >= 1000000000) {
                  return `${(value / 1000000000).toFixed(1)}B`;
                }
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                }
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}k`;
                }
                return value.toLocaleString();
              }}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent />}
            />
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
      </CardFooter>
    </Card>
  );
};

export default ChartLineView;
