import React, { useState } from "react";
import { register } from "../../api/userApi";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleFieldChange = (key, value) => {
    switch (key) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "passwordConfirmation":
        setPasswordConfirmation(value);
        break;
      default:
        break;
    }
  };

  const handleRegister = async () => {
    if (!(username && password && passwordConfirmation)) {
      setShowErrorMsg("Please fill in all fields.");
    } else if (password !== passwordConfirmation) {
      setShowErrorMsg("Passwords do not match.");
    } else if (!checkPassword(password)) {
      setShowErrorMsg(
        "Password must be at least 8 characters long and contain at least 2 different types of characters."
      );
    } else {
      setShowErrorMsg("");
      const res = await register(username, password);
      if (res !== "User created.") {
        alert("Failed to register");
      } else {
        alert("Success.");
        navigate("/login");
      }
    }
  };

  function checkPassword(str) {
    const regex = /[a-zA-Z0-9!@#$%^&*()_+=\-|{}':;.,<>?]/;
    if (str.length < 8) {
      return false;
    }
    // At least 2 kinds of chars
    const charSet = new Set();
    for (let i = 0; i < str.length; i++) {
      if (regex.test(str[i])) {
        charSet.add(str[i]);
        if (charSet.size === 2) {
          break;
        }
      }
    }
    return charSet.size === 2;
  }

  return (
    <div className="register-page-container">
      <div className="overlay">
        <div className="card">
          <h2 className="title">REGISTER</h2>
          <ul className="field-list">
            <li key="username" className="field">
              <h5 className="field-name">Username</h5>
              <input
                name="username"
                className="field-input"
                onChange={(event) =>
                  handleFieldChange("username", event.target.value)
                }
              />
            </li>
            <li key="password" className="field">
              <h5 className="field-name">Password</h5>
              <input
                name="password"
                className="field-input"
                type="password"
                onChange={(event) =>
                  handleFieldChange("password", event.target.value)
                }
              />
            </li>
            <li key="passwordConfirmation" className="field">
              <h5 className="field-name">Password Confirmation</h5>
              <input
                name="passwordConfirmation"
                className="field-input"
                type="password"
                onChange={(event) =>
                  handleFieldChange("passwordConfirmation", event.target.value)
                }
              />
            </li>
          </ul>
          <span className="error-msg">{showErrorMsg}</span>
          <div><span className="link-msg">Already have an account? <Link className="link" to="/login">Login.</Link></span></div>
          <div className="button-group">
            <span className="button register-button" onClick={handleRegister}>
              Register
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
