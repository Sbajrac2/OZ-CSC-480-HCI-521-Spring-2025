import React, { useContext, useState } from "react";
import { useQuote } from "../lib/api";
import { UserContext } from "../lib/Contexts";

const QuoteUseButton = ({ quote, setShowLogin, onQuoteUsed }) => {
  const [used, setUsed] = useState(false);
  const [_, setAlert] = useContext(UserContext);

  const handleUsedClick = async (e) => {
    e.stopPropagation();
    if (!setAlert) {
      setAlert({ type: "danger", message: "You must be signed in to use a quote!" });
      setShowLogin(true);
      return;
    }

    try {
      await useQuote(quote._id); 
      setAlert({ type: "success", message: "Quote marked as used!" });
      setUsed(true);
      window.location.reload(); 
      onQuoteUsed?.(quote._id); 
    } catch (error) {
      setAlert({ type: "danger", message: "Failed to mark quote as used." });
    }
  };

  return (
    <button
      style={{
        position: "absolute",
        bottom: "12px",
        right: "12px",
        background: used ? "#28A745" : "#146C43",
        borderRadius: "8px",
        width: "80px",
        fontSize: "18px",
        color: "#FFFFFF",
        fontWeight: "bold",
        padding: "1px 5px",
      }}
      aria-label="Use button"
      onClick={handleUsedClick}
    >
      {used ? "✔Used" : "Use"}
    </button>
  );
};

export default QuoteUseButton;
