const express = require("express");
let router = express.Router();
let allProducts = require("../db/all-products.json");

router.get("/*", function(req, res) {
  if (req.url === "/") {
    res.setHeader("Content-Type", "application/json");
    res.send(allProducts);
    res.end();
    return;
  }

  if (req.url.includes("?")) {
    let productsArr = [];
    const ids = req.query.ids;
    const idsArr = ids.split(",");

    idsArr.map(id => {
      const foundProduct = allProducts.find(elem => elem.id === +id);
      if (foundProduct) {
        const obj = {
          id: foundProduct.id,
          sku: foundProduct.sku,
          name: foundProduct.name,
          description: foundProduct.description
        };
        productsArr.push(obj);
      }
      if (productsArr.length !== 0) {
        foundedProducts = {
          status: "success!",
          products: productsArr
        };
      } else {
        foundedProducts = {
          status: "not found!",
          products: []
        };
      }
    });

    res.setHeader("Content-Type", "application/json");
    res.send(foundedProducts);
    res.end();

    return;
  }

  let id = req.url.slice(req.url.lastIndexOf("/") + 1);
  const foundProductFromId = allProducts.find(
    prod => prod.id.toString() === id
  );
  if (foundProductFromId) {
    res.setHeader("Content-Type", "application/json");
    res.send(foundProductFromId);
    res.end();
  } else {
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        status: "no products!",
        products: []
      })
    );
    res.end();
  }
});

module.exports = router;
