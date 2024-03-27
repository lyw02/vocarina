import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/userContext";
import "./index.css";

function SiteHeader() {
  const { user } = useAuth();
  return (
    <div className="navbar-wrapper">
      <span className="options">
        <ul className="optionButtons">
          <li className="selected">Produce</li>
          <li>Community</li>
        </ul>
      </span>
      <span className="userInfo">
        {user ? (
          <div>{user.username}</div>
        ) : (
          <Link to="/register" style={{ textDecoration: "none" }}>
            <div>Sign in</div>
          </Link>
        )}
      </span>
    </div>
  );
}

export default SiteHeader;
