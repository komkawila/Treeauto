import React, { useState, useEffect } from "react";
import Navbar from "../navber/Navbar";
import Toggle from "../toggle/Toggle";
import GaugeChart from "react-gauge-chart";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { api } from "../api";
import axios from "axios";
import { dataEcs } from "../dataEc";

import useChat from "../useChat";
import Swal from "sweetalert2";
// import "./json";
import { data, dataLight, dataTemp } from "./json";

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import firebase from "firebase/app";
import "firebase/auth";
import { useHistory } from "react-router-dom";


var valueEc = [];
function Home_1() {
  const history = useHistory();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState([]);
  useEffect(async () => {
    const unregisterAuthObserver = await firebase
      .auth()
      .onAuthStateChanged((user) => {
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
      history.push("");
    }
  }, [user]);

  const initialState = "";

  const [lightValue, setLightValue] = useState("");
  const [tempValue, setTempValue] = useState("");

  const [setLight, setSetLight] = useState("");
  const [setTemp, setSetTemp] = useState("");

  const [ecValue, setEcValue] = useState("");
  const [timerun, setTimerun] = useState();
  const [intervals, setIntervals] = useState();

  const [dataEc, setDataEc] = useState(initialState);
  const [lastDataEc, setLastDataEc] = useState(initialState);
  const [showLoading, setShowLoading] = useState(true);

  const [toggleState, setToggleState] = useState("off");
  const [gaugeEc, setGaugeEc] = useState(0);

  const [ecMin, setEcMin] = useState(0);
  const [ecMax, setEcMax] = useState(0);
  useEffect(async () => {
    try {
      const ecval = await axios.get(api + "ec");
      const settingval = await axios.get(api + "setting");
      setIntervals(settingval.data[0].setting_interval_time);
      setTimerun(settingval.data[0].setting_open_time);
      setSetTemp(settingval.data[0].setting_temp);
      setSetLight(settingval.data[0].setting_light);
      setToggleState(settingval.data[0].setting_status_ec == 0 ? "off" : "on");
      setEcMin(settingval.data[0].ec_min);
      setEcMax(settingval.data[0].ec_max);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const saveLight = () => {
    console.log(setLight);
    sendMessage("SETLIGHT:" + setLight);
    axios.put(api + "light", { val: setLight }).then((res) => {
      if (res.status == 200) {
        Swal.fire("สำเร็จ", "บันทึกค่าแสงสำเร็จ", "success");
      }
    });
  };

  const saveTemp = () => {
    console.log(setTemp);
    sendMessage("SETTEMP:" + setTemp);
    axios.put(api + "temp", { val: setTemp }).then((res) => {
      if (res.status == 200) {
        Swal.fire("สำเร็จ", "บันทึกค่าอุณหภูมิสำเร็จ", "success");
      }
    });
  };

  const saveTimerun = () => {
    console.log(timerun);
    sendMessage("SETTIME:" + timerun);
    axios.put(api + "opentime", { val: timerun }).then((res) => {
      if (res.status == 200) {
        Swal.fire("สำเร็จ", "บันทึกค่าเวลาทำงานสำเร็จ", "success");
      }
    });
  };

  const saveInterval = () => {
    console.log(intervals);
    sendMessage("SETINTERVALS:" + intervals);
    axios.put(api + "intervaltime", { val: intervals }).then((res) => {
      if (res.status == 200) {
        Swal.fire("สำเร็จ", "บันทึกค่าระยะเวลาสำเร็จ", "success");
      }
    });
  };

  const saveEc = () => {
  };

  // console.log(dataEcs);


  const roomId = "1234";
  const { messages, sendMessage } = useChat(roomId);
  const [newMessage, setNewMessage] = React.useState("");
  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage + "\n");
    setNewMessage("");
  };

  useEffect(() => {
    // const obj = JSON.parse(JSON.stringify(messages));
    try {
      if (
        messages.indexOf("temp") != -1 &&
        messages.indexOf("light") != -1 &&
        messages.indexOf("ecVal") != -1
      ) {
        setTempValue(
          messages.substring(
            messages.indexOf("temp") + 5,
            messages.indexOf("light") - 1
          )
        );
        setLightValue(
          messages.substring(
            messages.indexOf("light") + 6,
            messages.indexOf("ecVal") - 1
          )
        );
        setEcValue(
          messages.substring(
            messages.indexOf("ecVal") + 6,
            messages.indexOf("}")
          )
        );
      }
    } catch { }

    //  console.log(messages.substring(messages.indexOf("ecVal") + 6,messages.indexOf("}")));

    // console.log((JSON.stringify(messages));
  }, [messages]);
  // console.log(ecValue);
  useEffect(() => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    console.log("ecValue = ")
    console.log(parseFloat(ecValue))
    console.log("ecMax = ")
    console.log(parseFloat(ecMax))
    if (parseFloat(ecValue) >= parseFloat(ecMax)) {
      console.log("EC มากกว่ากำหนด")
      Toast.fire({
        icon: 'error',
        title: 'EC มากกว่ากำหนด'
      })
    } else if (parseFloat(ecValue) <= parseFloat(ecMin)) {
      console.log("EC ต่ำกว่ากำหนด")
      Toast.fire({
        icon: 'error',
        title: 'EC ต่ำกว่ากำหนด'
      })
    }
  }, [ecValue])

  function toggle() {
    setToggleState(toggleState === "off" ? "on" : "off");
    var a = toggleState === "off" ? "on" : "off";
    console.log(a);
    sendMessage("SETEC:" + a);
    axios.put(api + "ec", { val: a == "off" ? 0 : 1 });
  }
  // const [gaugeTemp, setGaugeTemp] = useState();
  // const [gaugeLight, setGaugeLight] = useState();
  // const [gaugeEcs, setGaugeEcs] = useState();
  const gaugeTemp = tempValue * 0.01;
  const gaugeLight = lightValue * 0.01;
  const gaugeEcs = ((parseFloat(ecValue) * 100) / 5) * 0.01;
  // setGaugeTemp();
  // setGaugeLight();
  // setGaugeEcs();


  // const [filterDataEc, setFilterDataEc] = useState();
  // const f = dataEcs.filter((dataEcs) => dataEcs.ec_id === ecValue);
  // const maxvalu = 20;
  // const ecmin = f[0].ec_min;
  // const ecmid = f[0].ec_max - f[0].ec_min;
  // const ecmax = maxvalu - f[0].ec_max;
  // console.log("start = " + ecmin);
  // console.log("mid = " + ecmid);
  // console.log("end = " + ecmax);
  // const a = ecmin / maxvalu;
  // const b = ecmid / maxvalu;
  // const c = ecmax / maxvalu;
  // console.log("a = " + a + " b = " + b + " c = " + c);

  const [ecValues, setEcValues] = useState("000");
  const filterDataEc = dataEcs.filter(dataEcs => dataEcs.ec_id == ecValues)
  // console.log(filterDataEc);

  const maxvalu = 5;
  const ecmin = filterDataEc[0].ec_min;
  const ecmid = filterDataEc[0].ec_max - filterDataEc[0].ec_min;
  const ecmax = maxvalu - filterDataEc[0].ec_max;
  console.log("start = " + ecmin);
  console.log("mid = " + ecmid);
  console.log("end = " + ecmax);
  const a = ecmin / maxvalu;
  const b = ecmid / maxvalu;
  const c = ecmax / maxvalu;
  console.log("a = " + a + " b = " + b + " c = " + c);

  const [ecaler, setECAlert] = useState(false)
  const saveMinmaxEc = () => {

    console.log(ecValue);
    axios.put(api + "ecminmax", { ec_min: ecMin, ec_max: ecMax }).then((res) => {
      if (res.status == 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'บันทึกสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        })
      }
    });

  }

  useEffect(() => {

  }, [ecaler])

  return (
    <div className="App">
      <Navbar colormenu1={true} colormenu2={false} colormenu3={false} />
      <Header title="home" />
      <div className="dashborad-data">

        <div className="row ">
          <div className="col-md-4 box">
            <div className="box-censer">
              <div>
                <GaugeChart
                  // textColor={"none"}
                  hideText={true}
                  animate={false}
                  animDelay={0}
                  nrOfLevels={100}
                  arcsLength={[0.4, 0.4, 0.2]}
                  colors={["#5BE12C", "#F5CD19", "#EA4228"]}
                  percent={gaugeTemp}
                // arcPadding={0.002}
                />
                <br />
                <p>อุณหภูมิ : {tempValue} °C</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 box">
            <div className="box-censer">
              <div>
                <GaugeChart
                  // textColor={"none"}
                  hideText={true}
                  animate={false}
                  animDelay={0}
                  nrOfLevels={100}
                  arcsLength={[0.4, 0.4, 0.2]}
                  colors={["#5BE12C", "#F5CD19", "#EA4228"]}
                  percent={gaugeLight}
                // arcPadding={0.002}
                />
                <br />
                <p>แสง : {lightValue} %</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 box">
            <div className="box-censer">
              <div>
                <GaugeChart
                  // textColor={"none"}
                  hideText={true}
                  animate={false}
                  nrOfLevels={5}
                  arcsLength={[a, b, c]}
                  colors={["#EA4228", "#5BE12C", "#EA4228"]}
                  percent={gaugeEcs}
                  arcPadding={0}

                />
                <br />
                <p>EC : {ecValue} mS/cm</p>
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* /////////////----end gauge////////////// */}
        <br />
        <br />
        <div className="col-md-12 box-contorl">
          <h3 className=" text-center font-weight-bold">ควบคุมระบบ Arduino</h3>
          <br />
          <div className="row box">
            <div className="col-md ">
              <div className="row">
                <div className="col-md-6">
                  <p>กำหนดค่าแสง</p>
                </div>
                <div className="col-md-4">
                  <select
                    class="form-select"
                    value={setLight}
                    onChange={(e) => {
                      setSetLight(e.target.value);
                    }}
                  >
                    <option selected>กำหนดค่าแสง</option>
                    {dataLight.map((index, key) => {
                      return (
                        <option key={key} value={index.name}>
                          {index.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    class="btn btn-primary btn-save btn-save-detail"
                    onClick={() => saveLight()}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-6">
                  <p>กำหนดค่าอุณหภูมิ</p>
                </div>
                <div className="col-md-4">
                  <select
                    class="form-select"
                    value={setTemp}
                    style={{ backgroundColor: "back" }}
                    onChange={(e) => {
                      setSetTemp(e.target.value);
                    }}
                  >
                    <option selected>กำหนดค่าอุณหภูมิ</option>
                    {dataTemp.map((index, key) => {
                      return (
                        <option key={key} value={index.name}>
                          {index.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    class="btn btn-primary btn-save btn-save-detail"
                    onClick={() => saveTemp()}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-6">
                  <p>ระยะเวลาการทำงานต่อ 1 ครั้ง (วินาที)</p>
                </div>
                <div className="col-md-4">
                  <select
                    class="form-select"
                    value={timerun}
                    onChange={(e) => {
                      setTimerun(e.target.value);
                    }}
                  >
                    <option selected>
                      ระยะเวลาการทำงานต่อ 1 ครั้ง (วินาที)
                    </option>
                    {data.map((index, key) => {
                      return (
                        <option key={key} value={index.set_sec}>
                          {index.set_sec + " วินาที"}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    class="btn btn-primary btn-save btn-save-detail"
                    onClick={() => saveTimerun()}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-6">
                  <p>ระยะห่างการทำงาน (นาที)</p>
                </div>
                <div className="col-md-4">
                  <select
                    class="form-select"
                    value={intervals}
                    onChange={(e) => {
                      setIntervals(e.target.value);
                    }}
                  >
                    <option selected>ระยะห่างการทำงาน (นาที)</option>
                    {data.map((index, key) => {
                      return (
                        <option key={key} value={index.set_min}>
                          {index.set_min + " นาที"}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    class="btn btn-primary btn-save btn-save-detail"
                    onClick={() => saveInterval()}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md">
              <div className="row">
                <div className="ec-tag">
                  <p className="ectext">ชนิดของผัก</p>

                  <select
                    class="form-select ec-tag-select"
                    value={ecValues}
                    onChange={(e) => {
                      setEcValues(e.target.value);
                    }}
                  >
                    {dataEcs.map((index, key) => {
                      return (
                        <option key={key} value={index.ec_id}>
                          {index.ec_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="showmain-max">
                  <p className="ppp" style={{ fontSize: "1.5rem" }}>
                    min : {filterDataEc[0].ec_min} , max : {filterDataEc[0].ec_max} ms/cm
                  </p>
                </div>
                ตั้งค่าการแจ้งเตือน EC
                <div className="toggle-ec">
                  <p className="pp texx-set ceenter">เปิด - ปิด EC</p>
                  {/* <Toggle /> */}
                  <div className={`switch ${toggleState}`} onClick={toggle} />
                </div>
                <div className="row">
                  <div className="col-4">
                    <p for="Min">Min</p>
                    <input type="number" readonly class="form-control" id="Min" value={ecMin} onChange={e => setEcMin(e.target.value)} />
                  </div>
                  <div className="col-4">
                    <p for="Max" >Max</p>
                    <input type="number" readonly class="form-control" id="Max" value={ecMax} onChange={e => setEcMax(e.target.value)} />
                  </div>
                  <div class="col-4">
                    <button class="btn btn-primary mb-3 p-5" onClick={() => saveMinmaxEc()}>บันทึก</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home_1;
