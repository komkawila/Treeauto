import React, { useState,useEffect } from "react";
import { useHistory } from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import axios from "axios";
import {api} from "../api";
function Register() {
  const history = useHistory();
  const [framName, setFramName] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userid, setUserid] = useState("");

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
  const saveUser = () => {
    // console.log("save");
    // console.log(framName);
    // console.log(name);
    // console.log(lastname);
    // console.log(email);
    // console.log(phoneNumber);
    
    axios.post(api+"register",{
      user_uid:userid,
      user_farm:framName,
      user_firstname:name,
      user_lastname:lastname,
      user_email:email,
      user_phone:phoneNumber
    });
    history.push("");
  };
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState([]);
  const canceled = () => {
    firebase.auth().signOut();
    history.push("/");
  };

  useEffect(async () => {
    const unregisterAuthObserver = await firebase.auth().onAuthStateChanged(user => {
        setIsSignedIn(!!user);
        setUser(firebase.auth().currentUser);
    });
    return () => unregisterAuthObserver();
  }, []);
  
  useEffect(() => {
    if (user != null) {
      if (user.length != 0) {
        console.log("user");
        console.log(user.uid);
        setUserid(user.uid);
        setEmail(user.email);
      }
        // 
    } else {
      console.log("user = null");
      history.push("")
    }
  }, [user]);

  return (
    <div className="login-content">
      <div className="text-center">
        <h1>Register</h1>
        <br />
      </div>
      <form>
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
            // disabled
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
      </form>
      <div className="row text-center">
        <div className="col">
          <button
            type="submit"
            className="btn btn-outline-primary btn-login"
            onClick={() => saveUser()}
          >
            บันทึก
          </button>
        </div>
        <div className="col">
          <button
            type="submit"
            className="btn btn-outline-danger btn-login"
            onClick={() => canceled()}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
