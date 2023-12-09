import "./index.css";

function SiteHeader() {
  return (
    <div className="navbar-wrapper">
      <span className="options">
        <ul className="optionButtons">
          <li className="selected">Produce</li>
          <li>Community</li>
        </ul>
      </span>
      <span className="userInfo">
        <div>Sign in</div>
      </span>
    </div>
  );
}

export default SiteHeader;
