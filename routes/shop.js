// handles shop (front requests)

const express = require('express');

// this router is like a mini express which we can export
const router = express.Router();

// now we use the router to register things
router.get('/',(req, res, next)=>{
    res.send(`<h1>Front Page</h1>`)
});

module.exports = router;
