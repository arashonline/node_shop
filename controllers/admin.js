const Product = require('../models/product');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator/check')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/edit-product',
    editing: false,
    hasError:false,
    oldInput: {
      title:"",
      imageUrl:"",
      price:"",
      description:"",
   }
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const errors= validationResult(req);
 
  if(!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessageValidator: errors.array()
    });
  }
  // for mongoose we only send back a js object which map the variables
  const product = new Product({
    _id: new mongoose.Schema.Types.ObjectId('0'),
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    // in mongoose instead of just saving user._id we could save user object an mongoose will retrieve the id form it
    // userId: req.user._id,
    userId: req.user,
  });
  // mongoose have a method name save()
  product.save()
    .then(result => {
      console.log('Product Created!');
      res.redirect('/admin/products');

    })
    .catch(err => {
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description
      //   },
      //   errorMessageSystem: [{"msg":"Database failed","param":"DATABASE","value": '',"location": 'body'}],
      //   errorMessageValidator: [],
      // });
      res.redirect('/500');
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError:false
      });
    })
    .catch(err => console.log(err));

};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const errors= validationResult(req);
 
  if(!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        _id: prodId,
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc
      },
      errorMessageValidator: errors.array(),
    });
  }

  // instead of creating a product and then update an old one 
  // we're fetch a product by id
  Product.findById(prodId)
  .then(product => {
    if(product.userId.toString() !== req.user._id.toString()){
      return res.redirect('/')
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    // if we use save in a fetched record mongoose update it
    return product.save()
    .then(() => {
      console.log('Updated Product!');
      res.redirect('/admin/products');
    })
    .catch(err => { console.log(err); });
    
  }
  )
    .catch(err => { console.log(err); });

};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
  // _id will always fetched unless we explicitly exclude it
  // .select('title price -_id')
  // // populate allow us to get all the field of relation 
  // .populate('userId','-name')
    .then(products => {
      console.log(products)
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
    });

};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id:prodId, userId:req.user._id})
    .then(result => {
      console.log("Product Deleted!");
      res.redirect('/admin/products');
    })
    .catch(err => { console.log(err); });

};
