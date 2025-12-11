import { useLocation } from 'react-router';
import { ChartLineView } from './ChartLineView';
import { ChartBarView } from './ChartBarView';
import { ChartPieView } from './ChartPieView';
import { ChartScatterView } from './ChartScatterView';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

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
      <div className="flex items-center justify-end">
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="outline">Properties</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Properties</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">X Axis</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Option</SelectLabel>
                        <SelectItem value="NONE">NONE</SelectItem>
                        <SelectItem value="SUM">SUM</SelectItem>
                        <SelectItem value="AVERAGE">AVERAGE</SelectItem>
                        <SelectItem value="MAX">MAX</SelectItem>
                        <SelectItem value="MIN">MIN</SelectItem>
                        <SelectItem value="TOPN">TOP N</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Y Axis</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Option</SelectLabel>
                        <SelectItem value="NONE">NONE</SelectItem>
                        <SelectItem value="GROUPBY">GROUP BY</SelectItem>
                        <SelectItem value="ORDERBY">ORDER BY</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
      <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>

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
