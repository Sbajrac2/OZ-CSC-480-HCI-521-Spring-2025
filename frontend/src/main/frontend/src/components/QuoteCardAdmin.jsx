import { useState, useEffect, useContext } from "react";
// import { UserContext } from "../lib/Contexts";
import { UserContext, AlertContext } from "../lib/Contexts";

import AlertMessage from "./AlertMessage";
import LoginOverlay from "./LoginOverlay";
import QuoteTags from "./QuoteTags";
import QuoteContent from "./QuoteContent";
import QuoteActions from "../buttons/QuoteActions";
import QuoteUseButton from "../buttons/QuoteUseButton";
import ReportedQuoteCard from "./ReportedQuoteCard";
import DeleteQuoteModal from "./DeleteQuoteModal";
import { deleteQuote } from "../lib/api";


// const QuoteCardAdmin = ({ 
//     quote, 
//     reportCount,
//     reportReasons,
//     // onBookmarkToggle,
//     showViewModal, 
//     // onQuoteUsed 
//     }) => {

const QuoteCardAdmin = ({ 
    quote,  
    reportCount = 0,
    reportReasons = [],
     }) => {
    // const reportCount   = quote.reportCount   || 0;
    // const reportReasons = quote.reportReasons || [];

    
    const [user,setAlert] = useContext(UserContext);
    const [showLogin, setShowLogin] = useState(false);
    //   const [usedDate, setUsedDate] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const handleDeleteConfirm = async () => {
        console.log(" handleDeleteConfirm called for ID:", quote._id);

        try {
            await deleteQuote(quote._id);
            setAlert({ type: "success", message: "Quote deleted" }); 
            onRemoved?.(quote._id); 
        } catch (err) {
            console.error(" deleteQuote threw:", err);

            setAlert({ type: "danger", message: err.message || "Delete failed" });
        } finally {
            setShowDeleteModal(false);
            window.location.reload();
        }
    };

//   useEffect(() => {
//     const usedQuotes = JSON.parse(localStorage.getItem("usedQuotes")) || [];
//     const usedQuote = usedQuotes.find((q) => q.id === quote._id);
//     setUsedDate(usedQuote?.usedDate || null);
//   }, [quote])

  return (
    <div
    //   onClick={() => showViewModal(quote)}
      style={{
        background: "#D6F0C2",
        borderRadius: "23px",
        border: "1px solid rgba(0, 0, 0, 0.10)",
        padding: "20px",
        width: "100%",
        maxWidth: "378px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        position: "relative",
        minHeight: "240px",
      }}
    >
      {alert && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3 px-4" style={{ zIndex: 9999 }}>
          <AlertMessage type={alert.type} message={alert.message} />
        </div>
      )}

      {showLogin && <LoginOverlay setShowLogin={setShowLogin} />}

      <div style={{ display: "flex", gap: "10px" }}>
        <QuoteTags tags={(quote.tags || []).slice(0, 3)} />
        {quote.tags && quote.tags.length > 3 && (
          <span style={{ 
            fontSize: "14px", 
            fontWeight: "bold", 
            color: "#5A5A5A" }}>
            +{quote.tags.length - 3}
          </span>
        )}
      </div>
      <QuoteContent quote={quote} />
      
      {/* {usedDate && (
        <div style={{ marginTop: "0px", fontSize: "14px", fontStyle: "italic", color: "#5A5A5A" }}>
          Used on: {new Date(usedDate).toLocaleDateString()}
        </div>
      )}
      {user && <QuoteUseButton
        quote={quote}
        setShowLogin={setShowLogin}
        onQuoteUsed={onQuoteUsed}
      />} */}

      {user &&(
        <button
            onClick={e =>{
                //to prevent card on-click
                e.stopPropagation();
                setShowPopup(true);

            }}
            style={{
                position: "absolute",
                bottom: "12px",
                right: "12px",
                backgroundColor: "#146C43",
                border: "none",
          
                borderRadius: "8px",
                width: "80px",
                fontSize: "18px",
                color: "#FFFFFF",
                fontWeight: "bold",
                padding: "1px 5px",
                
            }}
            >Review
            </button>
      )}

      {showPopup && (
        <div
          className="popup-overlay"
          onClick={() => setShowPopup(false)}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div onClick={e => e.stopPropagation()}>
            <ReportedQuoteCard
              quote={quote.quote}             
              author={quote.author}
              tags={quote.tags || []}
              reportCount={reportCount}
              reportReasons={reportReasons}
              onIgnore={() => {
                // implementing ignore logic, then close
                setShowPopup(false);
              }}
              onDelete={() => {
                // implement delete logic, then close
                // setShowPopup(<DeleteQuoteModal/>);

                // close the report popup, open the delete confirmation
                setShowPopup(false);
                setShowDeleteModal(true);
                
              }}
            />
          </div>
        </div>
      )}

        {showDeleteModal && (
            <DeleteQuoteModal
            show={showDeleteModal}
            onCancel={() => setShowDeleteModal(false)}
            // onConfirm={() => {
            //     /* call delete here */
            //     deleteQuote;
            //     setShowDeleteModal(false);
                
            // }}
            onConfirm={handleDeleteConfirm}
            />
        )}    

    </div>
  );
};

export default QuoteCardAdmin;
