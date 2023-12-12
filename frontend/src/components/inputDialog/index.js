import React, { useState } from "react";
import Draggable from "react-draggable";
import { useParameters } from "../../contexts/paramsContext";
import "./index.css";

export default function InputDialog({ title, fields, isTimeSigDialogVisible }) {
  const [fieldsState, setFieldsState] = useState(fields);
  const { setNumerator, setDenominator } = useParameters();

  const handleFieldChange = (key) => {
    // setFieldsState()
  }

  const handleApply = () => {
    isTimeSigDialogVisible(false);
  }; // TODO
  const handleClose = () => {
    isTimeSigDialogVisible(false);
  };
  return (
    <div className="input-dialog-wrapper">
      <div className="card-overlay">
        <Draggable
          handle=".handle"
          bounds=".card-overlay"
          onDrag={(e) => e.stopPropagation()}
        >
          <div className="card">
            <div className="handle">
              <h2 className="title">{title}</h2>
            </div>
            <ul className="field-list">
              {Object.entries(fields).map(([k, v]) => {
                return (
                  <li key={k} className="field">
                    <h5 className="field-name">{k}</h5>
                    <input
                      id={k}
                      className="field-input"
                      placeholder={v}
                      onChange={() => handleFieldChange(k)}
                    />
                  </li>
                );
              })}
            </ul>
            <div className="button-group">
              <span className="button apply-button" onClick={handleApply}>
                Apply
              </span>
              <span className="button cancel-button" onClick={handleClose}>
                Cancel
              </span>
            </div>
          </div>
        </Draggable>
      </div>
    </div>
  );
}
