import React from "react";

const Navbar = ({ setPage }) => {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <button onClick={() => setPage("current")}>
        Current Weather
      </button>

      <button onClick={() => setPage("historical")}>
        Historical Data
      </button>
    </div>
  );
};

export default Navbar;