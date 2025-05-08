import { useState, useEffect, useContext, useCallback } from "react";
import QuoteCard from "../components/QuoteCard";
import Input from "../components/Input";
import Sidebar from "../components/Sidebar";
import ToggleButton from "../buttons/ToggleButton";
import QuoteViewModal from "../components/QuoteViewModal";
import { fetchQuoteById, fetchUserQuotes, fetchUsedQuotes } from "../lib/api";
import { UserContext } from "../lib/Contexts";

const MyCollection = () => { 
  const [searchTerm, setSearchTerm] = useState("");
  const [userQuotes, setUserQuotes] = useState([]);
  const [bookmarkedQuotes, setBookmarkedQuotes] = useState([]);
  const [sharedQuotes, setSharedQuotes] = useState([]); 
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [showUsed, setShowUsed] = useState("all");
  const [usedQuotes, setUsedQuotes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]); 
  const [viewedQuote, setViewedQuote] = useState(null);
  const [user] = useContext(UserContext);

  const closeView = () => setViewedQuote(null); 

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      try {
        const [userQuotes, bookmarkedQuotes, sharedQuotes] = await Promise.all([
          fetchUserQuotes(user._id.$oid),
          Promise.all(user.BookmarkedQuotes.map(fetchQuoteById)).then((quotes) =>
            quotes.filter(Boolean)
          ),
          Promise.all(
            user.SharedQuotes.map((shared) => fetchQuoteById(shared.quoteId))
          ).then((quotes) => quotes.filter(Boolean)),
        ]);
        setUserQuotes(userQuotes);
        setBookmarkedQuotes(bookmarkedQuotes);
        setSharedQuotes(sharedQuotes);
        setFilteredQuotes([...userQuotes, ...bookmarkedQuotes, ...sharedQuotes]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const getUsedQuotes = async () => {
      const used = await fetchUsedQuotes();
      const ids = Object.keys(user?.UsedQuotes || {});
      setUsedQuotes(ids);
    };
    getUsedQuotes();
  }, [user]);


  const handleFilterChange = useCallback((filtered) => {
    setFilteredQuotes((prev) => (JSON.stringify(prev) !== JSON.stringify(filtered) ? filtered : prev));
  }, []);

  const handleQuoteUsed = async (quoteId) => {
    try {
      await useQuote(quoteId);
      setUsedQuotes((prev) => [...new Set([...prev, quoteId])]);
      setFilteredQuotes((prev) => prev.filter((quote) => quote._id !== quoteId));
    } catch (error) {
      console.error("Failed to mark quote as used:", error);
    }
  };

  const displayedQuotes = Array.from(
    new Set(filteredQuotes.map((quote) => quote._id))
  ).map((id) => filteredQuotes.find((quote) => quote._id === id))
  .filter(({ _id, author, quote, tags }) => {
    const matchesSearch =
      author.toLowerCase().includes(searchTerm) ||
      quote.toLowerCase().includes(searchTerm) ||
      tags.some((tag) => tag.toLowerCase().includes(searchTerm));

    const matchesTags =
      selectedTags.length === 0 || selectedTags.every((tag) => tags.includes(tag));

    const matchesUsedFilter =
      showUsed === "all" ||
      (showUsed === "used" && usedQuotes.includes(_id)) ||
      (showUsed === "unused" && !usedQuotes.includes(_id));

    return matchesSearch && matchesTags && matchesUsedFilter;
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-start" style={{ paddingTop: "35px" }}>
          <h1 style={{ fontSize: "30px", color: "#4a4a4a" }}>My Collection</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12 text-center mb-4">
          <div className="mt-3">
            <ToggleButton
              activeIndex={["all", "unused", "used"].indexOf(showUsed)}
              onToggle={(index) => setShowUsed(["all", "unused", "used"][index])}
              labels={["All", "Unused", "Used"]}
            />
          </div>
          <hr style={{ marginTop: "20px", borderTop: "2px solid #ccc" }} />
        </div>
      </div>
      <div className="row">
        <Sidebar
          userQuotes={userQuotes}
          bookmarkedQuotes={bookmarkedQuotes}
          sharedQuotes={sharedQuotes} 
          onFilterChange={handleFilterChange}
          onTagSelect={setSelectedTags}
          myQuotesIds={user?.MyQuotes || []} 
        />
        <div
          className="col"
          style={{
            paddingLeft: "70px", 
          }}
        >
          <div
            className="row w-100"
            style={{
              gap: "32px",
            }}
          >
            {displayedQuotes.length > 0 ? (
              displayedQuotes.map((quote) => (
                <QuoteCard
                  key={quote._id}
                  quote={quote}
                  onQuoteUsed={handleQuoteUsed}
                  showViewModal={setViewedQuote} 
                />
              ))
            ) : (
              <p className="text-center w-100">No quotes found.</p>
            )}
          </div>
        </div>
      </div>
      {viewedQuote && (
        <QuoteViewModal
          quote={viewedQuote}
          close={closeView}
        />
      )}
    </div>
  );
};

export default MyCollection;
