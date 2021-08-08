import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Footer from "../footer/Footer";
import "./navbarr.css";
import Swal from 'sweetalert2'
import firebase from 'firebase/app';
import 'firebase/auth';
function Navbar(props) {
  const history = useHistory();
  const [colors, setColors] = useState("");
  const [statusA, setStatusA] = useState(Boolean);
  const [statusB, setStatusB] = useState();

  const menu1 = props.colormenu1;
  const menu2 = props.colormenu2;
  const menu3 = props.colormenu3;
  // console.log(menu1);

  // console(props.colormenu1);
  // setStatusA(props.colormenu1);
  // if (props.colormenu1) {
    // setStatusA(true)
  // }
  // console.log("status1 = " + props.colormenu1);
  // console.log("status2 = " + props.colormenu2);
  const logout = ()=>{
    Swal.fire({
      title: 'ออกจากระบบ',
      text: "คุณต้องการที่จะออกระบบใช่หรือไม่",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ฉันต้องการออกจากระบบ',
      cancelButtonText: 'ไม่, ฉันไม่ต้องการออกจากระบบ!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'ออกจากระบบ!',
          'ออกจากระบบสำเร็จ',
          'success'
        );
        
        firebase.auth().signOut();  
        history.push("/")
      }
    })
  }

  const [stateNav,setStateNav] = useState(false);
  const setNav = () => {
    setStateNav(!stateNav)
    // stateNav = !stateNav;
    console.log(stateNav);
  };

  return (
    <div className="navbar-chart">
      <div className="hb-menu" onClick={() => setNav()}>
        <i class="bi bi-list"></i>
      </div>
      {stateNav ? (
        <div className="navbar-pc">
          <div>
            <div
              className="icons"
              onClick={() => {
                history.push("/home1");
              }}
            >
              <i
                class="bi bi-house-fill"
                style={{ fontSize: "2rem", color: "rgb(102, 255, 179)" }}
              ></i>
              {menu1 ? (
                <>
                  <h4 style={{ color: "rgb(128, 128, 128)" }}>Home</h4>
                </>
              ) : (
                <>
                  <h4>Home</h4>
                </>
              )}
            </div>
            <div
              className="icons"
              onClick={() => {
                history.push("/home2");
              }}
            >
              <i
                class="bi bi-bar-chart-line-fill"
                style={{ fontSize: "2rem", color: "rgb(255, 227, 102)" }}
              ></i>
              {menu2 ? (
                <>
                  <h4 style={{ color: "rgb(128, 128, 128)" }}>Chart</h4>
                </>
              ) : (
                <>
                  <h4>Chart</h4>
                </>
              )}
            </div>
          </div>
          <hr />
          <div
            className="icons"
            onClick={() => {
              history.push("/profile");
            }}
          >
            <i
              class="bi bi-person-badge-fill"
              style={{ fontSize: "2rem", color: "rgb(0, 153, 224)" }}
            ></i>

            {menu3 ? (
              <>
                <h4 style={{ color: "rgb(128, 128, 128)" }}>Profile</h4>
              </>
            ) : (
              <>
                <h4>Profile</h4>
              </>
            )}
          </div>
          <div className="icons" onClick={() => logout()}>
            <i
              class="bi bi-door-open-fill"
              style={{ fontSize: "2rem", color: "rgb(255, 102, 102)" }}
            ></i>
            <h4>Logout</h4>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <div className="dashborad">
        <br />
        <div
          className="icons"
          onClick={() => {
            history.push("/home1");
          }}
        >
          <i
            className="bi bi-toggles2 "
            style={{ fontSize: "2rem", color: "cornflowerblue" }}
          />
          <h3
            className="icons-sub"
            style={{ fontSize: "2rem", color: "cornflowerblue" }}
          >
            Treeauto{" "}
          </h3>
        </div>
        <br />
        <div>
          <div
            className="icons"
            onClick={() => {
              history.push("/home1");
            }}
          >
            <i
              class="bi bi-house-fill"
              style={{ fontSize: "2rem", color: "rgb(102, 255, 179)" }}
            ></i>
            {menu1 ? (
              <>
                <h4 style={{ color: "rgb(128, 128, 128)" }}>Home</h4>
              </>
            ) : (
              <>
                <h4>Home</h4>
              </>
            )}
          </div>
          <div
            className="icons"
            onClick={() => {
              history.push("/home2");
            }}
          >
            <i
              class="bi bi-bar-chart-line-fill"
              style={{ fontSize: "2rem", color: "rgb(255, 227, 102)" }}
            ></i>
            {menu2 ? (
              <>
                <h4 style={{ color: "rgb(128, 128, 128)" }}>Chart</h4>
              </>
            ) : (
              <>
                <h4>Chart</h4>
              </>
            )}
          </div>
        </div>
        <hr />
        <div
          className="icons"
          onClick={() => {
            history.push("/profile");
          }}
        >
          <i
            class="bi bi-person-badge-fill"
            style={{ fontSize: "2rem", color: "rgb(0, 153, 224)" }}
          ></i>

          {menu3 ? (
            <>
              <h4 style={{ color: "rgb(128, 128, 128)" }}>Profile</h4>
            </>
          ) : (
            <>
              <h4>Profile</h4>
            </>
          )}
        </div>
        <div className="icons" onClick={() => logout()}>
          <i
            class="bi bi-door-open-fill"
            style={{ fontSize: "2rem", color: "rgb(255, 102, 102)" }}
          ></i>
          <h4>Logout</h4>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
