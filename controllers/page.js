
const Product = require('../models/product');

exports.index = (req, res, next) => {
    Product.fetchAll((products => {
      res.render('shop/index', {
          prods: products,
          pageTitle: "Shop",
          path: '/',
          hasProducts: products.length > 0,
          productCss: true,
          activeShop: true
      })
  }));
  }