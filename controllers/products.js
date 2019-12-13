
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product',
        {
            pageTitle: "Add Product",
            path: '/admin/add-product',
            productCss: true,
            formCss: true,
            activeAddProduct: true
        })
}
exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/')
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: "SHOP",
            path: '/products',
            hasProducts: products.length > 0,
            productCss: true,
            activeShop: true
        })
    }));
}

exports.getProductList = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: "SHOP",
            path: '/admin/products',
            hasProducts: products.length > 0,
            productCss: true,
            activeShop: true
        })
    }));
}

exports.getCart = (req, res, next) => {
    
        res.render('shop/cart', {
            pageTitle: "Cart page",
            path: '/cart',
        })

}

exports.getCheckout = (req, res, next) => {
    
        res.render('shop/checkout', {
            pageTitle: "Checkout page",
            path: '/checkout',
        })

}