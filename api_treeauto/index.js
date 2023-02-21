// const express = require("express");
// const app = express();
// const mysql = require("mysql");
// var cors = require("cors");
// const linear = require("clementreiffers-linear-regression");
import { linearRegression, predict } from "clementreiffers-linear-regression";
import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const x = [30.41, 29.86, 30.44];
const y = [33.41, 22.86, 35.44];
const lr = linearRegression(x, y, true); // if you want values into an Object

// executed only if true in linearRegression Function, it gives the same result as above
// computeLightLinearRegression(x, y);  

const pred1 = predict([1, 2], lr);
const pred2 = predict(6, lr);

console.log(lr);
// END Linear


app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "103.225.169.174",
  user: "admin",
  password: "P@ssw0rd",
  database: "treeauto_db",
});

// ====================== SHOWDATA API ======================
app.get("/sensor", (req, res) => {
  db.query("SELECT * FROM log_tb", function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      //   console.log(err);
    }
  });
});
app.get("/sensoravg", (req, res) => {
  db.query("SELECT TRUNCATE(avg(log_light), 2) as avg_light, TRUNCATE(avg(log_temp), 2) as avg_temp, DATE(log_times) as date FROM log_tb GROUP BY DATE(log_times)", function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      //   console.log(err);
    }
  });
});

app.get("/ec", (req, res) => {
  db.query("SELECT * FROM logec_tb", function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      //   console.log(err);
    }
  });
});
app.get("/ecavg", (req, res) => {
  db.query("SELECT TRUNCATE(avg(logec_value), 2) as avg_ec, DATE(logec_times) as date FROM logec_tb GROUP BY DATE(logec_times)", function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      //   console.log(err);
    }
  });
});
// future
app.get("/ecavgfuture", (req, res) => {
  // db.query("SELECT TRUNCATE(avg(logec_value), 2) as avg_ec, avg(logec_value) * ROUND(RAND() * (-100 - 100) + 00) as fomular, DATE(logec_times) as date FROM logec_tb GROUP BY DATE(logec_times) ORDER BY logec_times ASC", function (err, result, fields) {
  db.query("SELECT TRUNCATE(avg(logec_value), 2) as avg_ec, avg(logec_value) * ROUND(RAND() * (-100 - 100) + 00) as fomular, DATE(logec_times) as date FROM logec_tb GROUP BY DATE(logec_times) ORDER BY logec_times ASC", function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      var datares = [];
      result.map(e => {
        console.log(e)
        var date1 = new Date(e.date);  
        date1.setDate(date1.getDate() + 1);      
        datares.push({
          avg_ec: e.avg_ec,
          fomular: parseFloat(e.avg_ec) + parseFloat(e.fomular / 1000),
          date: date1
        })
      })



      var date = new Date(datares[datares.length - 1].date);
      date.setDate(date.getDate() + 1);
      datares.push({
        "avg_ec": 0,
        // "avg_ec": datares[datares.length - 1].avg_ec,
        "fomular": (
          datares[datares.length - 9].avg_ec +
          datares[datares.length - 8].avg_ec +
          datares[datares.length - 7].avg_ec +
          datares[datares.length - 6].avg_ec +
          datares[datares.length - 5].avg_ec +
          datares[datares.length - 4].avg_ec +
          datares[datares.length - 3].avg_ec +
          datares[datares.length - 2].avg_ec +
          datares[datares.length - 1].avg_ec) / 9,
        "date": date
      })

      // console.log(result[result.length - 1].date)
      // console.log(date)
      res.send(datares);
      //   console.log(err);
    }
  });
});
app.get("/setting", (req, res) => {
  db.query(
    "SELECT * FROM setting_tb WHERE setting_id = 1",
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

// ====================== LOGIN API ======================
app.get("/login/:user_uid", (req, res) => {
  const user_uid = req.params.user_uid;
  db.query(
    "SELECT * FROM user_tb WHERE user_uid = '" + user_uid + "'",
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

// ====================== REGISTER API ======================
app.post("/register", (req, res) => {
  const user_uid = req.body.user_uid;
  const user_farm = req.body.user_farm;
  const user_firstname = req.body.user_firstname;
  const user_lastname = req.body.user_lastname;
  const user_email = req.body.user_email;
  const user_phone = req.body.user_phone;
  db.query(
    "INSERT INTO user_tb(user_uid,user_farm, user_firstname, user_lastname,user_email, user_phone) VALUES (?,?,?,?,?,?)",
    [
      user_uid,
      user_farm,
      user_firstname,
      user_lastname,
      user_email,
      user_phone,
    ],
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

app.post("/updateuser", (req, res) => {
  const user_uid = req.body.user_uid;
  const user_farm = req.body.user_farm;
  const user_firstname = req.body.user_firstname;
  const user_lastname = req.body.user_lastname;
  const user_phone = req.body.user_phone;
  db.query(
    "UPDATE user_tb SET user_farm = ?,user_firstname = ?,user_lastname = ?,user_phone = ? WHERE user_uid ='" +
    user_uid +
    "'",
    [user_farm, user_firstname, user_lastname, user_phone],
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

app.get("/insertsensor/:log_temp/:log_light", (req, res) => {
  const log_temp = req.params.log_temp;
  const log_light = req.params.log_light;
  db.query(
    "INSERT INTO log_tb(log_temp,log_light) VALUES (?,?)",
    [log_temp, log_light],
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

app.get("/insertec/:logec_value", (req, res) => {
  const logec_value = req.params.logec_value;
  db.query(
    "INSERT INTO logec_tb(logec_value) VALUES (?)",
    [logec_value],
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

// ====================== INSERT API ======================
app.post("/sensor", (req, res) => {
  const log_temp = req.body.log_temp;
  const log_light = req.body.log_light;
  db.query(
    "INSERT INTO log_tb(log_temp,log_light) VALUES (?,?)",
    [log_temp, log_light],
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

app.post("/ec", (req, res) => {
  const logec_value = req.body.logec_value;
  db.query(
    "INSERT INTO logec_tb(logec_value) VALUES (?)",
    [logec_value],
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});
// ====================== SETTING API ======================
app.put("/temp", (req, res) => {
  const val = req.body.val;
  db.query(
    "UPDATE setting_tb SET setting_temp=" + val + " WHERE setting_id = 1",
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

app.put("/light", (req, res) => {
  const val = req.body.val;
  db.query(
    "UPDATE setting_tb SET setting_light=" + val + " WHERE setting_id = 1",
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

app.put("/ec", (req, res) => {
  const val = req.body.val;
  db.query(
    "UPDATE setting_tb SET setting_status_ec=" + val + " WHERE setting_id = 1",
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

app.put("/opentime", (req, res) => {
  const val = req.body.val;
  db.query(
    "UPDATE setting_tb SET setting_open_time=" + val + " WHERE setting_id = 1",
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

app.put("/ecminmax", (req, res) => {
  const ec_min = req.body.ec_min;
  const ec_max = req.body.ec_max;
  db.query(
    `UPDATE setting_tb SET ec_min=${ec_min},ec_max=${ec_max} WHERE setting_id = 1`,
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

app.put("/intervaltime", (req, res) => {
  const val = req.body.val;
  db.query(
    "UPDATE setting_tb SET setting_interval_time=" +
    val +
    " WHERE setting_id = 1",
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        //   console.log(err);
      }
    }
  );
});

app.listen(5000, () => console.log("Server Started..."));
