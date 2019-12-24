const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.fetchAll()
    .then(products => {
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
    .getCart()
    .then(products => {
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
    .deleteItemFromCart(prodId)
    
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => { console.log(err) });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          // we don't pass it like below
          // order.addProducts(products, {through:{quantity}})

          // every product must have a special key
          return order.addProduct(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity }
            return product;
          }))

        })
        .then(result => {
          return fetchedCart.setProducts(null)
        })
        .then(cart => {
          res.redirect('/orders');
        })
        .catch(err => { console.log(err) });

    })
    .catch(err => { console.log(err) });
};

exports.getOrders = (req, res, next) => {
  // we should include relations
  req.user.getOrders({ include: ['products'] })
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
