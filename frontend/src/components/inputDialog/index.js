import React, { useState } from "react";
import Draggable from "react-draggable";
import "./index.css";

export default function InputDialog({
  title,
  fields,
  setters,
  isDialogVisible,
  visibleAlias,
}) {
  const [fieldsState, setFieldsState] = useState(fields);

  const handleFieldChange = (key, value) => {
    setFieldsState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleApply = () => {
    Object.entries(fieldsState).forEach(([k, v]) => {
      setters[k](v);
    });
    isDialogVisible(visibleAlias, false);
  };

  const handleClose = () => {
    isDialogVisible(visibleAlias, false);
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
                      name={k}
                      className="field-input"
                      placeholder={v}
                      onChange={(event) =>
                        handleFieldChange(k, event.target.value)
                      }
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
