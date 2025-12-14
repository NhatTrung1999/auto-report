'use client';

import { useLocation } from 'react-router';
import Properties from './Properties';
import ChartLineView from './ChartLineView';
import ChartBarView from './ChartBarView';
import ChartScatterView from './ChartScatterView';
import ChartPieView from './ChartPieView';

const chartComponents: Record<string, React.FC> = {
  line: ChartLineView,
  bar: ChartBarView,
  pie: ChartPieView,
  scatter: ChartScatterView,
};

const chartTitles: Record<string, string> = {
  line: 'Line Chart',
  bar: 'Bar Chart',
  pie: 'Pie Chart',
  scatter: 'Scatter Chart',
};

const ChartsView: React.FC = () => {
  const location = useLocation();
  const chartType = location.pathname.split('/').pop() || '';

  const ChartComponent = chartComponents[chartType];
  const title =
    chartTitles[chartType] ||
    (chartType === 'none'
      ? 'No visualization selected'
      : 'Chart Type Not Found');

  return (
    <>
      <h2 className="text-3xl font-medium mb-6 text-gray-700 border-b border-gray-300 pb-2">
        {title}
      </h2>

      <div className="mt-3 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <Properties />
        </div>

        {ChartComponent ? (
          <div className="w-full">
            <ChartComponent />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-100 border border-dashed border-gray-400 rounded-lg text-gray-600">
            {chartType === 'none'
              ? 'Please select a chart type from the Charts View menu in the sidebar.'
              : 'Error: Cannot render chart component.'}
          </div>
        )}
      </div>
    </>
  );
};

export default ChartsView;
