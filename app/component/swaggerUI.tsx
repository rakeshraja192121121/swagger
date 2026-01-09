"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import Sidebar from "./Sidebar";
import Header from "./Header"; // Adjust path as needed

interface SwaggerProps {
  spec?: object;
  url?: string;
}

const SwaggerDocs = ({ spec, url }: SwaggerProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string>("");
  const [isDark, setIsDark] = useState(false);

  const [activeTab, setActiveTab] = useState("Billing");
  const [activeVersion, setActiveVersion] = useState("Billing");
  const [searchTerm, setSearchTerm] = useState("");
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
              // 0. Filter by Version (Billing Tab Only)
              if (activeTab === "Billing") {
                const isV1 = pathKey.includes("/v1/");
                const isV2 = pathKey.includes("/v2/");

                // Rule: "only the billing with v1 and v2 should be there remove the old one"
                // 1. Remove anything that isn't v1 or v2
                if (!isV1 && !isV2) {
                  delete data.paths[pathKey];
                  return;
                }

                // 2. Apply Specific Version Filter
                if (activeVersion === "v1" && !isV1) {
                  delete data.paths[pathKey];
                  return;
                }
                if (activeVersion === "v2" && !isV2) {
                  delete data.paths[pathKey];
                  return;
                }
              }

              // 0.5 Filter by Search Term
              if (searchTerm) {
                if (!pathKey.toLowerCase().includes(searchTerm.toLowerCase())) {
                  delete data.paths[pathKey];
                  return;
                }
              }

              const pathItem = data.paths[pathKey];

              // Logic: /{serviceName}/{version}/{ResourceName}/...
              // 1. Split path
              const segments = pathKey.split("/").filter(Boolean);

              // 2. Check for {userid} or similar patterns
              const userIdIndex = segments.findIndex((s) =>
                /^{user.*id}$/i.test(s)
              );

              // 3. Find version index (v1, v2, etc)
              const versionIndex = segments.findIndex((s) =>
                /^v[0-9]+$/i.test(s)
              );

              let groupName = "Other";

              if (userIdIndex !== -1 && segments.length > userIdIndex + 1) {
                // Priority 1: Field after {userid}
                groupName = segments[userIdIndex + 1];
              } else if (versionIndex !== -1 && segments.length > versionIndex + 1) {
                // Priority 2: Field after version
                groupName = segments[versionIndex + 1];
              } else if (segments.length > 0) {
                // Priority 3: First segment
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
  }, [activeTab, activeVersion, searchTerm]); // Add searchTerm dependency

  // Reset version filter when tab changes
  useEffect(() => {
    setActiveVersion("Billing");
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
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeVersion={activeVersion}
          setActiveVersion={setActiveVersion}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

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
            <Sidebar
              tags={tags}
              activeTag={activeTag}
              scrollToTag={scrollToTag}
            />

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
