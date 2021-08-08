
import './App.css';
import './styles.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  HashRouter
} from "react-router-dom";
import Navbar from './componnents/navber/Navbar';
import Home_1 from './componnents/home_1/Home_1';
import Home_2 from './componnents/home_2/Home_2';
import Charts from './componnents/stock/Charts';
import Header from './componnents/header/Header';
import Profile from './componnents/profile/Profile';
import Login from './componnents/login/Login';
import Register from './componnents/Registor/Register';

import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
const  firebaseConfig = {
  apiKey: "AIzaSyAX_nx165t5CGMAK2SdaSeD5idwlsKiOus",
  authDomain: "treeauto-3ec15.firebaseapp.com",
  projectId: "treeauto-3ec15",
  storageBucket: "treeauto-3ec15.appspot.com",
  messagingSenderId: "787331288585",
  appId: "1:787331288585:web:ef0f20d05ab2b9c6c6b2d8",
  measurementId: "G-KHBMMXSCBJ"
};

firebase.initializeApp(firebaseConfig);
function App() {
  const history = useHistory();
    const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [user, setUser] = useState([]);
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
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
      }
        // 
    } else {
            console.log("user = null");
            history.push("/")
    }
    }, [user]);
  return (
    // <Router>
    //   <Route exact path="/" component={Login}/>
    //   <Route exact path="/register" component={Register}/>
    //   <Route exact path="/home1" component={Home_1}/>
    //   <Route exact path="/home2" component={Home_2}/>
    //   <Route exact path="/profile" component={Profile}/>
    //   <Route exact path="/chart" component={Charts}/>
    // </Router>

    <HashRouter
      basename="/"
      hashType="slash"
    >
      <Route exact path="/" component={Login}/>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/home1" component={Home_1}/>
      <Route exact path="/home2" component={Home_2}/>
      <Route exact path="/profile" component={Profile}/>
      <Route exact path="/chart" component={Charts}/>
    </HashRouter>
  );
}

export default App;
