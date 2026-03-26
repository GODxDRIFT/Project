import React from "react";
import "./loadingcomponent.css";
const Loadingcomponent = () => {
  return (
    <>
      {/* <section>
        <div className="loading loading04">
          <span>B</span>
          <span>I</span>
          <span>Z</span>
          <span>I</span>
          <span style={{ color: "var(--blue)" }}>F</span>
          <span style={{ color: "var(--blue)" }}>F</span>
          <span>Y</span>
        </div>
      </section> */}
      <div className="loading-container">
    <div className="triple-spinner"></div>
  </div>
    </>
  );
};

export default Loadingcomponent;
