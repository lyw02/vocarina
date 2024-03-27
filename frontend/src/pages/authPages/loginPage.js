import React, { useState } from "react";
import { login } from "../../api/userApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/userContext";
import "./index.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState("");

  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleFieldChange = (key, value) => {
    switch (key) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleLogin = async () => {
    if (!(username && password)) {
      setShowErrorMsg("Please fill in all fields.");
    } else {
      setShowErrorMsg("");
      const res = await login(username, password);
      if (res !== `User \"${username}\" logged in.`) {
        alert("Incorrect username or password.");
      } else {
        await updateUser({ username: username, password: password});
        alert("Success.");
        navigate("/");
      }
    }
  };

  return (
    <div className="register-page-container">
      <div className="overlay">
        <div className="card">
          <h2 className="title">LOGIN</h2>
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
          </ul>
          <span className="error-msg">{showErrorMsg}</span>
          <div>
            <span className="link-msg">
              Do not have an account?{" "}
              <Link className="link" to="/register">
                Register.
              </Link>
            </span>
          </div>
          <div className="button-group">
            <span className="button register-button" onClick={handleLogin}>
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
