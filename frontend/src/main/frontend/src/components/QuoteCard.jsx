import React from "react";
import { useNavigate } from "react-router-dom";

const QuoteCard = ({ quote }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/quote/${quote.id}`, { state: { quote } });
  };

  return (
    <div className="col-md-4 mb-4" onClick={handleClick}>
      <div className="card shadow p-3">
        <div className="card-body">
          <p className="card-text">"{quote.text}"</p>
          <h6 className="text-muted">- {quote.author}</h6>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
