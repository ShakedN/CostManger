const express = require('express');
const router= express.Router();
const User = require('../models/users');
const Cost = require('../models/costs');



router.get('/costs',function(req,res) {
    Cost.find({}).then(function (cst) {
        res.send(cst);
    }).catch(next);
});

router.post('/costs',function(req,res) {
    Cost.create(req.body).then(function (cst) {
        res.send(cst);
    }).catch(next);
});

router.get('/users',function(req,res) {
    User.find({}).then(function (usr) {
        res.send(usr);
    }).catch(next);
});

router.post('/users',function(req,res) {
    User.create(req.body).then(function (usr) {
        res.send(usr);
    }).catch(next);
});


module.exports = router;