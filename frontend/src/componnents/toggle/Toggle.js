import React, { useState } from "react";

export default function Toggle(props) {
  const [toggleState, setToggleState] = useState("off");

  function toggle() {
    setToggleState(toggleState === "off" ? "on" : "off");
  }
  // console.log(toggleState);

  return <div className={`switch ${toggleState}`} onClick={toggle} />;
}
