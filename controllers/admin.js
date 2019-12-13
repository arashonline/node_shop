
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

exports.getProductList = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: "Product List",
            path: '/admin/products',
            hasProducts: products.length > 0,
            productCss: true,
            activeShop: true
        })
    }));
}
