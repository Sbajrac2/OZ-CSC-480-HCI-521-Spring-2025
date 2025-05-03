import React from "react";
import { Trash2 } from "lucide-react";

const DeleteQuoteModal = ({ show, onCancel, onConfirm }) => {
    if (!show) return null;

    return (
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
            <div style={{ 
                backgroundColor: "#FCFFF7", 
                padding: "30px 40px", 
                borderRadius: "20px", 
                width: "fit-content", 
                minWidth: "300px", 
                textAlign: "center", 
                position: "relative" 
                }}>

                <button onClick={onCancel} style={{ 
                    position: "absolute", 
                    top: "10px", 
                    right: "10px", 
                    background: "none", 
                    border: "none", 
                    fontSize: "24px", 
                    cursor: "pointer" 
                    }}>✖</button>

                <h2 style={{ 
                    fontSize: "22px", 
                    fontWeight: "bold", 
                    marginBottom: "10px" 
                    }}>Delete Quote?</h2>

                <p style={{ 
                    fontSize: "16px", 
                    marginBottom: "20px" 
                    }}>This quote will no longer appear on Quotable.</p>

                <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                    <button onClick={onCancel} style={{ 
                        padding: "10px 20px", 
                        borderRadius: "12px", 
                        backgroundColor: "#D9D9D9", 
                        border: "none", 
                        fontWeight: "bold", 
                        cursor: "pointer" 
                        }}>Cancel</button>

                    <button onClick={onConfirm} style={{ 
                        padding: "10px 20px", 
                        borderRadius: "12px", 
                        backgroundColor: "#A93D2D", 
                        color: "white", 
                        border: "none", 
                        fontWeight: "bold", 
                        cursor: "pointer", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px" 
                        }}>
                            
                        <Trash2 size={18} /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteQuoteModal;
