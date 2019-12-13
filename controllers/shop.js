
const Product = require('../models/product');


exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/')
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: "Product List",
            path: '/products',
            hasProducts: products.length > 0,
            productCss: true,
            activeShop: true
        })
    }));
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products',
            productCss: true,
            activeShop: true,
        })
    })

}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: "Cart page",
        path: '/cart',
    })
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: "Orders page",
        path: '/orders',
    })
}

exports.getCheckout = (req, res, next) => {

    res.render('shop/checkout', {
        pageTitle: "Checkout page",
        path: '/checkout',
    })

}