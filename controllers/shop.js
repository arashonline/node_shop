const fs = require('fs');
const path = require('path');

const Product = require('../models/product');
const Order = require('../models/order');

const PDFDocument = require('pdfkit');

const ITEM_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.countDocuments().count().then(numOfProduct => {
    totalItems = numOfProduct;
    return Product.find()
      .skip((page - 1) * ITEM_PER_PAGE)
      .limit(ITEM_PER_PAGE)
  })
    .then(products => {
      console.log(products);
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)

    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
    });
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
          product: { ...item.productId._doc },
        }
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    }).then(result => {
      return req.user.clearCart();

    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {

      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        console.log('here')
        req.flash('error', 'No order found!');
        return res.redirect('/orders');
      } else if (order.user.userId.toString() === req.user._id.toString()) {
        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName)

        // loading file in ram - bad practice
        // fs.readFile(invoicePath, (err, data)=>{
        //   if(err){
        //     req.flash('error','No order file found!');
        //   return res.redirect('/orders')
        //   }
        //   res.setHeader('content-type', 'application/pdf');
        //   res.setHeader('content-disposition', 'attachment; filename="'+invoiceName+'"');
        //   res.send(data)
        // })


        // streaming file - good practice
        // const file = fs.createReadStream(invoicePath);
        // res.setHeader('content-type', 'application/pdf');
        // res.setHeader('content-disposition', 'attachment; filename="'+invoiceName+'"');
        // file.pipe(res)

        const pdfDoc = new PDFDocument;
        res.setHeader('content-type', 'application/pdf');
        res.setHeader('content-disposition', 'inline; filename="' + invoiceName + '"');
        // creating and storing pdf
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        // res is a writable read stream
        pdfDoc.pipe(res);

        // now every thing we add to pdfDoc will save in the invoicePath and also stream to the response

        pdfDoc.fontSize(26).text('Invoice', {
          underline: true,

        })
        pdfDoc.text('--------------------------');

        let totalPrice = 0;

        order.products.forEach(prod => {
          totalPrice += (prod.product.price * prod.quantity);
          pdfDoc
            .fontSize(14).text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price)
        })

        pdfDoc.text('--------------------------');

        pdfDoc.fontSize(18).text('Total Price: $' + totalPrice);

        pdfDoc.end()

      } else {
        req.flash('error', 'You are not allowed to do this action');
        return res.redirect('/orders')
      }
    }).catch(err => {
      return next(err)
    })

};


exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
