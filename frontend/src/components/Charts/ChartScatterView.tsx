// 'use client';

// import { TrendingUp } from 'lucide-react';
// import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis } from 'recharts';

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   type ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from '@/components/ui/chart';
// import { useAppSelector } from '@/app/hooks';

// const ChartScatterView: React.FC = () => {
//   const { executeSqlCodeData, chartConfig, loading, error } = useAppSelector(
//     (state) => state.sql
//   );

//   const data = executeSqlCodeData.data || [];
//   const columns = executeSqlCodeData.columns || [];

//   const columnNames = columns.map((col) => col.name);

//   // Dùng config từ Properties, fallback về cột đầu/thứ hai
//   const xKey = chartConfig.xAxis || columnNames[0] || '';
//   const yKey = chartConfig.yAxis || columnNames[1] || '';

//   // Config động cho legend và tooltip
//   const dynamicChartConfig: ChartConfig = {};
//   columnNames.forEach((col: string, index: number) => {
//     dynamicChartConfig[col] = {
//       label: col,
//       color: `var(--chart-${(index % 5) + 1})`,
//     };
//   });

//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Scatter Chart</CardTitle>
//         </CardHeader>
//         <CardContent className="flex items-center justify-center h-96">
//           <p className="text-gray-500">Loading data...</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Scatter Chart</CardTitle>
//         </CardHeader>
//         <CardContent className="flex items-center justify-center h-96">
//           <p className="text-red-500">Error: {error}</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (data.length === 0 || !xKey || !yKey) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Scatter Chart</CardTitle>
//         </CardHeader>
//         <CardContent className="flex items-center justify-center h-96">
//           <p className="text-gray-500">
//             No data. Run a query and set X/Y axis in Properties.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Scatter Chart</CardTitle>
//         <CardDescription>
//           {yKey} vs {xKey} ({data.length} points)
//         </CardDescription>
//       </CardHeader>

//       <CardContent>
//         <ChartContainer config={dynamicChartConfig}>
//           <ScatterChart
//             accessibilityLayer
//             data={data}
//             margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
//           >
//             <CartesianGrid
//               vertical={false}
//               horizontal={false}
//               strokeDasharray="3 3"
//             />
//             <XAxis
//               type="number"
//               dataKey={xKey}
//               name={xKey}
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//             />
//             <YAxis
//               type="number"
//               dataKey={yKey}
//               name={yKey}
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//             />
//             <ChartTooltip
//               cursor={{ strokeDasharray: '3 3' }}
//               content={<ChartTooltipContent />}
//             />
//             <ChartLegend content={<ChartLegendContent />} />
//             <Scatter
//               name={`${yKey} vs ${xKey}`}
//               data={data}
//               fill={`var(--color-${yKey})`}
//               shape="circle"
//               radius={6}
//             />
//           </ScatterChart>
//         </ChartContainer>
//       </CardContent>

//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 font-medium leading-none">
//           Showing correlation between {xKey} and {yKey}
//           <TrendingUp className="h-4 w-4" />
//         </div>
//       </CardFooter>
//     </Card>
//   );
// };

// export default ChartScatterView;

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
  ChartTooltip,
} from '@/components/ui/chart';
import { useAppSelector } from '@/app/hooks';

const ChartScatterView: React.FC = () => {
  const {
    executeSqlCodeData,
    chartConfig,
    loading,
    error,
    filteredData, 
  } = useAppSelector((state) => state.sql);

  const displayData =
    filteredData.length > 0 ? filteredData : executeSqlCodeData.data || [];
  const rawDataLength = executeSqlCodeData.data?.length || 0;

  const columns = executeSqlCodeData.columns || [];
  const columnNames = columns.map((col) => col.name);

  const xKey = chartConfig.xAxis || columnNames[0] || '';
  const yKey = chartConfig.yAxis || columnNames[1] || '';

  const dynamicChartConfig: ChartConfig = {
    [xKey]: { label: xKey, color: 'var(--chart-1)' },
    [yKey]: { label: yKey, color: 'var(--chart-2)' },
  };

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

  if (displayData.length === 0 || !xKey || !yKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scatter Chart</CardTitle>
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

  const processedData = displayData
    .map((item: any) => ({
      x: Number(item[xKey]),
      y: Number(item[yKey]),
      name: item[xKey] !== undefined ? String(item[xKey]) : 'N/A', 
    }))
    .filter((point) => !isNaN(point.x) && !isNaN(point.y));

  if (processedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scatter Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-gray-500">
            Cannot plot: X or Y values are not numeric. Please choose numeric
            columns.
          </p>
        </CardContent>
      </Card>
    );
  }

  const pointLabel =
    processedData.length < rawDataLength && rawDataLength > 0
      ? `${processedData.length} filtered points`
      : `${processedData.length} points`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart</CardTitle>
        <CardDescription>
          {yKey} vs {xKey} ({pointLabel})
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={dynamicChartConfig}>
          <ScatterChart
            accessibilityLayer
            margin={{ top: 20, right: 30, bottom: 40, left: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

            <XAxis
              type="number"
              dataKey="x"
              name={xKey}
              label={{ value: xKey, position: 'insideBottom', offset: -10 }}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />

            <YAxis
              type="number"
              dataKey="y"
              name={yKey}
              label={{ value: yKey, angle: -90, position: 'insideLeft' }}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />

            {/* <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent />}
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name === 'x' ? xKey : yKey,
              ]}
            /> */}
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-sm bg-chart-1" />
                          <span className="font-medium">{xKey}:</span>
                          <span>{data.x.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-sm bg-chart-2" />
                          <span className="font-medium">{yKey}:</span>
                          <span>{data.y.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Scatter
              name={`${yKey} vs ${xKey}`}
              data={processedData}
              fill="var(--chart-2)"
              stroke="var(--chart-2)"
              strokeWidth={2}
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-3 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Correlation analysis between {xKey} and {yKey}
          <TrendingUp className="h-4 w-4 text-green-600" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartScatterView;
