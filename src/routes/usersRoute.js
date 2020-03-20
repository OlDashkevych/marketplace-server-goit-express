const express = require("express");
let router = express.Router();
const path = require("path");
const fs = require("fs");
const shortid = require("shortid");
let allUsers = require("../db/all-users.json");

const saveUser = user => {
  const usersPath = path.join(__dirname, "../db/all-users.json");
  const dirPath = path.join(__dirname, `../db/users/${user.username}`);

  fs.readFile(usersPath, "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      users = JSON.parse(data);
      users.push(user, (user.id = shortid.generate()));
      users.pop();
      json = JSON.stringify(users);
      fs.writeFile(usersPath, json, "utf8", function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("User saved!");
      });
      fs.mkdir(dirPath, err => {
        if (err) {
          return console.log(err);
        }
      });
    }
  });
};

router.post("/*", function(req, res) {
  let body = "";

  req.on("data", function(data) {
    body = body + data;
    console.log("Incoming data!");
  });

  req.on("end", function() {
    const post = JSON.parse(body);

    saveUser(post);

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ status: "success: user saved", user: post }));
    res.end();
  });
});

router.get("/*", function(req, res) {
  let id = req.url.slice(req.url.lastIndexOf("/") + 1);
  const foundUser = allUsers.find(user => user.id.toString() === id);

  if (foundUser) {
    res.setHeader("Content-Type", "application/json");
    res.send(foundUser);
    res.end();
  } else {
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        status: "not found"
      })
    );
    res.end();
  }
});

module.exports = router;
