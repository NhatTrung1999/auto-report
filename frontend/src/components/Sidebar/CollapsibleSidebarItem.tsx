import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';

interface CollapsibleItemProps {
  icon: ReactNode;
  label: string;
  children: { label: string; path: string }[];
}

const CollapsibleSidebarItem: React.FC<CollapsibleItemProps> = ({
  icon,
  label,
  children,
}) => {
  const location = useLocation();
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [currentChartType, setCurrentChartType] = useState('');

  const isAnyChildActive = children.some((child) =>
    location.pathname.startsWith(child.path)
  );

  const [isMenuOpen, setIsMenuOpen] = useState(isAnyChildActive);

  useEffect(() => {
    if (isAnyChildActive && !isMenuOpen) {
      setIsMenuOpen(true);
    } else if (
      isMenuOpen &&
      !children.some((child) => location.pathname === child.path)
    ) {
    }
  }, [location.pathname]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen((prev) => !prev);
  };

  // const openPropertiesDialog = (type: string, e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setCurrentChartType(type);
  //   setIsDialogOpen(true);
  // };

  // const closePropertiesDialog = () => {
  //   setIsDialogOpen(false);
  //   setCurrentChartType('');
  // };

  return (
    <div>
      <a
        href="#"
        onClick={toggleMenu}
        className="flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
      >
        <span className="flex items-center">
          <span className="mr-3">{icon}</span>
          {label}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isMenuOpen ? 'rotate-90' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </a>

      <div
        className={`pl-8 pt-1 pb-1 space-y-1 overflow-hidden 
          transition-all duration-300 ease-in-out
          ${
            isMenuOpen
              ? 'max-h-96 opacity-100 translate-y-0'
              : 'max-h-0 opacity-0 -translate-y-2.5'
          }`}
      >
        {children.map((child) => {
          const isActiveChild = location.pathname === child.path;
          return (
            <div
              key={child.path}
              className="flex items-center justify-between group"
            >
              <Link
                to={`${child.path}${location.search}`}
                className={`block grow p-2 rounded-lg text-sm transition duration-200
                  ${
                    isActiveChild
                      ? 'bg-gray-700 text-white font-semibold'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {child.label}
              </Link>

              {/* <button
                onClick={(e) => openPropertiesDialog(child.label, e)}
                className={`ml-2 p-1 rounded-md text-xs font-medium transition duration-150 
                  ${
                    isActiveChild
                      ? 'text-white bg-gray-600 hover:bg-gray-800'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
                title={`Properties for ${child.label} Chart`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button> */}
            </div>
          );
        })}
      </div>

      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Properties: {currentChartType} Chart</DialogTitle>
          </DialogHeader>

          <form>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Chart Type Options</Label>
                <div className="rounded-2xl border border-gray-200 bg-white h-[100px] p-2 overflow-y-auto no-scrollbar flex flex-col gap-2">
                  <p className="text-sm text-gray-500">
                    Tùy chỉnh trục X, Y, Series cho {currentChartType}.
                  </p>
                </div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Data Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Source</SelectLabel>
                      <SelectItem value="data_1">Data Set 1</SelectItem>
                      <SelectItem value="data_2">Data Set 2</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closePropertiesDialog}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Apply Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default CollapsibleSidebarItem;
