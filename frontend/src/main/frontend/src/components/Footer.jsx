import React from "react";
import logo from "../assets/logo.png"; 

const Footer = ({ isVisible }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: isVisible ? "0" : "-100px", 
        left: 0,
        width: "100%",
        backgroundColor: "#c3c3c2", 
        color: "white",
        padding: "10px 100px", 
        display: "flex",
        justifyContent: "space-between", 
        alignItems: "center", 
        transition: "bottom 0.5s ease-in-out", 
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            height: "40px", 
            width: "130px", 
          }}
        />
        <p style={{ margin: 0, color: "black" }}>
          &copy; 2025 Quote Finder App. All rights reserved.
        </p>
      </div>

      <a
        href="/CommunityGuidelines"
        style={{
          color: "black",
          textDecoration: "none",
        }}
      >
        About/Community Guidelines
      </a>
    </div>
  );
};

export default Footer;