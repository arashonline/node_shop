exports.home = (req, res, next) => {
    res.render('shop/index', { pageTitle: 'Shop', path:'/' });
  }