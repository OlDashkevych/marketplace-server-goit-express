const express = require("express");
let router = express.Router();
const fs = require("fs");
const path = require("path");
const shortid = require("shortid");
let allProducts = require("../db/all-products.json");
let allUsers = require("../db/all-users.json");

const findProducts = products => {
  const ids = products.products;
  const foundProducts = [];

  ids.map(el => {
    const findProduct = allProducts.find(elem => elem.id === +el);
    if (findProduct) {
      foundProducts.push(findProduct);
    }
  });

  return foundProducts;
};

const createOrder = order => {
  let foundUser;

  allUsers.map(user => {
    if (user.id === order.user) {
      foundUser = user;
    }
  });

  const dirPath = path.join(__dirname, `../db/users/${foundUser.user}/orders`);

  fs.mkdir(dirPath, err => {
    if (err) {
      return console.log(err);
    }
  });

  let prod = [];
  order.products.map(id => {
    let found = allProducts.find(elem => elem.id === +id);
    if (found) {
      prod.push(found.name);
    }
  });

  const filePath = path.join(`${dirPath}`, `${name}.json`);

  fs.writeFile(filePath, JSON.stringify(order), function(err) {
    if (err) {
      return console.log(err);
    }
  });
};

router.post("/*", function(req, res) {
  let body = "";

  req.on("data", function(data) {
    body = body + data;
  });

  req.on("end", function() {
    const post = JSON.parse(body);

    const foundProd = findProducts(post);

    post.id = shortid.generate();

    if (foundProd.length !== 0) {
      createOrder(post);
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ status: "success", order: post }));
      res.end();
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({ status: "failed", order: null }));
      res.end();
    }
  });
});

module.exports = router;
