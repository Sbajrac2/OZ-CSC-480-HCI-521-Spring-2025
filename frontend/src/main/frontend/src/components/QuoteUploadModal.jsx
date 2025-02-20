import React, { useState } from "react";
import { createQuote } from "../lib/api"; 

const QuoteUploadModal = ({ isVisible, onClose, onSubmit, quoteText, setQuoteText }) => {
  if (!isVisible) return null;

  const [author, setAuthor] = useState("Unknown");
  const [tags, setTags] = useState(["inspirational", "motivating"]);
  const [customTag, setCustomTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleQuoteTextChange = (e) => setQuoteText(e.target.value);
  const handleAuthorChange = (e) => setAuthor(e.target.value || "Unknown");

  const handleTagChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, (option) => option.value);
    setTags(selectedTags);
  };

  const handleCustomTagChange = (e) => setCustomTag(e.target.value);
  const handleAddCustomTag = () => {
    if (customTag && !tags.includes(customTag)) {
      setTags([...tags, customTag]);
      setCustomTag("");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!quoteText.trim()) {  
      setError("Quote text cannot be empty.");
      setLoading(false);
      return;
    }

    const quoteData = {
      quote: quoteText.trim(), // ✅ Changed from "text" to "quote"
      author: author || "Unknown",
      tags: tags || [],
      date: new Date().toISOString().split("T")[0], // Ensure correct date format
    };

    console.log("Sending Quote Data:", quoteData); // ✅ Debugging Log

    try {
      const response = await createQuote(quoteData);
      if (!response || response.error) { 
        throw new Error("Failed to create quote.");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSubmit(quoteData);
      setQuoteText("");
      setAuthor("Unknown");
      setTags(["inspirational", "motivating"]);
      setCustomTag("");
    } catch (err) {
      console.error("Error submitting quote:", err);
      setError("Error submitting quote. Please try again.");
    } finally {
      setLoading(false);
    }
};

  

  return (
    <div className="modal show" style={{ display: "block" }} aria-labelledby="uploadQuoteModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="uploadQuoteModal">Upload Quote</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Submit your new quote:</p>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Quote submitted successfully!</div>}

            <textarea
              className="form-control"
              rows="3"
              value={quoteText}
              onChange={handleQuoteTextChange}
              placeholder="Enter your quote here"
            />

            <div className="mt-3">
              <label htmlFor="authorInput">Author:</label>
              <input
                id="authorInput"
                type="text"
                className="form-control"
                value={author}
                onChange={handleAuthorChange}
                placeholder="Enter author (default is Unknown)"
              />
            </div>

            <div className="mt-3">
              <label>Tags:</label>
              <select
                className="form-select"
                multiple
                value={tags}
                onChange={handleTagChange}
                style={{ borderRadius: "25px" }}
              >
                <option value="inspirational">Inspirational</option>
                <option value="motivating">Motivating</option>
                <option value="thoughtful">Thoughtful</option>
                <option value="life">Life</option>
              </select>

              <div className="d-flex mt-2">
                <input
                  type="text"
                  className="form-control"
                  value={customTag}
                  onChange={handleCustomTagChange}
                  placeholder="Add your own tag"
                />
                <button
                  className="btn btn-outline-primary ms-2"
                  onClick={handleAddCustomTag}
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteUploadModal;
