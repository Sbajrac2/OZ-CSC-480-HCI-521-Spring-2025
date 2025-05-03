import { useState, useEffect } from "react";
import {
  BookmarkFill,
  Bookmark,
  Share,
  Flag,
  Pencil,
  Trash,
} from "react-bootstrap-icons";
import { bookmarkQuote, deleteBookmark, deleteQuote } from "../lib/api";
import "../scss/tooltip.css";

import ReportModal from "../components/ReportModal";
import ShareQuotePopup from "../components/ShareQuotePopup";
import { shareQuote } from "../lib/api"; // near top
import { AlertContext, UserContext } from "../lib/Contexts";
import { useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import DeleteQuoteModal from "../components/DeleteQuoteModal";

const QuoteContext = createContext(null);

const QuoteActions = ({ quote }) => {
  const [editable, setEditable] = useState(false);
  const [user] = useContext(UserContext);

  useEffect(() => {
    if (!user) return;
    setEditable(user.MyQuotes.includes(quote._id));
  }, [quote, user]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        display: "flex",
        gap: "12px",
      }}
    >
      <QuoteContext.Provider value={quote}>
        <CopyButton />
        <BookmarkButton />
        <ShareButton />
        {!editable && <ReportButton />}
        {editable && <EditButton />}
        {editable && <DeleteButton />}
      </QuoteContext.Provider>
    </div>
  );
};

const CopyButton = () => {
  const [copied, copy] = useState(false);
  const quote = useContext(QuoteContext);
  const [_, setAlert] = useContext(AlertContext);

  const handleClipboardClick = (e) => {
    e.stopPropagation();
    const textToCopy = `"${quote.quote}" - ${quote.author}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        copy(true);
        setTimeout(() => copy(false), 3000);
      })
      .catch((error) => {
        console.error("Error copying quote:", error);
        setAlert({ type: "danger", message: "Failed to copy quote." });
      });
  };

  return (
    <button
      aria-label="Clipboard button"
      className="tip"
      onClick={handleClipboardClick}
      style={{ background: "none", border: "none", cursor: "pointer" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          id="Vector"
          d="M24 3.69231V16.6154C24 17.5946 23.6839 18.5338 23.1213 19.2262C22.5587 19.9187 21.7956 20.3077 21 20.3077C21 21.287 20.6839 22.2261 20.1213 22.9185C19.5587 23.611 18.7956 24 18 24H3C2.20435 24 1.44129 23.611 0.878681 22.9185C0.316071 22.2261 0 21.287 0 20.3077V7.38461C0 6.40535 0.316071 5.4662 0.878681 4.77376C1.44129 4.08132 2.20435 3.69231 3 3.69231C3 2.71305 3.31607 1.7739 3.87868 1.08145C4.44129 0.389011 5.20435 0 6 0H21C21.7956 0 22.5587 0.389011 23.1213 1.08145C23.6839 1.7739 24 2.71305 24 3.69231ZM4.5 3.69231H18C18.7956 3.69231 19.5587 4.08132 20.1213 4.77376C20.6839 5.4662 21 6.40535 21 7.38461V18.4615C21.3978 18.4615 21.7794 18.267 22.0607 17.9208C22.342 17.5746 22.5 17.105 22.5 16.6154V3.69231C22.5 3.20268 22.342 2.7331 22.0607 2.38688C21.7794 2.04066 21.3978 1.84615 21 1.84615H6C5.60217 1.84615 5.22064 2.04066 4.93934 2.38688C4.65804 2.7331 4.5 3.20268 4.5 3.69231ZM18 22.1538C18.3978 22.1538 18.7794 21.9593 19.0607 21.6131C19.342 21.2669 19.5 20.7973 19.5 20.3077V7.38461C19.5 6.89499 19.342 6.42541 19.0607 6.07919C18.7794 5.73297 18.3978 5.53846 18 5.53846H3C2.60217 5.53846 2.22064 5.73297 1.93934 6.07919C1.65804 6.42541 1.5 6.89499 1.5 7.38461V20.3077C1.5 20.7973 1.65804 21.2669 1.93934 21.6131C2.22064 21.9593 2.60217 22.1538 3 22.1538H18Z"
          fill="black"
        />
      </svg>
      {copied && <div className="tip-text">Copied to clipboard!</div>}
    </button>
  );
};

const BookmarkButton = () => {
  const [user] = useContext(UserContext);
  const quote = useContext(QuoteContext);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(quote.bookmarks || 0);
  const [_, setAlert] = useContext(AlertContext);

  useEffect(() => {
    if (!user) return;
    const isUserBookmarked = user.BookmarkedQuotes?.includes(quote._id);
    setIsBookmarked(isUserBookmarked || false);
  }, [user, quote._id]);

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();

    if (!user) {
      setAlert({ type: "danger", message: "Please sign in to bookmark!" });
      return;
    }

    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    setBookmarkCount((prevCount) =>
      newBookmarkState ? prevCount + 1 : prevCount - 1,
    );

    try {
      if (newBookmarkState) {
        await bookmarkQuote(quote._id);
      } else {
        await deleteBookmark(quote._id);
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  return (
    <button
      aria-label="Bookmark button"
      className="tip"
      onClick={handleBookmarkClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        color: user ? (isBookmarked ? "green" : "inherit") : "#00000055",
      }}
    >
      {isBookmarked ? <BookmarkFill size={22} /> : <Bookmark size={22} />}
      <span
        style={{
          fontSize: "14px",
          fontWeight: "500",
          color: user ? "#5A5A5A" : "#5A5A5A55",
        }}
      >
        {bookmarkCount}
      </span>
      {!user && <div className="tip-text">Sign in to use this feature!</div>}
    </button>
  );
};

const ShareButton = () => {
  const [user] = useContext(UserContext);
  const quote = useContext(QuoteContext);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [_, setAlert] = useContext(AlertContext);

  const handleShareClick = (e) => {
    e.stopPropagation();

    if (!user) {
      setAlert({ type: "danger", message: "Please sign in to share!" });
      return;
    }

    setShowSharePopup((prev) => !prev);
  };

  const handleSendQuote = async (user) => {
    try {
      await shareQuote(quote._id, user.email);
      setAlert({
        type: "success",
        message: `Quote successfully shared with ${user.name}!`,
      });
    } catch (error) {
      console.error("Error sharing quote:", error);
      setAlert({
        type: "danger",
        message: "Failed to share the quote. Please try again.",
      });
    }
  };

  return (
    <div className="tip" style={{ position: "relative" }}>
      <button
        aria-label="Share Button"
        onClick={handleShareClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: user ? "#000" : "#0005",
        }}
      >
        <Share size={22} />
      </button>

      {showSharePopup && (
        <div
          aria-label="Share Pop-Up"
          style={{
            position: "absolute",
            top: "30px",
            left: "0",
            zIndex: 10,
          }}
        >
          <ShareQuotePopup
            quote={quote}
            onClose={() => setShowSharePopup(false)}
            onSend={handleSendQuote}
          />
        </div>
      )}
      {!user && <div className="tip-text">Sign in to use this feature!</div>}
    </div>
  );
};

const DeleteButton = () => {
  const [user] = useContext(UserContext);
  const quote = useContext(QuoteContext);
  const [_, setAlert] = useContext(AlertContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteConfirm = async (e) => {
    e.stopPropagation();

    try {
      await deleteQuote(quote._id);
      setAlert({ type: "success", message: "Quote deleted successfully!" });
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      setAlert(error);
    }
  };

  const onclick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  return (
    <>
      <button
        aria-label="Delete Button"
        onClick={onclick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: user ? "#8B0000" : "#8B000055",
        }}
      >
        <Trash size={22} />
      </button>

      {showDeleteModal && (
        <DeleteQuoteModal
          show={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};

const ReportButton = () => {
  const [user] = useContext(UserContext);
  const quote = useContext(QuoteContext);
  const [showReportModal, setShowReportModal] = useState(false);
  const [_, setAlert] = useContext(AlertContext);

  const handleFlagClick = (e) => {
    e.stopPropagation();

    if (!user) {
      setAlert({
        type: "danger",
        message: "To report this quote, Please sign in",
      });
      return;
    }
    setShowReportModal(true);
    //alert("Quote has been reported. Our team will review it shortly.");
  };

  return (
    <>
      <button
        aria-label="Report Button"
        onClick={handleFlagClick}
        className="tip"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: user ? "#8B0000" : "#8B000055",
        }}
      >
        <Flag size={22} />
        {!user && <div className="tip-text">Sign in to use this feature!</div>}
      </button>
      <ReportModal
        showReportModal={showReportModal}
        onClose={() => setShowReportModal(false)}
        user={user}
        quoteID={quote._id}
      />
    </>
  );
};

const EditButton = () => {
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const quote = useContext(QuoteContext);
  const handleEditClick = () => {
    navigate(`/edit-quote/${quote._id}`, {
      state: { quote: { ...quote, tags: quote.tags || [] } },
    });
  };

  return (
    <button
      aria-label="Edit Button"
      onClick={handleEditClick}
      className="tip"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: user ? "#000" : "#0005",
      }}
    >
      <Pencil size={22} />
    </button>
  );
};

export default QuoteActions;
