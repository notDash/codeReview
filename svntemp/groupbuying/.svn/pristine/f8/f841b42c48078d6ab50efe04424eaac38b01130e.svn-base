/**
 * 团购详情页
 */

define('conf/groupbuying/groupbuyDetail.js', function(require, exports, module) {

    /**
     sku  为php在页面定义的变量。 不要覆盖
     **/
    var $ = require('$'),
        common = require('lib/common.js'),
        touchSlide = require('UI/TouchSlide_gm.js'),
        CountDown = require('utils/countdown.js'),
        AppInterface = require('utils/appInterface.js'),
        productId = common.getParams()['productId'], // 商品id
        groupItemId = common.getParams()['id'],// 团购商品项ID
        ErrState = {
            hasNotPayOrder:410,//'有未付款的订单',
            couponErr:422,//'发券失败，不能开团',
            entryAgain:415,//'无法再次参加该团购',
            outOfDate:409,//'不在活动有效期内无法开团',
            systemErr:500 //'系统异常'
        };
    require('mods/groupbuying/skuOpt.js');

    try{shopId}catch (e) {
        console.log('没有获取店铺ID');
        AppInterface.toast('没有获取店铺ID');
    }
    try{sku} catch (e) {
        console.log('没有获取sku');
        AppInterface.toast('没有获取sku信息');
    }

    if($('#bd ul.baner-list li').length > 1) {
        // 轮播图轮播控制
        touchSlide.TouchSlide({
            slideCell: '#bd',
            titCell: '#hd ul',
            mainCell: '.baner-list',
            effect: 'leftLoop',
            timeout: 5000,
            switchLoad: '_src',
            switchLoadN: 1,
            delayTime: 0,
            autoPage:true,
            autoPlay: true
        });
    }

    // 查看我的团/立即参团，跳转拼团详情页
    $('.btn-three').find('a').eq(0).on('click', function(){
        location.href = '/groupbuy/spellGroupInfo';
    });

    $('.tuan-list li a.gobtn').on('click', function() {
        // 获取团购ID
        var groupId = $(this).attr('data-id');
        var url = '/groupbuy/spellGroupInfo';
        if(groupId) {
            url += '?id=' + groupId;
        }
        location.href = url;
    });

    function toProductDetail() {
        console.log('跳转商品详情...');
        AppInterface.call('/product/detail', {shopId: shopId,productId: productId, orderSource:130100003018});
    }

    // 单独购买， 跳转商品详情
    $('.buy-detail a').on('click', function() {
        toProductDetail();
    })
    $('.btn-three').find('a').eq(1).on('click', function(){
        toProductDetail();
    });
    $('.buy-bottBtn a').eq(0).on('click',  function() {
        toProductDetail();
    });

    // 更多团购，跳转多人成团页
    $('.btn-three').find('a').eq(2).on('click', function(){
        location.href = '/groupbuy';
    });

    // 点击查看更多
    $('.more_a em').on('click', function() {
        console.log('查看更多...');
        var me = this,
            opt = '';
        if($(me).hasClass('down')) {
            opt = 'down';
        }
        if($(me).hasClass('up')) {
            opt = 'up';
        }
        $('.tuan-list li').each(function(index){
            if(index > 1 && opt === 'down') {
                $(this).show();
                me.innerHTML = '&#xea56;';
            }
            if(index > 1 && opt === 'up') {
                $(this).hide();
                me.innerHTML = '&#xea59;';
            }
        });
        if(opt === 'down') {
            $(me).removeClass('down');
            $(me).addClass('up');
            $(me).next()[0].innerHTML = '';
        }
        if(opt === 'up') {
            $(me).removeClass('up');
            $(me).addClass('down');
            $(me).next()[0].innerHTML = '点击展示更多团购';
        }

    });

    // 关闭限制购买弹层
    $('.buy-top').on('click','.btn-close', function () {
        $('.buy-top').hide();
    });

    // 立即开团， 点击弹层， 下单购买
    $('.buy-bottBtn a').eq(1).on('click',  function() {
        if(!$(this).hasClass('btn-a-dis')) {
            $('.xin-mask')[0].style.display = 'block';
            $('#select-gd-wrap')[0].style.display = 'block';
            // 设置history state 点击返回的时候关闭蒙层
            pushState('.xin-mask');
            window.event.preventDefault();
        } else {
            console.log('活动已结束');
        }
    });

    $('.btn-pop').on('click', function(){
        // 去支付， 跳转待付款页面
        AppInterface.call('/order/list' ,{type:1});
    });

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
                url:'/groupbuy/openGroupBuy',
                type:'POST',
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
        var skuItem = $('.skus .sku .sku-item'),
            skuId = -1,
            res = {skuId:-1, skuItem:[]},// skuItem 用于记录是否选择数据， 来做提交数据的校验
            i,
            j,
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

    // 倒计时
    var time = $('.time span').attr('data-times');
    time = Math.floor(time /  1000);
    CountDown.countDown.call(CountDown, {day:'', hour:'.time cite.hour', min:'.time cite.min', sec:'.time cite.sec', time:time}, function(){
        console.log('倒计时结束回调...');
        // 修改立即开团按钮的样式
        $('.buy-bottBtn a').eq(1).addClass('btn-a-dis');
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
    });

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