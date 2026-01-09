"use client";

interface SidebarProps {
  tags: string[];
  activeTag: string;
  scrollToTag: (tag: string) => void;
}

const Sidebar = ({ tags, activeTag, scrollToTag }: SidebarProps) => {
  return (
    <aside className="hidden md:block w-64 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm sticky top-24 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <nav className="p-4 space-y-1">
        <h3 className="px-2 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 mb-2">
          Endpoint Groups
        </h3>
        {tags.length === 0 ? (
          <p className="px-2 text-sm text-gray-400">Loading Groups...</p>
        ) : (
          tags.map((tag) => (
            <button
              key={tag}
              onClick={() => scrollToTag(tag)}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-all border-l-2 ${
                activeTag === tag
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-600"
                  : "text-gray-700 dark:text-gray-200 border-transparent hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-600"
              }`}
            >
              {tag}
            </button>
          ))
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
