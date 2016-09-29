/**
 * Created by lishengyong on 2016/9/28.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    console.log(req.method + '..............................');
    res.render('review', { title: 'Code Review' });
})



module.exports = router;