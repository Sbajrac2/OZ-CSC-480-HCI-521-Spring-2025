import { useEffect, useState } from "react";
import { Flag, Share, Trash } from "react-bootstrap-icons";
import { IoMdClose } from "react-icons/io";
import { fetchUserProfile } from "../lib/api";

const meaningMap = {
  "Share": "A quote has been shared with you by {from}",
  "Delete": "Your quote has been removed by an admin.",
  "Report": "One of your quotes has been reported and is being reviewed by an admin",
}

const NotificationItem = ({ notification, onRemove }) => {
  const [message, setMessage] = useState(meaningMap[notification.type]);

  useEffect(() => {
    if (notification.from) {
      fetchUserProfile(notification.from)
        .then((profile) => {
          if (profile && profile.Username) setMessage((old_msg) => old_msg.replaceAll("{from}", profile.Username))
          else { throw "bad profile" }
        })
        .catch(() => setMessage((old_msg) => old_msg.replaceAll("{from}", "somebody")));
    }
  }, [notification])

  return<div
    style={{
      position: "relative",
      padding: "12px 0px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom:
        notification.isLast ? "none" : "0.5px solid #ddd",
      margin: 0,
      gap: "4px",
      lineHeight: "14px",
    }}
  >
    <QuoteIcon type={notification.type} />
    <span
      style={{
        fontSize: "13px",
        marginRight: "4px",
        flex: 1,
        overflow: "hidden",
        textAlign: "left",
        textOverflow: "ellipsis",
        padding: "0",
      }}
    >
      {message}
    </span>
    <button
      onClick={onRemove}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#888",
        padding: 0,
        margin: 0,
      }}
      title="Remove notification"
    >
      <IoMdClose size={14} />
    </button>
  </div>
}

const QuoteIcon = ({ type }) => {
  return <div style={{paddingRight: "4px"}}>
    {type == "Share" && <Share style={{ color: "#0005"}} size={16} /> }
    {type == "Delete" && <Trash style={{ color: "#8B000050"}} size={16} /> }
    {type == "Report" && <Flag style={{ color: "#8B000050"}} size={16} /> }
  </div>
}

export default NotificationItem;