import { useAppDispatch, useAppSelector } from '@/app/hooks';
import TableView from '../Table';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
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
import { useState } from 'react';
import type { ISqlCodePayload } from '@/types/sql';
import { executeSQLCode } from '@/features/sql/sqlSlice';

const ColumnsView: React.FC = () => {
  const { columns, sqlData } = useAppSelector((state) => state.sql);
  const dispatch = useAppDispatch()

  const [selectedValueColumns, setSelectedValueColumns] = useState<string[]>(
    []
  );
  const [selectedClauseColumns, setSelectedClauseColumns] = useState<string[]>(
    []
  );

  const [valueFunction, setValueFunction] = useState<string>('SUM');
  const [clauseType, setClauseType] = useState<string>('GROUPBY');

  const handleCreate = async() => {
    const selections: { column: string; func?: string; alias?: string; }[] = [];

    if (selectedValueColumns.length > 0 && valueFunction !== 'NONE') {
      selectedValueColumns.forEach((col) => {
        selections.push({
          column: col,
          func: valueFunction === 'AVERAGE' ? 'AVG' : valueFunction,
          alias: `${valueFunction} ${col}`,
        });
      });
    }
    if (selectedClauseColumns.length > 0 && clauseType === 'GROUPBY') {
      selectedClauseColumns.forEach((col) => {
        selections.push({ column: col });
      });
    }

    const originalSQL = sqlData[0].SQLCode

    const modifiedSQL = originalSQL.replace(/^select\s+/i, "SELECT TOP 100 PERCENT ")

    const payload: ISqlCodePayload = {
      host: sqlData[0].Host,
      port: Number(sqlData[0].Port),
      username: sqlData[0].UserName,
      password: sqlData[0].PWD,
      database: sqlData[0].DBName,
      SQLCode: modifiedSQL,
      selections
    }

    // console.log(payload.SQLCode);

    await dispatch(executeSQLCode(payload))
  };

  return (
    <>
      <h2 className="text-3xl font-medium mb-6 text-gray-700 border-b border-gray-300 pb-2">
        Columns View
      </h2>
      <div className="flex items-center justify-end">
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="outline">Auto columns</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Auto columns</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Excel Functions</Label>
                  <div className="rounded-2xl border border-gray-200 bg-white h-[170px] p-2 overflow-y-auto no-scrollbar flex flex-col gap-2">
                    {columns.map((column, i) => (
                      <Label
                        key={i}
                        className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50"
                      >
                        <Checkbox
                          id="toggle-2"
                          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                          checked={selectedValueColumns.includes(column)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedValueColumns((prev) => [
                                ...prev,
                                column,
                              ]);
                            } else {
                              setSelectedValueColumns((prev) =>
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
                  <Select
                    value={valueFunction}
                    onValueChange={setValueFunction}
                  >
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
                  <Label htmlFor="username-1">Clause</Label>
                  <div className="rounded-2xl border border-gray-200 bg-white h-[170px] p-2 overflow-y-auto no-scrollbar flex flex-col gap-2">
                    {columns.map((column, i) => (
                      <Label
                        key={i}
                        className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50"
                      >
                        <Checkbox
                          id="toggle-2"
                          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
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
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreate}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      <TableView />
    </>
  );
};

export default ColumnsView;
