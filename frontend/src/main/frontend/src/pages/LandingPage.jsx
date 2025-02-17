import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import QuoteCard from "../components/QuoteCard";
import NotificationPage from "./NotificationPage";


const LandingPage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const quotes = [ //temp data, will replace with real quotes
    { id: 1, author: "Author 1", text: "This is a sample quote." },
    { id: 2, author: "Author 2", text: "Another inspiring quote." },
    { id: 3, author: "Author 3", text: "Yet another meaningful quote." }
  ];

  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleNotificationRedirect = () => {
//     navigate("/notifications");
  };


  return (
  <div>
     <div className="d-flex justify-content-end flex-row gap-5 p-3">
              <button
                className="btn btn-secondary dropdown-toggle"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-expanded={showNotifications}>
                Notification
              </button>
              {showNotifications && (
                <div className="dropdown-menu show mt-5">
                  <NotificationPage />
                </div>
              )}
            </div>
    <div className="container vh-100 d-flex flex-column">
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "33vh" }}>
{/*       <div className="dropdown navbar-nav ms-auto mb-2 mb-lg-0"> */}
{/*         <a className="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> */}
{/*           Notification */}
{/*         </a> */}
{/*         <div className="dropdown-menu"> */}
{/*           <NotificationPage/> */}
{/*          </div> */}
{/*       </div> */}

        <h1 className="mb-3">Search for Quotes</h1>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Enter keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary mt-3" onClick={handleLoginRedirect}>
          Login
        </button>
{/*                 <button className="btn btn-secondary mt-3" onClick={handleNotificationRedirect}> */}
{/*                   Notifications */}
{/*                 </button> */}
      </div>

      <div className="flex-grow-1 d-flex justify-content-center">
        <div className="row w-100">
          {quotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      </div>
{/*       <NotificationPage/> */}
    </div>
    </div>
  );
};

export default LandingPage;
