import React, { useContext, useEffect, useRef, useState } from "react";
import { handleSend, searchUsersByQuery } from "../lib/api.js";
import { AlertContext } from "../lib/Contexts.jsx";

const ShareQuotePopup = ({ quote, onClose }) => {
  const [input, setInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [_, setAlert] = useContext(AlertContext)
  const [statusMessage, setStatusMessage] = useState(null); 
  // New state for status message

  const [linkCopied, setLinkCopied] = useState(false); 
  // Track link copied status

  const popupRef = useRef(null);

    // Close the popup when clicking outside
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
          onClose();
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!input.trim()) {
        setFilteredUsers([]);
        setIsTyping(false);
        return;
      }

      try {
        const results = await searchUsersByQuery(input);
        const mappedResults = results.map((user) => ({
          name: user.Username,
          email: user.Email,
          id: user._id?.$oid,
        }));
        setFilteredUsers(mappedResults);
      } catch (err) {
        console.error("Error searching users:", err);
      } finally {
        setIsTyping(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [input]);


   // close on outside click
    // useEffect(() => {
    //     const handleClickOutside = (e) => {
    //         if (popupRef.current && !popupRef.current.contains(e.target)) {
    //             onClose();
    //         }
    //     };
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => document.removeEventListener("mousedown", handleClickOutside);
    // }, [onClose]);

    // Debounced user search
    // useEffect(() => {
    //     const timeout = setTimeout(async () => {
    //         if (!input.trim()) {
    //             setFilteredUsers([]);
    //             setIsTyping(false);
    //             return;
    //         }
    //
    //         try {
    //             const res = await fetch(`/api/users/search?q=${encodeURIComponent(input)}`);
    //             const data = await res.json();
    //             setFilteredUsers(data);
    //             setIsTyping(true);
    //         } catch (err) {
    //             console.error("User search failed:", err);
    //         }
    //     }, 300);
    //
    //     return () => clearTimeout(timeout);
    // }, [input]);
    
  const handleUserClick = (user) => {
    setInput(user.email); 
    setFilteredUsers([]);
  };

  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.email === user.email)
        ? prev.filter((u) => u.email !== user.email)
        : [...prev, user]
    );
  };

  const copyLink = () => {
    const link = `${window.location.origin}/quote/${quote._id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
    setLinkCopied(true); 

    setTimeout(() => {
      setLinkCopied(false); // Reset linkCopied after 2 seconds
    }, 2000);

  };




  const handleSendMessage = async () => {
    handleSend(input, quote._id)
      .then(() => {
        setStatusMessage("Message sent successfully!")
      })
      .catch((e) => {
        console.error("Error sending message:", e);
        setStatusMessage("Failed to send message. Please try again.");
      })
      .finally(() => {
        // Close the popup after 2s of showing the message
        setTimeout(() => onClose(), 2000); 
      })
  };

  return (
    <div
      ref={popupRef}
      // to prevent clicks from bubbling up to the document
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "12px",
        width: "280px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff9d1",
          padding: "8px",
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: "8px 8px 0 0",
          marginBottom: "10px",
        }}
      >
        Share this quote
      </div>

      <input
        type="text"
        placeholder="Search by username or email..."
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setIsTyping(true);
        }}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      />

            {/*{isTyping && filteredUsers.length > 0 && (*/}
            {/*    <ul style={{ maxHeight: "100px", overflowY: "auto", padding: 0, margin: 0 }}>*/}
            {/*        {filteredUsers.map((user) => (*/}
            {/*            <li*/}
            {/*                key={user.email}*/}
            {/*                onClick={() => toggleUser(user)}*/}
            {/*                style={{*/}
            {/*                    padding: "6px",*/}
            {/*                    cursor: "pointer",*/}
            {/*                    backgroundColor: selectedUsers.some(u => u.email === user.email)*/}
            {/*                        ? "#e0f7fa"*/}
            {/*                        : "#fff",*/}
            {/*                    borderBottom: "1px solid #eee"*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <strong>{user.name}</strong> – {user.email}*/}
            {/*            </li>*/}
            {/*        ))}*/}
            {/*    </ul>*/}
            {/*)}*/}

            {/*{selectedUsers.length > 0 && (*/}
            {/*    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "10px 0" }}>*/}
            {/*        {selectedUsers.map((user) => (*/}
            {/*            <div*/}
            {/*                key={user.email}*/}
            {/*                style={{*/}
            {/*                    background: "#d0f0ff",*/}
            {/*                    padding: "4px 8px",*/}
            {/*                    borderRadius: "12px",*/}
            {/*                    fontSize: "13px",*/}
            {/*                    display: "flex",*/}
            {/*                    alignItems: "center",*/}
            {/*                    gap: "4px"*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                {user.name}*/}
            {/*                <span*/}
            {/*                    style={{ cursor: "pointer", fontWeight: "bold" }}*/}
            {/*                    onClick={() => toggleUser(user)}*/}
            {/*                >*/}
            {/*                    ×*/}
            {/*                </span>*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*)}*/}

      {filteredUsers.length > 0 && (
        <ul
          style={{
            maxHeight: "100px",
            overflowY: "auto",
            padding: 0,
            margin: 0,
            listStyle: "none",
          }}
        >
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserClick(user)}
              style={{
                padding: "6px",
                cursor: "pointer",
                backgroundColor: selectedUsers.some((u) => u.email === user.email)
                  ? "#e0f7fa"
                  : "#fff",
                borderBottom: "1px solid #eee",
              }}
            >
              <strong>{user.name}</strong> – {user.email}
            </li>
          ))}
        </ul>
      )}

      {selectedUsers.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            margin: "10px 0",
          }}
        >
          {selectedUsers.map((user) => (
            <div
              key={user.email}
              style={{
                background: "#d0f0ff",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {user.name}
              <span
                style={{ cursor: "pointer", fontWeight: "bold" }}
                onClick={() => toggleUser(user)}
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        // onClick={() => handleSend(input, quote._id)}
        onClick={handleSendMessage}

        style={{
          width: "100%",
          padding: "8px",
          background: "#146C43",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "8px",
        }}
      >
        Send
      </button>

      {statusMessage && (
        <div
          style={{
            marginTop: "12px",
            color: statusMessage === "Message sent successfully!" ? "#28a745" : "#dc3545",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {statusMessage}
        </div>
      )}
      <hr style={{ margin: "12px 0" }} />

      <div
        onClick={copyLink}
        style={{
          textAlign: "center",
          color: "#146C43",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🔗 Copy Shareable Link
      </div>

      {linkCopied && (
        <div
          style={{
            textAlign: "center",
            color: "#28a745",
            fontWeight: "bold",
            marginTop: "8px",
          }}
        >
          Link copied to clipboard!
        </div>
      )}
    </div>

    
      );
};

export default ShareQuotePopup;
