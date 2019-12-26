const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  // find method in mongoose give us all records (in this case all products)
  // we can use cursor() and find()
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // mongoose has a findById method
  Product.findById(prodId)
    .then(Product => {
      console.log(Product);
      if (!Product) {
        return res.redirect('/');
      }
      res.render('shop/product-detail', {
        product: Product,
        pageTitle: Product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));

};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });


};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => { console.log(err) });

};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => { console.log(err) });

};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)

    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => { console.log(err) });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => {
        return {
          quantity: item.quantity,
          // to save full product object using as follow 
          product: {...item.productId._doc},
        }
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    }).then(result => {
      return req.user.clearCart();
     
    })
    .then(()=>{
      res.redirect('/orders');
    })
    .catch(err => { console.log(err) });

};

exports.getOrders = (req, res, next) => {
  Order.find({"user.userId":req.user._id})
  .then(orders => {
    
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => { console.log(err) });

};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
