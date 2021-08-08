import React from "react";
import { useHistory } from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { useState, useEffect } from 'react';
import axios from "axios";
import {api} from "../api";
import Swal from 'sweetalert2'
const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/signedIn',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false,
    },
};
function Login() {
  const history = useHistory();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState([]);
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

        axios.get(api+"login/"+user.uid).then((res) => {
          console.log(res.data.length)
          if(res.data.length == 0){
            history.push("/register")
          }else{
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })
            
            Toast.fire({
              icon: 'success',
              title: 'เข้าสู่ระบบสำเร็จ'
            })
            history.push("/home1");
          }
        });
        // 
      }
        // 
    } else {
      console.log("user = null");
      history.push("")
    }
  }, [user]);

  const register = () => {
    history.push("/register");
    console.log("register");
  };
  const home_go = () => {
    history.push("/home1");
    console.log("register");
  };

  return (
      <div className="login-content">
        
         <div className="loginpage text-center">
          <h1>Login</h1>
          <br />
          <StyledFirebaseAuth className="login-page" uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
        
      </div>
  );
}

export default Login;
