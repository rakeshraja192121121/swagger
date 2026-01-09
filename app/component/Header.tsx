// app/component/Header.tsx
"use client";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeVersion: string;
  setActiveVersion: (version: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Header = ({
  activeTab,
  setActiveTab,
  activeVersion,
  setActiveVersion,
  searchTerm,
  setSearchTerm,
}: HeaderProps) => {
  const tabs = ["Billing", "SDB", "IDM"];
  let versions: string[] = [];
  if (activeTab === "Billing") {
    versions = ["Billing", "v1", "v2"];
  } else {
    versions = [];
  }

  return (
    <header className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 px-6 py-4 grid grid-cols-3 items-center shadow-md">
      {/* LEFT: Logo & Title */}
      <div className="flex justify-start items-center gap-4">
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
        <span className="text-xl font-bold tracking-tight text-blue-800 dark:text-blue-700">
          Platform API Docs
        </span>
      </div>

      {/* CENTER: Search Bar */}
      <div className="flex justify-center w-full px-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search APIs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* RIGHT: Navigation Tabs */}
      <div className="flex justify-end items-center">
        <nav className="flex items-center space-x-6">
          {tabs.map((tab) => {
            // Special handling for Billing Tab to unify filters
            if (tab === "Billing") {
              if (activeTab === "Billing") {
                return (
                  <div
                    key={tab}
                    className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
                  >
                    {[
                      { label: "Billing", value: "Billing" },
                      { label: "v1", value: "v1" },
                      { label: "v2", value: "v2" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => setActiveVersion(item.value)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeVersion === item.value
                          ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                );
              }
            }

            // Standard Tab Render (SDB, IDM, or inactive Billing)
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === "Billing") {
                    setActiveVersion("Billing");
                  }
                }}
                className={`text-sm font-medium transition-colors pb-1 ${activeTab === tab
                  ? "cursor-default font-bold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;