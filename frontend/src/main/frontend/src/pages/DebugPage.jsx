import React, { useState } from "react";
import {
  createQuote,
  deleteQuote,
  searchQuotes,
  // add more imports if you want to test them:
  // updateQuote,
  // fetchTopBookmarkedQuotes,
  // reportQuote,
  // fetchUserProfile,
  // fetchTopSharedQuotes,
} from "../lib/api.js"; // Adjust the path as needed

const DebugPage = () => {
  // ------------------------
  // 1) CREATE QUOTE
  // ------------------------
  const [createAuthor, setCreateAuthor] = useState("");
  const [createText, setCreateText] = useState("");
  const [createTags, setTag] = useState(["example, test"]);
  const [createResult, setCreateResult] = useState(null);

  const handleCreateQuote = async (e) => {
    e.preventDefault();
    try {
      const result = await createQuote({
        quote: createText,
        author: createAuthor,
        tags: "example",
      });

      setCreateResult(result.stringify);
    } catch (error) {
      setCreateResult(`Error creating quote: ${error.message}`);
    }
  };

  // ------------------------
  // 2) DELETE QUOTE
  // ------------------------
  const [deleteId, setDeleteId] = useState("");
  const [deleteResult, setDeleteResult] = useState(null);

  const handleDeleteQuote = async (e) => {
    e.preventDefault();
    try {
      const result = await deleteQuote(deleteId);
      setDeleteResult(result);
    } catch (error) {
      setDeleteResult(`Error deleting quote: ${error.message}`);
    }
  };

  // ------------------------
  // 3) SEARCH QUOTE BY ID
  // ------------------------
  const [searchId, setSearchId] = useState("");
  const [searchIdResult, setSearchIdResult] = useState(null);

  const handleSearchById = async (e) => {
    e.preventDefault();
    try {
      // Pass second arg as true to indicate searching by ID
      const result = await searchQuotes(searchId, true);
      setSearchIdResult(result);
    } catch (error) {
      setSearchIdResult(`Error searching quote by ID: ${error.message}`);
    }
  };

  // ------------------------
  // 4) SEARCH QUOTES BY TEXT
  // ------------------------
  const [searchText, setSearchText] = useState("");
  const [searchTextResult, setSearchTextResult] = useState(null);

  const handleSearchByText = async (e) => {
    e.preventDefault();
    try {
      // isQuoteID = false, so it searches by text
      const result = await searchQuotes(searchText, false);
      setSearchTextResult(result);
    } catch (error) {
      setSearchTextResult(`Error searching quotes by text: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Debug Page - Quotes API</h1>

      {/* 1) CREATE QUOTE */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Create Quote</h2>
        <form onSubmit={handleCreateQuote}>
          <div>
            <label>Author: </label>
            <input
              type="text"
              value={createAuthor}
              onChange={(e) => setCreateAuthor(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Text: </label>
            <input
              type="text"
              value={createText}
              onChange={(e) => setCreateText(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create Quote</button>
        </form>
        {createResult && (
          <pre style={{ background: "#f0f0f0", padding: "1rem" }}>
            {JSON.stringify(createResult, null, 2)}
          </pre>
        )}
      </section>

      {/* 2) DELETE QUOTE */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Delete Quote</h2>
        <form onSubmit={handleDeleteQuote}>
          <label>Quote ID: </label>
          <input
            type="text"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            required
          />
          <button type="submit">Delete</button>
        </form>
        {deleteResult && (
          <pre style={{ background: "#f0f0f0", padding: "1rem" }}>
            {JSON.stringify(deleteResult, null, 2)}
          </pre>
        )}
      </section>

      {/* 3) SEARCH BY ID */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Get Quote By ID</h2>
        <form onSubmit={handleSearchById}>
          <label>Quote ID: </label>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            required
          />
          <button type="submit">Search by ID</button>
        </form>
        {searchIdResult && (
          <pre style={{ background: "#f0f0f0", padding: "1rem" }}>
            {JSON.stringify(searchIdResult, null, 2)}
          </pre>
        )}
      </section>

      {/* 4) SEARCH BY TEXT */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Search Quotes By Text</h2>
        <form onSubmit={handleSearchByText}>
          <label>Search Query: </label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            required
          />
          <button type="submit">Search</button>
        </form>
        {searchTextResult && (
          <pre style={{ background: "#f0f0f0", padding: "1rem" }}>
            {JSON.stringify(searchTextResult, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
};

export default DebugPage;
