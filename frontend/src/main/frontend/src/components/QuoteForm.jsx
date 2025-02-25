import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateQuote, deleteQuote } from "../lib/api";

const QuoteForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quote } = location.state || {};

  const [updateId, setUpdateId] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [updateAuthor, setUpdateAuthor] = useState("");
  const [updateTagsInput, setUpdateTagsInput] = useState("");

  useEffect(() => {
    if (quote) {
      setUpdateId(quote._id);
      setUpdateText(quote.text || "");
      setUpdateAuthor(quote.author || "Unknown");
      setUpdateTagsInput(quote.tags ? quote.tags.join(", ") : "");
    }
  }, [quote]);

  const handleUpdateQuote = async (e) => {
    e.preventDefault();
    if (!updateId.trim()) return;

    const tagsArray = updateTagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      _id: updateId.trim(),
      author: updateAuthor || "Unknown",
      quote: updateText || "",
      tags: tagsArray.length ? tagsArray : [],
    };

    try {
      await updateQuote(payload);
    } catch (error) {
      console.error("Error updating quote:", error);
    } finally {
      localStorage.setItem("alertMessage", "Quote updated successfully!");
      navigate("/"); 
    }
  };

const handleDeleteQuote = async (e) => {
  e.preventDefault();
  if (!updateId.trim()) return;

  try {
    await deleteQuote(updateId);
  } catch (error) {
    console.error("Error deleting quote:", error);
  } finally {
    localStorage.setItem("alertMessage", "Quote deleted successfully!");
    navigate("/"); 
  } 
};

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <h1>Edit Quote</h1>
      <form className="w-50" onSubmit={handleUpdateQuote}>
        <div className="mb-3">
          <label htmlFor="quoteText" className="form-label">Quote Text</label>
          <textarea
            id="quoteText"
            className="form-control"
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author</label>
          <input
            type="text"
            id="author"
            className="form-control"
            value={updateAuthor}
            onChange={(e) => setUpdateAuthor(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">Tags</label>
          <input
            type="text"
            id="tags"
            className="form-control"
            value={updateTagsInput}
            onChange={(e) => setUpdateTagsInput(e.target.value)}
            placeholder="Comma separated tags"
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Quote</button>
      </form>

      <form className="w-50 mt-3" onSubmit={handleDeleteQuote}>
        <button type="submit" className="btn btn-danger">Delete Quote</button>
      </form>
    </div>
  );
};

export default QuoteForm;
