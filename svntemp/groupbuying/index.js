/**
 * 多人成团页
 */

define('conf/groupbuying/index.js', function(require, exports, module) {

    var $ = require('$'),
        Vue = require('vendors/vue.js'),
        vueLazyload = require('vendors/vue-lazyload.es5.js'),
        TimeCount = require('mods/groupbuying/countdown.js'),
        isLogin = require('mods/isLoginFun.js'),
        urlPrefix = location.origin + '/groupbuy/',
        base64 = require('utils/base64.js'),
        CONST_DATA = {
            noMoreData:'没有更多数据啦！',
            timeDescSTART: '距开始还剩：',
            timeDescIN: '距结束剩余：',
            timeDescEND: {state:5,msg:'活动已结束'},
            errMsg:'ajax请求数据错误!',
            sysErrMsg:'服务器异常!',
            cancelTipS:'您已成功取消提醒',
            tipMe:{state:1,msg:'提醒我'},
            timMeMsg:'已成功设置提醒，app会在活动开始前5分钟通知您！',
            cancelTip:{state:2,msg:'取消提醒'},
            cancelTipMsg:'您已成功取消提醒',
            tipErr:'设置失败，请您检查网络！',
            willStart:{state:3,msg:'即将开始'},
            goBuyWithGroup:{state:4,msg:'去开团'},
            hasNoProduct:{state:6,msg:'已售罄'},
            pStatus:{ // 团购商品状态
                NOT_START:1,
                START:2,
                END:3
            }
        };
    require('utils/appInterface.js');
    require('UI/dropload-gg.js');

    // 团购说明图标拖拽
    var DragMove = require('mods/groupbuying/dragDom.js');
    DragMove.dragMove.call(DragMove, '.spirit-play','description' , location.origin + '/groupbuy/' + 'description');

    // vue 图片懒加载
    Vue.use(vueLazyload, {
        preLoad: 1.3, // 加载元素的高度，相当于预先加载第一张
        error: '',
        loading: '',
        try: 1 // default 1
    });

    var vueObj = new Vue({
        el: '#app',
        data: {
            productList: [],
            handleLike:false
        },
        methods: {
            /**
             * 点赞和取消点赞
             */
            likeClick : function(product, event) {
                // 判断登录
                isLogin.isLogined(function() {
                    if(vueObj.handleLike === true) {
                        return ;
                    }
                    vueObj.handleLike = true;
                    var target = event.target;
                    var likeClassL = target.classList;
                    if(!likeClassL) {
                        console.log('没有获取到点赞按钮的类');
                        return;
                    }
                    var action = '';
                    if(likeClassL.contains('love')) {
                        // 处于点赞状态， 调用取消点赞接口
                        action =  'delete';
                    } else {
                        // 处于取消点赞状态， 调用点赞接口
                        action = 'post';
                    }
                    $.ajax({
                        url:'likeApi',
                        type:'GET',
                        data:{id:product.id, action: action},
                        dataType:'json',
                        success:function(data) {
                            console.log(data);
                            if(data.code === 200) {
                                if(action === 'delete') {
                                    likeClassL.remove('love');
                                    product.like.userQuantity = product.like.userQuantity - 1;
                                }
                                if(action === 'post') {
                                    likeClassL.add('love');
                                    product.like.userQuantity = product.like.userQuantity + 1;
                                }
                            } else {
                                console.log(data.message);
                            }
                            vueObj.handleLike = false;
                        },
                        error: function(data) {
                            console.log('ajax请求数据错误!');
                            vueObj.handleLike = false;
                        }
                    })
                });
            },
            /**
             * 去开团
             * @param productId
             * @param event
             */
            shopping : function(groupItem, event) {
                console.log('去开团' + groupItem );
                // 判断登录
                isLogin.isLogined(function() {
                    var url = urlPrefix + 'info?id=' + groupItem.id + '&productId=' + groupItem.itemId;
                    AppInterface.call('/common/localJump', {url:encodeURIComponent(base64.encode(url))});
                });
            },
            /**
             *  notificationApi
             * @param groupBuyItemId  团购id
             * @param isNotification  true 开启提醒 false 取消提醒
             */
            tipShopping : function(groupBuyItem, isNotification, event) {
                $.ajax({
                     type:'GET',
                     url:'notificationApi',
                     data:{groupBuyItemId:groupBuyItem.id, isNotification: isNotification?1:0},
                     dateType:"json",
                     success:function(data) {
                        console.log(data);
                         if(isNotification) {
                             console.log('提醒开团');
                             groupBuyItem.notificationStatus = 1;
                             AppInterface.toast(CONST_DATA.timMeMsg);
                         } else {
                             console.log('取消提醒');
                             groupBuyItem.notificationStatus = 2;
                             AppInterface.toast(CONST_DATA.cancelTipMsg);
                         }
                         handleState(groupBuyItem);
                     },
                     error: function(data) {
                        console.log(CONST_DATA.errMsg);
                         AppInterface.toast(CONST_DATA.tipErr);
                     }
                 });

                handleState(groupBuyItem);
            }
        }
    });

    // 通过ajax请求数据涉及到分页
    var pageNum = 1;
    function fetchData() {
        $.ajax({
            url:'getGroupBuyListApi',
            type:'GET',
            data:{pageNum:pageNum},
            dataType:'json',
            success:function(data) {
                console.log(data);
                if(data && data.groupBuyItems && data.groupBuyItems.length > 0) {
                    var resList = [];
                    if(data.groupBuyItems) {
                        handleProductData(data.groupBuyItems);
                    }
                    TimeCount.init.call(TimeCount,vueObj.productList, handleState);
                } else {
                    AppInterface.toast(CONST_DATA.noMoreData);
                }

            },
            error: function(data) {
                console.log(CONST_DATA.errMsg);
                AppInterface.toast(CONST_DATA.sysErrMsg);
            }
        });
    }
    fetchData();

    /**
     * 处理商品数据， 倒计时，价格等的处理
     * @param products
     * @returns {Array}
     */
    function handleProductData(products) {
        var resList = [];
        try{
            resList = products.map(function(item, index) {
                // 处理数据，格式化以及金额的处理
                console.log(item.groupBuyPrice);
                // 转换金额， 保留两位小数
                item.groupBuyPrice =  Number(item.groupBuyPrice / 100).toFixed(2);
                if(item.item) {
                    item.item.price = '￥' + Number(item.item.price / 100).toFixed(2);
                } else {
                    console.log('获取商品信息失败!');
                }
                // 毫秒时间转换为秒
                item.startTime = Math.floor(item.startTime / 1000);
                item.nowTime = Math.floor(item.nowTime / 1000);
                item.endTime = Math.floor(item.endTime / 1000);
                handleState(item);
                vueObj.productList.push(item);
                return item;
            });
        } catch(e) {
            console.log('数据错误： ' + e);
        }
        return resList;
    }

    function handleState(item) {
        if((item.startTime - item.nowTime) > 0) {
            item.status = CONST_DATA.pStatus.NOT_START;
        } else if((item.endTime - item.nowTime) > 0) {
            item.status = CONST_DATA.pStatus.START;
        } else {
            item.status = CONST_DATA.pStatus.END;
        }
        var timeCount = 0;
        // 设置点击按钮的文本：提醒我， 取消提醒，即将开始， 去开团， 活动已结束
        //当前该团购商品的状态：1，未开始；2，正在进行；3，已结束
        // 如果距离开始时间小于5分钟， 显示即将开始
        // item.startTime item.nowTime item.endTime

        if(item.status === CONST_DATA.pStatus.NOT_START) {
            // 距离活动开始剩余时间 提示‘距开始还剩：**时**分**秒’
            item.timeDesc = CONST_DATA.timeDescSTART;
            timeCount = item.startTime - item.nowTime;
            // 设置时分秒
            item.timeHMS = getTimeHMS(timeCount);

            if ((item.startTime - item.nowTime) < 5 * 60) {
                item.btnText = CONST_DATA.willStart;
            } else {
                // 提醒当前状态。1、开启，2、取消，3、已提醒，默认状态是2
                switch (item.notificationStatus) {
                    case 1:
                        item.btnText = CONST_DATA.cancelTip;
                        break;
                    case 3:
                        item.btnText = CONST_DATA.cancelTip;
                        break;
                    default:
                        item.btnText = CONST_DATA.tipMe;
                }
            }
        } else if(item.status === CONST_DATA.pStatus.START) {
            // 距离活动结束剩余时间 ‘距结束剩余：**时**分**秒’
            item.timeDesc = CONST_DATA.timeDescIN;
            timeCount = item.endTime - item.nowTime;
            // addObjAttr(item, time);
            // 设置时分秒
            item.timeHMS = getTimeHMS(timeCount);

            // 活动已经开始， 按钮显示去开团
            item.btnText = CONST_DATA.goBuyWithGroup;
        } else {
            item.timeHMS = {hour:'00', minite:'00', second:'00'};
            item.btnText = CONST_DATA.timeDescEND;
        }

        // 判断库存量
        if(item.item && item.item.stock <= 0) {
            item.btnText = CONST_DATA.hasNoProduct;
            return item;
        }
        return item;
    }

    /**
     * 获取time指定秒数的时分秒
     * @param time
     * @returns {{}}
     */
    function getTimeHMS(time) {
        var res = {};
        res.hour = addPreZero(Math.floor(time / 3600));
        res.minite = addPreZero(Math.floor(time % 3600 / 60));
        res.second = addPreZero(Math.floor(time % 3600 % 60));
        return res;
    }

    function addPreZero(n) {
        if(n < 10) {
            n = "0" + n;
        }
        return n;
    }



    /**
     * 把一个对象里的属性添加到源对象上
     * @param source
     * @param target
     */
    function addObjAttr(source, target) {
        for(var key in source){target[key] = source[key]};
    }

    var loading = false;
    $('body').dropload({
        loadDownFn: function (me) {
            setTimeout(function () {
                me.resetload();
                pageNum++;
                loading = true;
                fetchData(true);
            }, 500);
        }
    });

    $('body').dropload({
        loadUpFn: function (me) {
            setTimeout(function () {
                me.resetload();
                location.reload(true);
            }, 500);
        }
    });

});




