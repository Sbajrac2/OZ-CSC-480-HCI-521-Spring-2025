import React, { useState } from "react";
import { LayoutSidebar } from "react-bootstrap-icons";

const SidebarAdmin = ({ onFilterChange }) => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedReportFrequency, setSelectedReportFrequency] = useState("Most Reported");
    const [selectedReportCreated, setSelectedReportCreated] = useState("Recent Reports");
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

  const handleReportFrequencyChange = (selectedOption) => {
    setSelectedReportFrequency(selectedOption);
    onFilterChange(selectedReportFrequency, selectedReportCreated, selectedTags); // Trigger filter change callback
  };

  const handleReportCreatedChange = (selectedOption) => {
    setSelectedReportCreated(selectedOption);
    onFilterChange(selectedReportFrequency, selectedReportCreated, selectedTags); // Trigger filter change callback
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
                    <h3
                        className="h5 fw-bold ps-2 text-start"
                        style={{
                            borderBottom: "2px solid #7F7F7F",
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginBottom: "16px",
                        }}
                    >
                        Reported Reasons
                    </h3>
                    {reportReasons.map((reason) => (
                        <div key={reason} className="d-flex justify-content-between align-items-center mb-2">
                            <button
                                className={`btn w-100 text-start ${
                                    selectedTags.includes(reason) ? "fw-bold" : ""
                                }`}
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: "10px 15px",
                                    whiteSpace: "normal",
                                    wordWrap: "break-word",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "230px",
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                }}
                                onClick={() => toggleReason(reason)}
                            >
                                {reason}
                            </button>
                            {selectedTags.includes(reason) && <span style={{ fontSize: "18px" }}>✔</span>}
                        </div>
                    ))}

                    {/* Sort by Filter */}
                    <h3
                        className="h5 fw-bold ps-2 text-start"
                        style={{
                            borderBottom: "2px solid #7F7F7F",
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginTop: "24px",
                            marginBottom: "16px",
                        }}
                    >
                        Sort by
                    </h3>

          {/* Report Frequency Subheading */}
          <h4
            className="h6 fw-bold ps-2 text-start"
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginTop: "8px",
              marginBottom: "10px",
            }}
          >
            Report Frequency
          </h4>
          <div className="d-flex flex-column mb-3">
            {["Most Reported", "Least Reported"].map((option) => (
              <div key={option} className="d-flex justify-content-between align-items-center mb-2">
                <button
                  className={`btn w-100 text-start ${selectedReportFrequency === option ? "fw-bold" : ""}`}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "10px 15px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "230px",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                  onClick={() => handleReportFrequencyChange(option)}
                >
                  {option}
                </button>
                {selectedReportFrequency === option && <span style={{ fontSize: "18px"}}>✔</span>}
              </div>
            ))}
          </div>

                    {/* Report Created Subheading */}
                    <h4
                        className="h6 fw-bold ps-2 text-start"
                        style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            marginTop: "8px",
                            marginBottom: "10px",
                        }}
                    >
                        Report Created
                    </h4>
                    <div className="d-flex flex-column mb-3">
                        {["Recent Reports", "Oldest Reports"].map((option) => (
                            <div key={option} className="d-flex justify-content-between align-items-center mb-2">
                                <button
                                    className={`btn w-100 text-start ${selectedReportCreated === option ? "fw-bold" : ""}`}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: "10px 15px",
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "230px",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                    }}
                                    onClick={() => handleReportCreatedChange(option)}
                                >
                                    {option}
                                </button>
                                {selectedReportCreated === option && <span style={{ fontSize: "18px" }}>✔</span>}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SidebarAdmin;
