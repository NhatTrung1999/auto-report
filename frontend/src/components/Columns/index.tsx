'use client';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import TableView from '../Table';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
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
import { Input } from '../ui/input'; // Thêm Input
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useEffect, useState } from 'react';
import type { ISqlCodePayload } from '@/types/sql';
import { executeSQLCode } from '@/features/sql/sqlSlice';
import { toast } from 'sonner';

const ColumnsView: React.FC = () => {
  const { columns, sqlData, error } = useAppSelector((state) => state.sql);
  const dispatch = useAppDispatch();

  const [columnFunctions, setColumnFunctions] = useState<
    Record<string, string>
  >({});

  const [selectedClauseColumns, setSelectedClauseColumns] = useState<string[]>(
    []
  );

  const [topNInput, setTopNInput] = useState<string>('');

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        className: 'bg-red-600 text-white border border-red-300',
      });
    }
  }, [error]);

  const handleCreate = async () => {
    setOpen(false);

    if (!sqlData || sqlData.length === 0) {
      toast.error('Không có dữ liệu SQL');
      return;
    }

    const selections: { column: string; func?: string; alias?: string }[] = [];

    if (selectedClauseColumns.length > 0) {
      selectedClauseColumns.forEach((col) => {
        selections.push({ column: col });
      });
    }

    Object.entries(columnFunctions).forEach(([column, func]) => {
      if (func && func !== 'NONE') {
        const actualFunc = func === 'AVERAGE' ? 'AVG' : func;
        selections.push({
          column,
          func: actualFunc,
          alias: `${func}_${column}`,
        });
      }
    });

    let modifiedSQL = sqlData[0].SQLCode.trim();
    if (!modifiedSQL.match(/^SELECT\s+TOP\s+100\s+PERCENT/i)) {
      modifiedSQL = modifiedSQL.replace(
        /^SELECT\s+/i,
        'SELECT TOP 100 PERCENT '
      );
    }

    const payload: ISqlCodePayload = {
      host: sqlData[0].Host,
      port: Number(sqlData[0].Port),
      username: sqlData[0].UserName,
      password: sqlData[0].PWD,
      database: sqlData[0].DBName,
      SQLCode: modifiedSQL,
      selections,
      topN: topNInput.trim() === '' ? undefined : Number(topNInput),
    };

    dispatch(executeSQLCode(payload));
  };

  return (
    <>
      <h2 className="text-3xl font-medium mb-3 text-gray-700 border-b border-gray-300 pb-2">
        Columns View
      </h2>

      <div className="flex items-center justify-end mb-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Auto columns</Button>
          </DialogTrigger>
          <DialogOverlay className="z-70 bg-black/10" />
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col z-80">
            <DialogHeader>
              <DialogTitle>Auto columns</DialogTitle>
              <DialogDescription className="sr-only">
                Chọn các cột để áp dụng hàm tổng hợp (SUM, AVG, MIN, MAX) hoặc
                nhóm dữ liệu theo GROUP BY.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-1 no-scrollbar">
              <div className="grid gap-6 py-4">
                <div className="grid gap-3">
                  <Label className="text-base font-semibold">
                    Option Columns
                  </Label>

                  <div className="rounded-2xl border border-gray-200 bg-white h-[200px] p-2 overflow-y-auto no-scrollbar flex flex-col gap-2">
                    {columns.map((column) => (
                      <Label
                        key={column.name}
                        className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50"
                      >
                        <Checkbox
                          checked={selectedClauseColumns.includes(column.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedClauseColumns((prev) => [
                                ...prev,
                                column.name,
                              ]);
                            } else {
                              setSelectedClauseColumns((prev) =>
                                prev.filter((c) => c !== column.name)
                              );
                            }
                          }}
                        />
                        <p className="text-sm font-medium">{column.name}</p>
                      </Label>
                    ))}
                  </div>
                  {/* 
                  <Select value={clauseType} onValueChange={setClauseType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose option" />
                    </SelectTrigger>
                    <SelectContent className='z-90'>
                      <SelectGroup>
                        <SelectLabel>Option</SelectLabel>
                        <SelectItem value="NONE">NONE</SelectItem>
                        <SelectItem value="GROUPBY">GROUP BY</SelectItem>
                        <SelectItem value="ORDERBY">ORDER BY</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select> */}
                </div>

                <div className="grid gap-3">
                  <Label className="text-base font-semibold">
                    Excel Functions
                  </Label>

                  <div className="rounded-2xl border border-gray-200 bg-white h-[200px] p-3 overflow-y-auto no-scrollbar">
                    {columns.map((column, index) => {
                      const isLast = index === columns.length - 1;
                      const currentFunc =
                        columnFunctions[column.name] || 'NONE';

                      const dataType = column.dataType?.toLowerCase() || '';
                      const numericTypes = [
                        'int',
                        'bigint',
                        'smallint',
                        'tinyint',
                        'decimal',
                        'numeric',
                        'float',
                        'real',
                        'money',
                        'smallmoney',
                        'bit',
                      ];
                      const isNumeric = numericTypes.some((type) =>
                        dataType.includes(type)
                      );

                      const defaultFunc = isNumeric ? 'SUM' : 'MIN';

                      const allowedFunctions = isNumeric
                        ? ['NONE', 'SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT']
                        : ['NONE', 'MIN', 'MAX', 'COUNT'];

                      return (
                        <Label
                          key={column.name}
                          className={`flex items-center gap-4 p-2 border rounded-lg ${
                            !isLast ? 'mb-2' : ''
                          } hover:bg-gray-50`}
                        >
                          <Checkbox
                            checked={currentFunc !== 'NONE'}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setColumnFunctions((prev) => ({
                                  ...prev,
                                  [column.name]: defaultFunc,
                                }));
                              } else {
                                setColumnFunctions((prev) => {
                                  const newObj = { ...prev };
                                  delete newObj[column.name];
                                  return newObj;
                                });
                              }
                            }}
                          />

                          <span
                            className="flex-1 font-medium text-sm truncate"
                            title={column.name}
                          >
                            {column.name}
                          </span>

                          <Select
                            value={currentFunc}
                            onValueChange={(val) => {
                              if (val === 'NONE') {
                                setColumnFunctions((prev) => {
                                  const newObj = { ...prev };
                                  delete newObj[column.name];
                                  return newObj;
                                });
                              } else {
                                setColumnFunctions((prev) => ({
                                  ...prev,
                                  [column.name]: val,
                                }));
                              }
                            }}
                            disabled={currentFunc === 'NONE'}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-90">
                              {allowedFunctions.map((func) => (
                                <SelectItem key={func} value={func}>
                                  {func === 'AVERAGE' ? 'AVERAGE' : func}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="topN">Top N</Label>
                  <Input
                    id="topN"
                    type="number"
                    placeholder="Enter a number"
                    value={topNInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d+$/.test(value)) {
                        setTopNInput(value);
                      }
                    }}
                    min="1"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreate} className="bg-black">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <TableView />
    </>
  );
};

export default ColumnsView;
