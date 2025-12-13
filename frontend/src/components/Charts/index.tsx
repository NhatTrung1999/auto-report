import { useLocation } from 'react-router';
import { ChartLineView } from './ChartLineView';
import { ChartBarView } from './ChartBarView';
import { ChartPieView } from './ChartPieView';
import { ChartScatterView } from './ChartScatterView';
import Properties from './Properties';

const ChartsView: React.FC = () => {
  const location = useLocation();
  const chartType = location.pathname.split('/').pop();

  let title = 'Charts View';
  let ChartComponent: React.FC | null = null;

  if (chartType && chartType !== 'none') {
    const typeLabel = chartType.charAt(0).toUpperCase() + chartType.slice(1);
    title = `${typeLabel} Chart`;

    switch (chartType) {
      case 'line':
        ChartComponent = ChartLineView;
        break;
      case 'bar':
        ChartComponent = ChartBarView;
        break;
      case 'pie':
        ChartComponent = ChartPieView;
        break;
      case 'scatter':
        ChartComponent = ChartScatterView;
        break;
      default:
        title = 'Chart Type Not Found';
        ChartComponent = null;
        break;
    }
  } else {
    title = 'No visualization selected';
  }

  return (
    <>
      <h2 className="text-3xl font-medium mb-6 text-gray-700 border-b border-gray-300 pb-2">
        {title}
      </h2>
      <div className="mt-3 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className='flex items-center justify-between mb-4'>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <Properties />
        </div>
        {ChartComponent ? (
          <div className="w-full">
            <ChartComponent />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-100 border border-dashed border-gray-400 rounded-lg text-gray-600">
            {title === 'No visualization selected'
              ? 'Please select a chart type from the Charts View menu in the sidebar.'
              : 'Error: Cannot render chart component.'}
          </div>
        )}
      </div>
    </>
  );
};

export default ChartsView;
