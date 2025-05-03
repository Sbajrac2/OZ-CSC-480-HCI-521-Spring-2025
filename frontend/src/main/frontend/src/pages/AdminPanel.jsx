import React, { useEffect, useState } from "react";
import { fetchReportedQuotes } from "../lib/api";
import QuoteCardAdmin from "../components/QuoteCardAdmin";
import { useMemo } from "react";
import Sidebar from "../components/SidebarAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import { LayoutSidebar } from "react-bootstrap-icons";


export default function AdminPanel() {
  const [rawReports, setRawReports] = useState([]);

  // State for sorting
  const [filter, setFilter] = useState("Most Reported"); 
   // Tags filter state
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetchReportedQuotes()
      .then((reports) => setRawReports(reports))
      .catch((err) => console.error(err));
  }, []);

  const mergedReports = useMemo(() => {
    const filtered = rawReports.filter((r) => r.quote);

    const map = new Map();

    // Merge reports based on quote ID
    filtered.forEach((r) => {
      const id = r.quote._id;
      if (!map.has(id)) {
        map.set(id, {
          quote: r.quote,
          reportCount: r.reporter_ids.length,
          reportReasons: [...r.context_types],
        });
      } else {
        const existing = map.get(id);
        existing.reportCount += r.reporter_ids.length;
        existing.reportReasons = Array.from(
          new Set([...existing.reportReasons, ...r.context_types])
        );
      }
    });

    let reportsArray = Array.from(map.values());

    // Apply sort filter
    const sortOptions = {
      MostReported: (a, b) => b.reportCount - a.reportCount,
      DateCreatedRecent: (a, b) => new Date(b.quote.date) - new Date(a.quote.date),
      DateCreatedOldest: (a, b) => new Date(a.quote.date) - new Date(b.quote.date),
    };

    reportsArray.sort(sortOptions[filter]);

    // Filter by selected tags
    if (selectedTags.length > 0) {
      reportsArray = reportsArray.filter((report) =>
        selectedTags.every((tag) => report.quote.tags.includes(tag))
      );
    }

    console.log("Filtered Reports:", reportsArray); // Debugging: Log the filtered reports

    return reportsArray;
  }, [rawReports, filter, selectedTags]);

  // Handle filter changes (called from SidebarAdmin)
  const handleFilterChange = (newFilter, selectedTags) => {
    setFilter(newFilter); // Update sorting filter
    setSelectedTags(selectedTags); // Update tag filters
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {/* Display Sidebar and filter by tags */}
          <SidebarAdmin
              onFilterChange={handleFilterChange}
              onTagSelect={setSelectedTags}
            />

<div style={{ flex: 1 }}>
          {mergedReports.length > 0 ? (
            mergedReports.map(({ quote, reportCount, reportReasons }) => (
              <QuoteCardAdmin
                key={quote._id}
                quote={quote}
                reportCount={reportCount}
                reportReasons={reportReasons}
              />
            ))
          ) : (
            <p>No reports found based on the selected filters.</p>
          )}
        </div>
     
      </div>
    </div>
  );
}

