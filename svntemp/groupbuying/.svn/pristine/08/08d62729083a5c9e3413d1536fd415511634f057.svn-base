/**
 * Created by tianguangyu on 2016/8/23.
 */
define('conf/groupbuying/groupResult.js', function(require, exports, module) {
    var $ = require('$');
    var AppInterface = require('utils/appInterface.js');
    var getParamsFun = require('mods/newhome/getParamsFun');
    var base64 = require('utils/base64.js');
    var ConutDown = require('utils/countdown.js');
    var storage = require('mods/storage.js');
    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body);
    require('mods/groupbuying/skuOpt.js');

    var params = {};
    params.url = location.href;
    params.userid = window.userId || 0;
    params.cookid = storage.getCookie('PHPSESSID') || 0;

    /*获取域名*/
    var urlP = location.protocol + '//';
    var urlH = urlP + location.hostname;

    var p = {
        type: encodeURIComponent('default'),
        title: encodeURIComponent(''),
        desc: encodeURIComponent(''),
        imgUrl: encodeURIComponent(base64.encode(window.logo)),
        link: encodeURIComponent(base64.encode(window.linkUrl)),
        shareAppUrl: encodeURIComponent(base64.encode(window.shareAppUrl + '/groupbuy/spellGroupInfo'))
    }

    var ErrState = {
        hasNotPayOrder:'410',//'有未付款的订单',
        couponErr:'422',//'发券失败，不能开团',
        entryAgain:'415',//'无法再次参加该团购',
        outOfDate:'409',//'不在活动有效期内无法开团',
        systemErr:'500' //'系统异常'
    };

    if($('.buy-end-time').length){
        countDown(window.remainTime);
    }

    // 商品详情 && 团购详情
    $('.xin-btn-small').click(function (){
        if($(this).attr('productId')){
            console.log("商品详情");
            var productId = $(this).attr('productId');
            var orderSource = $(this).attr('data-ordersource');
            AppInterface.call('/product/detail',{shopId: shopId, productId: productId, orderSource: orderSource});
        }else{
            console.log("团购详情");
            var dataValue = $(this).attr('data-value');
            AppInterface.call('/common/localJump', {url: base64.encode(urlH + dataValue)});
        }

    });

    // 我要参团
    $('#join-group').click(function (){
        console.log('点击立即开团');
        if(!$(this).hasClass('btn-a-dis')) {
            console.log('调用开团接口');
            // 调用开团接口
        }
        $('.xin-mask')[0].style.display = 'block';
        $('#select-gd-wrap')[0].style.display = 'block';
        window.event.preventDefault();
    });


    // 更多团购
    $('#more-group-buy').click(function (){
        console.log("更多团购");
        var dataValue = $(this).attr('data-value');
        AppInterface.call('/common/localJump', {url: base64.encode(urlH + dataValue)});
    });

    // 召集好友参团
    $('#group-together').click(function (){
        console.log("召集好友参团");
        AppInterface.call('/common/share', p, function(data) {
            if (data.success) {
                $('.window-share').animate({
                    bottom: '-4rem'
                }, 200);
                $('.window-bg').hide();
            }
        });
    });

    // 查看订单详情
    $('#search-order-detail').click(function (){
        console.log("查看订单详情");
        var orderId = $(this).attr('orderId');
        AppInterface.call('/order/detail', {orderId: orderId});
    });

    // 弹层sku选择
    $('.skus .sku .sel-tag-cont').on('click', 'span', function() {
        var nodes = $(this)[0].parentNode.children;
        for(var i = 0; i < nodes.length; i++) {
            if(nodes[i] != this) {
                $(nodes[i]).removeClass('active');
            }
        }
        $(this).toggleClass('active');
    })

    // 倒计时方法
    function countDown(countDownTime)
    {
        ConutDown.countDown.call(
            ConutDown,
            {
                day:'',
                hour:$('.buy-end-time span')[0],
                min:$('.buy-end-time span')[1],
                sec:$('.buy-end-time span')[2],
                time:countDownTime
            });
    }

    // 数据处理状态
    var handleState = false;
    $('.sel-btn-one').on('click', function() {
        // 根据参数来获取skuID
        var skuObj = getSkuId();
        if(skuObj.skuItem.length > 0) {
            for(var i in skuObj.skuItem) {
                for(var key in skuObj.skuItem[i]) {
                    if (skuObj.skuItem[i][key] === false) {
                        AppInterface.toast('请选择' + key);
                        return false;
                    }
                }
            }
        }
        if(skuObj.skuId === -1) {
            console.log('没有获取到skuID');
            return false;
        }

        if(!handleState) {
            handleState = true;
            $.ajax({
                url:'/groupbuy/entryApi',
                type:'GET',
                data:{groupBuyItemId:groupItemId, skuId:skuObj.skuId},
                dataType:'json',
                success: function(data) {
                    console.log('开团接口返回数据: ' + data);
                    /*data.data: {id: 309, couponMoney: 100, couponId: 14545, entryId: 34}*/
                    if(!data || !data.data) {
                        console.log('开团接口返回数据有误！');
                        handleState = false;
                        return ;
                    }
                    switch (data.code) {
                        case ErrState.hasNotPayOrder:// 有未付款的订单
                            // 关闭下单弹层
                            closeBuyLayout();
                            // 显示去付款弹框
                            showGoPayPop();
                            handleState = false;
                            break;
                        case ErrState.couponErr:
                            AppInterface.toast('发券失败，不能开团');
                            handleState = false;
                            break;
                        case ErrState.entryAgain:
                            AppInterface.toast('无法再次参加该团购');
                            handleState = false;
                            break;
                        case ErrState.outOfDate:
                            AppInterface.toast('不在活动有效期内无法开团');
                            handleState = false;
                            break;
                        case ErrState.systemErr:
                            console.log('系统异常');
                            handleState = false;
                            break;
                        default:
                            var param = {
                                shopId:shopId,
                                skuId:skuObj.skuId,
                                isOneYuan:0,//(1:一元购商品，0:普通商品),
                                couponId: data.data.couponId, // 优惠券ID
                                couponMoney:data.data.couponMoney,//优惠券金额(元)
                                productNum:1 ,//(一元购商品可不传为1)
                                entryId: data.data.entryId // 参团ID
                            }
                            console.log('跳转确认订单页参数： ' + param);
                            handleState = false;
                            AppInterface.call('/order/confirmOrder' ,param);
                    }
                },
                error: function(data) {
                    console.log('调用开团接口失败：' + data);
                    handleState = false;
                }
            });
        }
    });

    // 获取所有的sku Id
    function getSkuId() {
        var skuItem = $('.skus .sku .sku-item');
        var skuId = -1;
        // skuItem 用于记录是否选择数据， 来做提交数据的校验
        var res = {skuId:-1, skuItem:[]},
            i = 0,
            j = 0,
            skuObj = {},
            tempSku = null;
        // 获取所选参数的sku
        for(i = 0;i < skuItem.length; i++) {
            var title = $(skuItem[i]).children('.sel-title')[0].innerHTML;
            var tempObj = {};
            tempObj[title] = false;
            tempSku = $($(skuItem[i]).children('.sel-tag-cont')[0]).children('span');
            for(j = 0;j < tempSku.length; j++) {
                if($(tempSku[j]).hasClass('active')) {
                    skuObj[title] = tempSku[j].innerHTML;
                    tempObj[title] = true;
                    break;
                }
            }
            res.skuItem.push(tempObj);
        }
        // 在sku 中对比取到相应的skuID
        if(sku) {
            for(var s in sku) {
                var tempS = sku[s].attributes;
                if(compareSKU(skuObj, tempS)) {
                    skuId = sku[s].id;
                    break;
                }
            }
        }
        res.skuId = skuId;
        return res;
    }

    // 比较一个数组和一个对象的key
    function compareSKU(source, skuAttr) {
        for(var s in skuAttr) {
            if(source[skuAttr[s].name] !== skuAttr[s].value) {
                return false;
            }
        }
        return true;
    }

    // 显示去支付弹层
    function showGoPayPop() {
        $('.pop')[0].style.display = 'block';
        pushState('.pop');
    }

    // 关闭下单弹层
    $('.close-btn').on('click', closeBuyLayout);
    function closeBuyLayout() {
        $('.xin-mask')[0].style.display = 'none';
        $('#select-gd-wrap')[0].style.display = 'none';
        if(history.state && history.state.status === '.xin-mask') {
            history.back();
        }
    }

    // 点击蒙层关闭
    $('.pop').on('click', function(e) {
        if(e.target === e.currentTarget) {
            $(this).hide();
            if(history.state && history.state.status === '.pop') {
                history.back();
            }
        }
    });

    function pushState(dom) {
        if(window.history) {
            history.state ? window.history.replaceState({status:dom}, '团购详情', ''):window.history.pushState({status:dom}, '团购详情', '');
        }
    }
    /*window.onpopstate = function() {
     console.log(event.state);
     if($('.pop')[0].style.display == 'block') {
     $('.pop').hide();
     }
     if($('.xin-mask')[0].style.display == 'block') {
     closeBuyLayout();
     }
     }*/
    window.addEventListener("popstate", function () {
        if($('.pop')[0].style.display == 'block') {
            $('.pop').hide();
        }
        if($('.xin-mask')[0].style.display == 'block') {
            closeBuyLayout();
        }
    });

});
