import React, { useState, useEffect } from "react";
import Navbar from "../navber/Navbar";
import { Chart, LineAdvance } from "bizcharts";
import Charts from "../stock/Charts";
import ChartEc from "../stock/ChartEc";
import ChartLight from "../stock/ChartLight";
import ChartTemp from "../stock/ChartTemp";
import ChartEcFuture from "../stock/ChartEcFuture";
import ChartEcFuture2Line from "../stock/ChartEcFuture2Line";
 
import Footer from "../footer/Footer";
import Header from "../header/Header";

import firebase from 'firebase/app';
import 'firebase/auth';
import { useHistory } from "react-router-dom";

const data = [
  {
    month: "Jan",
    city: "Tokyo",
    temperature: 7,
    temperatures: 8,
  },
  {
    month: "Feb",
    city: "Tokyo",
    temperature: 13,
    temperatures: 8,
  },
  {
    month: "Mar",
    city: "Tokyo",
    temperature: 16.5,
    temperatures: 8,
  },
  {
    month: "Apr",
    city: "Tokyo",
    temperature: 14.5,
    temperatures: 8,
  },
  {
    month: "May",
    city: "Tokyo",
    temperature: 10,
    temperatures: 8,
  },
  {
    month: "Jul",
    city: "Tokyo",
    temperature: 9.2,
    temperatures: 4,
  },
  {
    month: "Aug",
    city: "Tokyo",
    temperature: 14.5,
    temperatures: 5.3,
  },
  {
    month: "Sep",
    city: "Tokyo",
    temperature: 9.3,
    temperatures: 5,
  },
  {
    month: "Oct",
    city: "Tokyo",
    temperature: 8.3,
    temperatures: 4,
  },
  {
    month: "Nov",
    city: "Tokyo",
    temperature: 8.9,
    temperatures: 9,
  },
  {
    month: "Dec",
    city: "Tokyo",
    temperature: 5.6,
    temperatures: 1,
  },
];
function Home_2() {
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
    console.log("user");
    console.log(user);
    if (user != null) {
      if (user.length != 0) {
        // history.push("/home1")
      }
        // 
    } else {
      console.log("user = null");
      history.push("")
    }
  }, [user]);
  return (
    <div className="App">
      <Navbar colormenu2 = {true} colormenu1 = {false} colormenu3 = {false}/>
      <Header title="chart"/>
      <div className="chart-page">
        <div className="dashborad-data">
          {/* <div className="row chartall">
            <Charts />
          </div>
          <br/>
          <div className="row chartall">
            <ChartEc />
          </div> */}
          
          <div className="row chartall">
            <ChartLight />
          </div>
          <br/>
          <div className="row chartall">
            <ChartTemp />
          </div>
          <br/>
          <div className="row chartall">
            <ChartEcFuture />
          </div>
          <br/>
          <div className="row chartall">
            <ChartEcFuture2Line />
          </div>
          <br/>
        </div>
      </div>
    </div>
  );
}

export default Home_2;
