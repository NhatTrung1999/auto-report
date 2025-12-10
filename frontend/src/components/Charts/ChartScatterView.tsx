import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const scatterData = [
  { x: 186, y: 80, month: 'January' },
  { x: 305, y: 200, month: 'February' },
  { x: 237, y: 120, month: 'March' },
  { x: 73, y: 190, month: 'April' },
  { x: 209, y: 130, month: 'May' },
  { x: 214, y: 140, month: 'June' },
  { x: 250, y: 160, month: 'July' },
  { x: 198, y: 150, month: 'August' },
  { x: 170, y: 110, month: 'September' },
  { x: 260, y: 180, month: 'October' },
  { x: 230, y: 140, month: 'November' },
  { x: 290, y: 190, month: 'December' },
];

const scatterChartConfig = {
  dataPoint: {
    label: 'Monthly Metrics',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ChartScatterView() {
  return (
    <ChartContainer
      config={scatterChartConfig}
      className="min-h-[200px] w-full"
    >
      <ScatterChart accessibilityLayer data={scatterData}>
        <CartesianGrid vertical={false} />

        <XAxis
          type="number"
          dataKey="x"
          name="Desktop Views (X)"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />

        <YAxis
          type="number"
          dataKey="y"
          name="Mobile Views (Y)"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" nameKey="month" />}
        />

        <ChartLegend content={<ChartLegendContent />} />

        <Scatter
          dataKey="dataPoint"
          name="Monthly Metrics"
          fill="var(--color-dataPoint)"
          shape="circle"
        />
      </ScatterChart>
    </ChartContainer>
  );
}
