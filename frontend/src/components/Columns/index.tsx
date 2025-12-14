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
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input'; // Thêm Input
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
import { useEffect, useState } from 'react';
import type { ISqlCodePayload } from '@/types/sql';
import { executeSQLCode } from '@/features/sql/sqlSlice';
import { toast } from 'sonner';

const ColumnsView: React.FC = () => {
  const { columns, sqlData, error } = useAppSelector((state) => state.sql);
  const dispatch = useAppDispatch();

  // Mỗi cột có hàm riêng
  const [columnFunctions, setColumnFunctions] = useState<
    Record<string, string>
  >({});

  // Cột cho Clause
  const [selectedClauseColumns, setSelectedClauseColumns] = useState<string[]>(
    []
  );
  const [clauseType, setClauseType] = useState<string>('NONE');

  // TOP N input (chỉ cho phép số)
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

    // Excel Functions – mỗi cột có hàm riêng
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

    // Clause – chỉ xử lý GROUP BY (ORDER BY bỏ qua)
    if (selectedClauseColumns.length > 0 && clauseType === 'GROUPBY') {
      selectedClauseColumns.forEach((col) => {
        selections.push({ column: col });
      });
    }

    // Thêm TOP 100 PERCENT vào query gốc
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
      <h2 className="text-3xl font-medium mb-6 text-gray-700 border-b border-gray-300 pb-2">
        Columns View
      </h2>

      <div className="flex items-center justify-end mb-6">
        {/* <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Auto columns</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Auto columns</DialogTitle>
              <DialogDescription className="sr-only">
                Chọn các cột để áp dụng hàm tổng hợp (SUM, AVG, MIN, MAX) hoặc
                nhóm dữ liệu theo GROUP BY.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid gap-3">
                <Label className="text-base font-semibold">
                  Excel Functions
                </Label>
                <div className="rounded-2xl border border-gray-200 bg-white h-[250px] p-3 overflow-y-auto no-scrollbar">
                  {columns.map((column, index) => {
                    const isLast = index === columns.length - 1;
                    const currentFunc = columnFunctions[column] || 'NONE';

                    return (
                      <Label
                        key={column}
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
                                [column]: 'SUM',
                              }));
                            } else {
                              setColumnFunctions((prev) => {
                                const newObj = { ...prev };
                                delete newObj[column];
                                return newObj;
                              });
                            }
                          }}
                        />

                        <span
                          className="flex-1 font-medium text-sm truncate"
                          title={column}
                        >
                          {column}
                        </span>

                        <Select
                          value={currentFunc}
                          onValueChange={(val) => {
                            if (val === 'NONE') {
                              setColumnFunctions((prev) => {
                                const newObj = { ...prev };
                                delete newObj[column];
                                return newObj;
                              });
                            } else {
                              setColumnFunctions((prev) => ({
                                ...prev,
                                [column]: val,
                              }));
                            }
                          }}
                          disabled={currentFunc === 'NONE'}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NONE">NONE</SelectItem>
                            <SelectItem value="SUM">SUM</SelectItem>
                            <SelectItem value="AVERAGE">AVERAGE</SelectItem>
                            <SelectItem value="MIN">MIN</SelectItem>
                            <SelectItem value="MAX">MAX</SelectItem>
                            <SelectItem value="COUNT">COUNT</SelectItem>
                          </SelectContent>
                        </Select>
                      </Label>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3">
                <Label className="text-base font-semibold">Clause</Label>
                <div className="rounded-2xl border border-gray-200 bg-white h-[170px] p-2 overflow-y-auto no-scrollbar flex flex-col gap-2">
                  {columns.map((column, i) => (
                    <Label
                      key={i}
                      className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50"
                    >
                      <Checkbox
                        checked={selectedClauseColumns.includes(column)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedClauseColumns((prev) => [
                              ...prev,
                              column,
                            ]);
                          } else {
                            setSelectedClauseColumns((prev) =>
                              prev.filter((c) => c !== column)
                            );
                          }
                        }}
                      />
                      <div className="grid gap-1.5 font-normal">
                        <p className="text-sm leading-none font-medium">
                          {column}
                        </p>
                      </div>
                    </Label>
                  ))}
                </div>
                <Select value={clauseType} onValueChange={setClauseType}>
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
                  className="w-full"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleCreate}
                className="bg-green-600 hover:bg-green-700"
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Auto columns</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
            {/* ===== HEADER (FIXED) ===== */}
            <DialogHeader>
              <DialogTitle>Auto columns</DialogTitle>
              <DialogDescription className="sr-only">
                Chọn các cột để áp dụng hàm tổng hợp (SUM, AVG, MIN, MAX) hoặc
                nhóm dữ liệu theo GROUP BY.
              </DialogDescription>
            </DialogHeader>

            {/* ===== BODY (SCROLL) ===== */}
            <div className="flex-1 overflow-y-auto pr-1 no-scrollbar">
              <div className="grid gap-6 py-4">
                {/* ===== EXCEL FUNCTIONS ===== */}
                <div className="grid gap-3">
                  <Label className="text-base font-semibold">
                    Excel Functions
                  </Label>

                  <div className="rounded-2xl border border-gray-200 bg-white h-[250px] p-3 overflow-y-auto no-scrollbar">
                    {columns.map((column, index) => {
                      const isLast = index === columns.length - 1;
                      const currentFunc = columnFunctions[column] || 'NONE';

                      return (
                        <Label
                          key={column}
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
                                  [column]: 'SUM',
                                }));
                              } else {
                                setColumnFunctions((prev) => {
                                  const newObj = { ...prev };
                                  delete newObj[column];
                                  return newObj;
                                });
                              }
                            }}
                          />

                          <span
                            className="flex-1 font-medium text-sm truncate"
                            title={column}
                          >
                            {column}
                          </span>

                          <Select
                            value={currentFunc}
                            onValueChange={(val) => {
                              if (val === 'NONE') {
                                setColumnFunctions((prev) => {
                                  const newObj = { ...prev };
                                  delete newObj[column];
                                  return newObj;
                                });
                              } else {
                                setColumnFunctions((prev) => ({
                                  ...prev,
                                  [column]: val,
                                }));
                              }
                            }}
                            disabled={currentFunc === 'NONE'}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NONE">NONE</SelectItem>
                              <SelectItem value="SUM">SUM</SelectItem>
                              <SelectItem value="AVERAGE">AVERAGE</SelectItem>
                              <SelectItem value="MIN">MIN</SelectItem>
                              <SelectItem value="MAX">MAX</SelectItem>
                              <SelectItem value="COUNT">COUNT</SelectItem>
                            </SelectContent>
                          </Select>
                        </Label>
                      );
                    })}
                  </div>
                </div>

                {/* ===== CLAUSE ===== */}
                <div className="grid gap-3">
                  <Label className="text-base font-semibold">Clause</Label>

                  <div className="rounded-2xl border border-gray-200 bg-white h-[170px] p-2 overflow-y-auto no-scrollbar flex flex-col gap-2">
                    {columns.map((column) => (
                      <Label
                        key={column}
                        className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50"
                      >
                        <Checkbox
                          checked={selectedClauseColumns.includes(column)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedClauseColumns((prev) => [
                                ...prev,
                                column,
                              ]);
                            } else {
                              setSelectedClauseColumns((prev) =>
                                prev.filter((c) => c !== column)
                              );
                            }
                          }}
                        />
                        <p className="text-sm font-medium">{column}</p>
                      </Label>
                    ))}
                  </div>

                  <Select value={clauseType} onValueChange={setClauseType}>
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

                {/* ===== TOP N ===== */}
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

            {/* ===== FOOTER (FIXED) ===== */}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleCreate}
                className="bg-green-600 hover:bg-green-700"
              >
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
