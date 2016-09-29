/**
 * Created by lishengyong on 2016/9/28.
 */

var RULESMAP = require('./rulesMap.js');

var rules = {
    /**
     * 判断是否使用全等号
     * @param code
     */
    fullEqual:function(code, lineNum, path) {
        if(code.indexOf('==') !== -1 && code.indexOf('===') === -1 && code.indexOf('!==') === -1) {
            return {file:path, lineNumber:lineNum, rule:RULESMAP.fullEqual, code:code};
        }
    },
    /**
     * 代码是否使用了eval
     * @param code
     * @param lineNum
     * @param path
     */
    hasEval: function(code, lineNum, path) {

    },
    /**
     * 是否在setTimeOut 和 setInterval中传递了字符串， 而非函数
     * @param code
     * @param lineNum
     * @param path
     */
    setTimeOutIntervalCheck: function(code, lineNum, path) {

    },
    /**
     *是否使用了new Array() 而非[]
     * @param code
     * @param lineNum
     * @param path
     */
    useNewArray: function(code, lineNum, path) {

    },
    /**
     * 是否使用了new Object() 而非{}
     * @param code
     * @param lineNum
     * @param path
     */
    useNewObject: function(code, lineNum, path) {

    },
    /**
     * 是否使用了 new Function()
     * @param code
     * @param lineNum
     * @param path
     */
    useNewFunction: function (code, lineNum, path) {

    },
    /**
     * 定义多个变量时使用了多个var
     * @param code
     * @param lineNum
     * @param path
     */
    multipleVar: function (code, lineNum, path) {

    },
    /**
     * 在for中声明了变量
     * @param code
     * @param lineNum
     * @param path
     */
    varInFor: function (code, lineNum, path) {

    },
    /**
     * if 后是否省略了花括号
     * @param code
     * @param lineNum
     * @param path
     */
    lessBrace: function (code, lineNum, path) {
        
    },
    /**
     * 方法是否有注释
     * @param code
     * @param lineNum
     * @param path
     */
    functionComment: function(code, lineNum, path) {

    },
    /**
     * 是否使用with
     * @param code
     * @param lineNum
     * @param path
     */
    useWith: function (code, lineNum, path) {

    },
    /**
     * 当遍历对象的属性时，你可能会发现还会检索方法函数。为了解决这个问题，总在你的代码里包裹在一个if语句来过滤信息。

        for(key in object) {
           if(object.hasOwnProperty(key) {
              ...then do something...
           }
        }
     * @param code
     * @param lineNum
     * @param path
     */
    forInCheck: function (code, lineNum, path) {
        
    },
    /**
     * 遍历数组时是否使用了for in
     * @param code
     * @param lineNum
     * @param path
     */
    forInCheckWithArray: function (code, lineNum, path) {

    }
    ,
    /**
     * 语句结尾缺少分号
     * @param code
     * @param lineNum
     * @param path
     */
    lessSemicolon: function (code, lineNum, path) {

    },
    /**
     * 小心使用 typeof
     * @param code
     * @param lineNum
     * @param path
     */
    typeofWarning: function (code, lineNum, path) {
        
    },
    /**
     * 在判断情况大于2种的时候，使用 switch/case 更高效，而且更优雅（更易于组织代码）。
     * 但在判断的情况超过10种的时候不要使用 switch/case。
     * @param code
     * @param lineNum
     * @param path
     */
    ifElseNotSwitchCase: function (code, lineNum, path) {
        
    }

}

module.exports = rules;