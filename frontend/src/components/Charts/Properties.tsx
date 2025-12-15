'use client';

import { useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState } from 'react';
import { setChartConfig } from '@/features/sql/sqlSlice';

const Properties: React.FC = () => {
  const location = useLocation();
  const chartType = location.pathname.split('/').pop() || '';

  const dispatch = useAppDispatch();
  const { executeSqlCodeData } = useAppSelector((state) => state.sql);
  const [open, setOpen] = useState<boolean>(false);

  const [selected, setSelected] = useState({
    xAxis: '',
    yAxis: '',
    value: '',
    label: '',
  });

  const getProperties = () => {
    switch (chartType) {
      case 'line':
      case 'bar':
      case 'scatter':
        return [
          {
            key: 'xAxis',
            label: 'X Axis',
            placeholder: 'Choose X axis column',
          },
          {
            key: 'yAxis',
            label: 'Y Axis',
            placeholder: 'Choose Y axis column',
          },
        ];
      case 'pie':
        return [
          { key: 'value', label: 'Value', placeholder: 'Choose value column' },
          { key: 'label', label: 'Label', placeholder: 'Choose label column' },
        ];
      default:
        return [];
    }
  };

  const properties = getProperties();

  if (properties.length === 0) {
    return (
      <Button variant="outline" disabled>
        Properties
      </Button>
    );
  }

  const handleSave = () => {
    dispatch(
      setChartConfig({
        xAxis: selected.xAxis || undefined,
        yAxis: selected.yAxis || undefined,
        value: selected.value || undefined,
        label: selected.label || undefined,
      })
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Properties</Button>
      </DialogTrigger>
      <DialogOverlay className='z-70 bg-black/10' />
      <DialogContent className="sm:max-w-[425px] z-80">
        <DialogHeader>
          <DialogTitle>Chart Properties</DialogTitle>
          <DialogDescription className="sr-only">
            Configure chart axes
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {properties.map((prop) => (
            <div key={prop.key} className="grid gap-3">
              <Label>{prop.label}</Label>
              <Select
                value={selected[prop.key as keyof typeof selected] || ''}
                onValueChange={(value) =>
                  setSelected((prev) => ({ ...prev, [prop.key]: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={prop.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {executeSqlCodeData.columns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              handleSave();
              setOpen(false);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Properties;
