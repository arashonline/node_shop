// all logics related to products come to this file

const products = [];

// we export any function we want
exports.getAddProduct = (req, res, next)=>{
    res.render(
        'add-product',
        {
            pageTitle:"Add Product",
            path:'/admin/add-product',
            productCss: true,
            formCss: true,
        activeAddProduct: true
        })
}
exports.postAddProduct = (req, res, next)=>{
    console.log(req.body);
    products.push({title: req.body.title})
    
    res.redirect('/')
}

exports.getProducts =  (req, res, next) => {
    res.render('shop', { prods: products, 
        pageTitle: "SHOP",
     path: '/',
      hasProducts: products.length > 0,
       productCss: true,
        activeShop: true
     })
}