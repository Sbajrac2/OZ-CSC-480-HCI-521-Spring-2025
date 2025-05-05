import React, { useEffect, useState } from "react";
import { fetchReportedQuotes } from "../lib/api";
import QuoteCardAdmin from "../components/QuoteCardAdmin";
import { useMemo } from "react";
// import Sidebar from "../components/SidebarAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
// import { LayoutSidebar } from "react-bootstrap-icons";


export default function AdminPanel() {
  const [rawReports, setRawReports] = useState([]);

  // State for sorting
  const [filter, setFilter] = useState("Most Reported");
  const [showFiltered, setShowFiltered] = useState(false)
  // Tags filter state
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);

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

    // Debugging, Log the filtered reports
    console.log("Filtered Reports:", reportsArray);

    return reportsArray;
  }, [rawReports, filter, selectedTags]);

  // Handle filter changes (called from SidebarAdmin)
  const handleFilterChange = (selectedReportFrequency, selectedReportCreated, selectedTags) => {
    setShowFiltered(true)
    let filteredQuote = [...mergedReports];
    console.log("filtered quotes: ", filteredQuote);
    console.log("selected Tags: ", selectedTags);

    // Filter by selected report reasons (tags)
    if (selectedTags.length > 0) {
      filteredQuote = filteredQuote.filter((quote) =>
              selectedTags.some((tag) => quote.reportReasons.includes(tag))
          // Assuming each quote has a 'reportReasons' array
      );
    }

    console.log(filteredQuote)

    // Apply additional filters based on report frequency and created time
    if (selectedReportFrequency === "Most Reported") {
      filteredQuote = filteredQuote.sort((a, b) => b.reportCount - a.reportCount);
    }

    if (selectedReportCreated === "Recent Reports") {
      filteredQuote = filteredQuote.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Update the state with filtered quotes
    setFilteredQuotes(filteredQuote);
  };


//   return (
//     <div style={{ padding: 20 }}>
//       <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
//           {/* Display Sidebar and filter by tags */}
//           <SidebarAdmin
//               onFilterChange={handleFilterChange}
//               onTagSelect={setSelectedTags}
//             />

// <div style={{ flex: 1 }}>
//           {mergedReports.length > 0 ? (
//              mergedReports.map(({ quote, reportCount, reportReasons }) => (
//               <QuoteCardAdmin
//                 key={quote._id}
//                 quote={quote}
//                 reportCount={reportCount}
//                 reportReasons={reportReasons}
//               />
//             ))
//           ) : (
//             <p>No reports found based on the selected filters.</p>
//           )}
//         </div>

//       </div>
//     </div>
//   );

  return (
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <SidebarAdmin
              onFilterChange={handleFilterChange}
              onTagSelect={setSelectedTags}
          />

          <div style={{ flex: 1 }}>
            {/* Display filtered quotes if filters are applied */}
            {showFiltered && filteredQuotes.length > 0 ? (
                filteredQuotes.map(({ quote, reportCount, reportReasons }) => (
                    <QuoteCardAdmin
                        key={quote._id}
                        quote={quote}
                        reportCount={reportCount}
                        reportReasons={reportReasons}
                    />
                ))
            ) : (
                <div>

                  {/* Display merged quotes by default */}
                  {!showFiltered && mergedReports.length > 0 ? (
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
            )}
          </div>
        </div>
      </div>
  );
}

