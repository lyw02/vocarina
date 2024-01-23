// import { Link } from "react-router-dom";
import "./index.css";

function SiteHeader() {
  return (
    <div className="site-header-wrapper">
      <span className="options">
        <ul className="optionButtons">
          <li className="selected">Produce</li>
          <li>Community</li>
        </ul>
      </span>
      <span className="userInfo">
        {/* <Link to="/" style={{ textDecoration: "none" }}> */}
          <div>Sign in</div>
        {/* </Link> */}
      </span>
    </div>
  );
}

export default SiteHeader;
