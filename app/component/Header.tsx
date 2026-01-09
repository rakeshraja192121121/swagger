// app/component/Header.tsx
"use client";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const tabs = ["Billing", "SDB", "IDM"];

  return (
    <header className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 px-6 py-4 grid grid-cols-3 items-center shadow-md">
      {/* LEFT: Logo */}
      <div className="flex justify-start">
        <a
          href="https://www.turbify.com"
          aria-label="Turbify"
          className="block"
        >
          <img
            className="h-8 w-auto"
            src="https://sep.turbifycdn.com/nrp/image/turbify/newturbifylogo.png"
            alt="Turbify Small Business"
            loading="lazy"
          />
        </a>
      </div>

      {/* CENTER: Title */}
      <div className="flex justify-center">
        <span className="text-[25px] font-bold tracking-tight text-blue-800 dark:text-blue-700">
          Platform API Docs
        </span>
      </div>

      {/* RIGHT: Navigation Tabs */}
      <div className="flex justify-end items-center">
        <nav className="flex items-center space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium transition-colors pb-1 ${
                activeTab === tab
                  ? "cursor-default font-bold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;