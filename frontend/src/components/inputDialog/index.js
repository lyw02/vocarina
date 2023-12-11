import React from "react";
import Draggable from "react-draggable";
import "./index.css";

export default function InputDialog({ title, fields }) {
  return (
    <div className="input-dialog-wrapper">
      <div className="card-overlay">
        <Draggable handle=".handle" onDrag={(e) => e.stopPropagation()}>
          <div className="card">
            <div className="handle">
              <h2 className="title">{title}</h2>
            </div>
            <ul className="field-list">
              {Object.entries(fields).map(([key, value]) => {
                return (
                  <li key={key} className="field">
                    <h5 className="field-name">{key}</h5>
                    <input className="field-input" placeholder={value} />
                  </li>
                );
              })}
            </ul>
            <div className="button-group">
              <span className="button apply-button">Apply</span>
              <span className="button cancel-button">Cancel</span>
            </div>
          </div>
        </Draggable>
      </div>
    </div>
  );
}
