const express = require("express");
const app = express();
const mysql = require("mysql");
var cors = require("cors");
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
