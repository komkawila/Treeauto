import React from "react";
import { useHistory } from "react-router-dom";

function Header(props) {
  const profile = props.title;
  const history = useHistory();
  return (
    <div>
      <div className="header">
        Dashboard   <p>/ {profile}</p>
      </div>
    </div>
  );
}

export default Header;
