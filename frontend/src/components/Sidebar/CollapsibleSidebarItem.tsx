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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollapsibleSidebarItem;
