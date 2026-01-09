"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

interface SwaggerProps {
  spec?: object;
  url?: string;
}

const SwaggerDocs = ({ spec, url }: SwaggerProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string>("");
  const [isDark, setIsDark] = useState(false);

  const [activeTab, setActiveTab] = useState("Billing");
  const [isLoading, setIsLoading] = useState(false);
  const apiUrls: Record<string, string> = {
    Billing: "/api/spec/billing",
    SDB: "/api/spec/sdb",
    IDM: "/api/spec/idm",
  };

  const [modifiedSpec, setModifiedSpec] = useState<object | null>(null);

  // 1. Fetch and modify the Swagger JSON
  useEffect(() => {
    const currentUrl = apiUrls[activeTab];
    if (currentUrl) {
      setIsLoading(true);
      fetch(currentUrl)
        .then((res) => res.json())
        .then((data) => {
          const newTags = new Set<string>();

          if (data.paths) {
            Object.keys(data.paths).forEach((pathKey) => {
              const pathItem = data.paths[pathKey];

              // Logic: /{serviceName}/{version}/{ResourceName}/...
              // 1. Split path
              const segments = pathKey.split("/").filter(Boolean);

              // 2. Find version index (v1, v2, etc)
              const versionIndex = segments.findIndex((s) =>
                /^v[0-9]+$/i.test(s)
              );

              let groupName = "Other";

              if (versionIndex !== -1 && segments.length > versionIndex + 1) {
                // 3. Take the segment AFTER version
                groupName = segments[versionIndex + 1];
              } else if (segments.length > 0) {
                // Fallback: If no version, use first segment (e.g. 'enablev2api')
                groupName = segments[0];
              }

              // Capitalize
              groupName =
                groupName.charAt(0).toUpperCase() + groupName.slice(1);
              newTags.add(groupName);

              // Assign to all operations in this path
              Object.keys(pathItem).forEach((method) => {
                if (method !== "parameters") {
                  pathItem[method].tags = [groupName];
                }
              });
            });
          }

          // 1. Sort tags Alphabetically (A-Z)
          const sortedTags = Array.from(newTags).sort();

          // 2. Update Sidebar State
          setTags(sortedTags);

          // CRITICAL: Always hide servers dropdown
          data.servers = [{ url: "" }];
          delete data.host;
          delete data.schemes;

          // 3. FORCE Main UI to follow Alphabetical Order
          // Swagger UI renders groups in the order they appear in this array
          data.tags = sortedTags.map((tag) => ({ name: tag }));

          // Update spec
          // Update spec
          setModifiedSpec({ ...data });
        })
        .catch((err) => console.error("Failed to load spec", err))
        .finally(() => setIsLoading(false));
    }
  }, [activeTab]);

  const scrollToTag = (tag: string) => {
    setActiveTag(tag);
    const elementId = `operations-tag-${tag}`;
    const element = document.getElementById(elementId);
    if (element) {
      // Offset for fixed header (approx 80px) + some breathing room
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        {/* HEADER */}
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

          <div className="flex justify-center">
            <span className="text-[25px] font-bold tracking-tight text-blue-800 dark:text-blue-700">
              Platform API Docs
            </span>
          </div>

          <div className="flex justify-end items-center">
            <nav className="flex items-center space-x-6">
              {["Billing", "SDB", "IDM"].map((tab) => (
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

        {/* MAIN CONTENT AREA */}
        {isLoading ? (
          <div className="flex h-[calc(100vh-80px)] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium animate-pulse">
                Loading {activeTab} APIs...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex max-w-7xl mx-auto items-start gap-6 p-6">
            {/* SIDEBAR */}
            <aside className="hidden md:block w-64 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm sticky top-24 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <nav className="p-4 space-y-1">
                <h3 className="px-2 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 mb-2">
                  Endpoint Groups
                </h3>
                {tags.length === 0 ? (
                  <p className="px-2 text-sm text-gray-400">
                    Loading Groups...
                  </p>
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

            {/* MAIN CONTENT */}
            <main className="flex-1 min-w-0">
              <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 transition-colors duration-300">
                <SwaggerUI
                  spec={modifiedSpec || spec}
                  defaultModelsExpandDepth={-1}
                />
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwaggerDocs;
