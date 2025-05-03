import React, { useState } from "react";
import { LayoutSidebar } from "react-bootstrap-icons";

const SidebarAdmin = ({ onFilterChange, onTagSelect }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [filter, setFilter] = useState("Most Reported");
  const [isOpen, setIsOpen] = useState(true);

  const reportReasons = [
    "Hate speech/Harassment",
    "Privacy Violation",
    "Intellectual Property Violation/False Information",
    "Advertisement/Promotion of Illegal Activity or Content",
    "Impersonation",
    "Other"
  ];

  const toggleReason = (reason) => {
    setSelectedTags((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    onFilterChange(selectedFilter, selectedTags); // Trigger filter change callback
  };

  return (
    <div
      className={`d-flex flex-column border-end pt-2 pb-2 shadow-sm ${isOpen ? "flex-shrink-0" : ""}`}
      style={{
        width: isOpen ? "300px" : "0",
        backgroundColor: "#FDF7CD",
        overflow: "hidden",
        transition: "width 0.3s ease",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      {/* Collapse Button */}
      <div className="d-flex justify-content-end">
        <button className="btn w-20" onClick={() => setIsOpen(!isOpen)}>
          <LayoutSidebar size={22}></LayoutSidebar>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Reported Reasons Filter */}
          <h3 className="h5 fw-bold ps-2 text-start" style={{ borderBottom: "1px solid black", width: "200px" }}>
            Reported Reasons
          </h3>
          {reportReasons.map((reason) => (
            <div key={reason} className="d-flex justify-content-between align-items-center">
              <button
                className={`btn w-100 text-start ${
                  selectedTags.includes(reason) ? "fw-bold" : ""
                }`}
                style={{
                  background: "none",
                  border: "none",
                  padding: "10px 15px",
                  whiteSpace: "normal",  // Allow text to wrap
                  wordWrap: "break-word", // Make sure words break when too long
                  overflow: "hidden", // Hide overflowing text
                  textOverflow: "ellipsis", // Optionally add an ellipsis if the text is too long
                  maxWidth: "250px", // Limit width if needed
                }}
                onClick={() => toggleReason(reason)}
              >
                {reason}
              </button>
              {selectedTags.includes(reason) && <span>✔</span>}
            </div>
          ))}

          {/* Sort By Filter */}
          <h3 className="h5 fw-bold ps-2 text-start" style={{ borderBottom: "1px solid black", width: "200px" }}>
            Sort by
          </h3>
          {["Most Reported", "Date Created Recent", "Date Created Oldest"].map((option) => (
            <div key={option} className="d-flex justify-content-between align-items-center">
              <button
                className={`btn w-100 text-start ${filter === option ? "fw-bold" : ""}`}
                style={{
                  background: "none",
                  border: "none",
                  padding: "10px 15px",
                  whiteSpace: "normal",  // Allow text to wrap
                  wordWrap: "break-word", // Make sure words break when too long
                  overflow: "hidden", // Hide overflowing text
                  textOverflow: "ellipsis", // Optionally add an ellipsis if the text is too long
                  maxWidth: "250px", // Limit width if needed
                }}
                onClick={() => handleFilterChange(option)}
              >
                {option}
              </button>
              {filter === option && <span>✔</span>}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SidebarAdmin;
