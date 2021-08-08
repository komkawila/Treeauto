import React, { useState, useEffect } from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Navbar from "../navber/Navbar";

import firebase from 'firebase/app';
import 'firebase/auth';
import { useHistory } from "react-router-dom";
import axios from "axios";
import {api} from "../api";

function Profile() {
  const [framName, setFramName] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const history = useHistory();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState([]);
  const [userid, setUserid] = useState("");
  useEffect(async () => {
    const unregisterAuthObserver = await firebase.auth().onAuthStateChanged(user => {
        setIsSignedIn(!!user);
        setUser(firebase.auth().currentUser);
    });
    return () => unregisterAuthObserver();
  }, []);
  
  useEffect(() => {
    console.log("user");
    console.log(user);
    if (user != null) {
      if (user.length != 0) {
        // history.push("/home1")
        setUserid(user.uid);
        axios.get(api+"login/"+user.uid).then(res=>{
          console.log(res.data[0].user_email)
          setEmail(res.data[0].user_email);
          setName(res.data[0].user_firstname);
          setLastName(res.data[0].user_lastname);
          setPhoneNumber(res.data[0].user_phone);
          setFramName(res.data[0].user_farm);          
        })
        // setEmail(user.user_email);
      }
        // 
    } else {
      console.log("user = null");
      history.push("")
    }
  }, [user]);

  const onchangframName = (e) => {
    setFramName(e.target.value);
  };
  const onchangname = (e) => {
    setName(e.target.value);
  };
  const onchanglastname = (e) => {
    setLastName(e.target.value);
  };
  const onchangemail = (e) => {
    setEmail(e.target.value);
  };
  const onchangphoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };
  const canceled = () => {
    history.push("/home1");
  };
  const edited = () => {
    console.log("edit");
    console.log(framName);
    console.log(name);
    console.log(lastname);
    console.log(email);
    console.log(phoneNumber);
    axios.post(api+"updateuser",{
      user_farm:framName,
      user_firstname:name,
      user_lastname:lastname,
      user_phone:phoneNumber,
      user_uid:userid,
    });
    history.push("");
  };
  return (
    <div>
      <Navbar colormenu1={false} colormenu2={false} colormenu3={true} />
      <Header title="proflie" />
      <div className="dashborad-data">
        <div className="profile">
          <div className="text-center">
            <h1>Profile</h1>
            <br />
          </div>
          <div>
            <div className="mb-3">
              <label className="form-label">ชื่อฟาร์ม</label>
              <input
                type="text"
                className="form-control"
                placeholder="ชื่อฟาร์ม"
                value={framName}
                onChange={onchangframName}
                maxLength="100"
              />
            </div>
            <br />
            <div className="mb-3">
              <label className="form-label">ชื่อ</label>
              <input
                type="text"
                className="form-control"
                placeholder="ชื่อ"
                value={name}
                onChange={onchangname}
                maxLength="50"
              />
            </div>
            <br />
            <div className="mb-3">
              <label className="form-label">นามสกุล</label>
              <input
                type="text"
                className="form-control"
                placeholder="นามสกุล"
                value={lastname}
                onChange={onchanglastname}
                maxLength="50"
              />
            </div>
            <br />
            <div className="mb-3">
              <label className="form-label">อีเมล</label>
              <input
                type="email"
                className="form-control"
                placeholder="อีเมล"
                value={email}
                maxLength="50"
                // onChange={onchangemail}
              />
            </div>
            <br />
            <div className="mb-3">
              <label className="form-label">เบอร์มือถือ</label>
              <input
                type="text"
                className="form-control"
                placeholder="เบอร์มือถือ"
                value={phoneNumber}
                onChange={onchangphoneNumber}
                maxLength="10"
              />
            </div>
            <br />
            <div className="row">
              <div className="col-2"></div>
              <div className="col-4">
                <button
                  className="btn btn-outline-warning form-control"
                  onClick={edited}
                >
                  แก้ไข
                </button>
              </div>
              <div className="col-4">
                <button
                  className="btn btn-outline-danger form-control"
                  onClick={canceled}
                >
                  ยกเลิก
                </button>
              </div>
              <div className="col-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
