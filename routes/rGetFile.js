/**
 * Created by lishengyong on 2016/9/28.
 */

var express = require('express');
var router = express.Router();
var fs = require('fs');
var Client = require('svn-spawn');
var rules = require('../public/javascripts/module/codeReviewRuls.js');

var ConstData = {
    cwd : 'E:\\work\\webstorm-ws\\codereview\\svntemp'
}

var client = new Client({
    cwd: ConstData.cwd,
    username: 'lishengyong', // optional if authentication not required or is already saved
    password: 'Lsy.69221', // optional if authentication not required or is already saved
    noAuthCache: true, // optional, if true, username does not become the logged in user on the machine
});

var CodeReview = {
    // 当前处理文件的文件名
    currFile:'',
    // 当前文件的行号
    lineNumber:0,
    res:[],
    /**
     * 递归读取指定目录下的文件
     * @param path
     */
    handleFiles : function(path, res) {
        var me = this;
        var inputStream = null;
        fs.stat(path, function(err, stats) {
            if (err) throw err;
            if(stats.isFile()) {
                // 判断文件的后缀， 过滤js文件之外的其他文件
                inputStream = fs.createReadStream(path, {autoClose:true});
                me.codeReview(path, inputStream, res);
            }
            if(stats.isDirectory()) {
                fs.readdir(path, function(err, files) {
                    console.log('文件：  ' + JSON.stringify(files));
                    for(var f in files) {
                        if(files[f] !== '.svn') {
                            me.handleFiles(path + '\\' + files[f], res);
                        }
                    }
                });
            }
        });
    },
    /**
     * 处理code review 主逻辑
     * @param path
     * @param data
     */
    codeReview : function (path, inputStream, res) {
        var me = this;
        var remaining = '';
        inputStream.on('data', function(data) {
            if(me.currFile !== inputStream.path) {
                me.currFile = inputStream.path;
                me.lineNumber = 0;
            }
            remaining += data;
            var index = remaining.indexOf('\n');
            while(index > -1) {
                var line = remaining.substring(0, index);
                remaining = remaining.substring(index + 1);
                //console.log(me.lineNumber + '  :  ' + line);
                var ruleRes = rules.fullEqual(line, me.lineNumber, me.currFile);
                if(ruleRes && Object.keys(ruleRes).length > 0) {
                    me.res.push(ruleRes);
                    console.log(JSON.stringify(me.res));
                };
                index = remaining.indexOf('\n');
                me.lineNumber++;
            }
        });
        inputStream.on('end', function() {
            var ruleRes = rules.fullEqual(remaining, me.lineNumber, me.currFile);
            if (remaining.length > 0) {
                //console.log(me.lineNumber + '  :  ' + remaining);
                if(ruleRes && Object.keys(ruleRes).length > 0) {
                    me.res.push(ruleRes);
                    //console.log(JSON.stringify(me.res));
                };
            }
            me.lineNumber = 0;
            try {
                res.send(JSON.stringify(me.res));
            } catch (e) {
                console.log(e);
            }

        });
    }
};

// https://svn.gomeo2o.cn:8443/gomeo2o_H5/dev/app/branches/20160818_tuangou_lishengyong/src/js/conf/groupbuying
router.post('/', function(req, res, next){
    // 需要检出的文件路径
    var filePath = req.body.filePath;
    /*var res = {};*/
    // TODO 需要根据文件类型来判断， 支持svn还是git  暂时处理svn
    if(filePath) {
        client.cmd(['checkout', filePath], function(err, data) {
            console.log('subcommand done');
            // 从指定的path路径中检出文件。
            // 检出完毕之后读取所有js文件
            CodeReview.handleFiles(ConstData.cwd, res);
        });
    }
    //res.render('review', { title: 'Code Review' });
    //res.send();
});

module.exports = router;

