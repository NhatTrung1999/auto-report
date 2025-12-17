'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
  const { executeSqlCodeData, chartConfig, loading, error, filteredData } =
    useAppSelector((state) => state.sql);

  console.log(filteredData);

  const data =
    filteredData.length > 0 ? filteredData : executeSqlCodeData.data || [];
  const columns = executeSqlCodeData.columns || [];
  const columnNames = columns.map((col) => col.name);

  const xKey = chartConfig.xAxis || columnNames[0] || '';
  const yKey = chartConfig.yAxis || columnNames[1] || '';

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
            {filteredData.length === 0 && executeSqlCodeData.data?.length > 0
              ? 'No data matches your search.'
              : 'No data. Run a query and set X/Y axis in Properties.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum: number, item: any) => {
    const val = Number(item[yKey]);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const normalizedData = data.map((item: any) => ({
    ...item,
    [yKey]: Number(item[yKey]),
  }));

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
            data={normalizedData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
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
              domain={[
                (min: number) => Math.min(0, min),
                (max: number) => max * 1.1,
              ]}
              tickLine={false}
              axisLine={false}
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
      </CardFooter>
    </Card>
  );
};

export default ChartBarView;
