import React from "react";
import "./CyclimateEvents.scss";

export function CyclimateEvents({ children }) {
  return (
    <div className="events">
      <div className="events-container">
        {React.Children.toArray(children).map((child) =>
          React.cloneElement(child, {})
        )}
      </div>
    </div>
  );
}
