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

const ColumnsView: React.FC = () => {
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
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Label className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50">
                        <Checkbox
                          id="toggle-2"
                          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                        />
                        <div className="grid gap-1.5 font-normal">
                          <p className="text-sm leading-none font-medium">
                            Columns {i + 1}
                          </p>
                        </div>
                      </Label>
                    ))}
                  </div>
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
                  <Label htmlFor="username-1">Clause</Label>
                  <div className="rounded-2xl border border-gray-200 bg-white h-[170px] p-2 overflow-y-auto no-scrollbar flex flex-col gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Label className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50">
                        <Checkbox
                          id="toggle-2"
                          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                        />
                        <div className="grid gap-1.5 font-normal">
                          <p className="text-sm leading-none font-medium">
                            Columns {i + 1}
                          </p>
                        </div>
                      </Label>
                    ))}
                  </div>
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
      <TableView />
    </>
  );
};

export default ColumnsView;
