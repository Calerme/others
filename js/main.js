'use strict';
/*
** 通过 js 计算 iframe 的高度
* /
 */
// 腾讯视频默认分享宽为 640 高为 498

$(function () {
    // 初始化以及改变窗口大小时按比例设置 iframe 的高
    setIframeHeight();
    window.addEventListener('resize', function () {
        setIframeHeight();
    });

    // 全局变量
    var iframes = getTheYcontent().getElementsByTagName('iframe');

    // 初始化当前 iframes
    letIframeLoad(iframes);
    // 给菜单条设置点击事件
    var $menuItems = $('.navbar-nav li');
    $menuItems.click(function () {
        // active 类名切换
        $menuItems.removeClass('active');
        $(this).addClass('active');
        // 点击菜单条后关闭菜单
        $('.navbar-collapse').collapse('hide');
        // 改变 navbar-brand 名称
        var text = $(this).text();
        $('.navbar-brand').text('亚学会 | '+text);
        // 改变title的名称
        $('title').text(text + '| 亚洲跆拳道学会');

        $('.y-content').css('display','none');
        var _index = $(this).index();


        // 将当前 .active 的 .y-content 内容重写
            // 避免切换后其中的视频还在播放
        $('.y-content.active').html($('.y-content.active').html());

        // 显示相应的 .y-content
        $('.y-content').get(_index).style.display = 'block';
        $('.y-content').removeClass('active');
            // 这里加setTimeout主要是为transition生效
        setTimeout(function () {
            $('.y-content').get(_index).classList.add('active');
            iframes = getTheYcontent().getElementsByTagName('iframe');
            letIframeLoad(iframes);
        },0)
    });

    // 给 window 添加 scroll 事件
    window.addEventListener('scroll', function () {
       letIframeLoad(iframes);
    });
    // 预加载 gif 图，加载好后替换网页中的 jpg
    letGifIn();

});

// 按比例设置 iframe 的高度
function setIframeHeight (divisor) {
    divisor = divisor || (640/498);
    var fullWidth = document.body.clientWidth;
    var iframeHeight = fullWidth / divisor;
    $('iframe').height(iframeHeight);
}

// 检测视频是否进入视口，进入就加载
function letIframeLoad(iframes) {
    [].forEach.call(iframes,function (elem, i, iframes) {
        if(elem.getBoundingClientRect().top < document.documentElement.clientHeight && !elem.dataset.isLoad ) {
            if (elem.dataset.original) {
                elem.src = elem.dataset.original;
                elem.dataset.isLoad = true;
            }
        }
    })
}

// 检测哪个 .y-content 目前被显示出来
function getTheYcontent () {
    var theYcontent = null;
    var yContents = document.getElementsByClassName('y-content');
    [].forEach.call(yContents, function (elem, i, yContents) {
        if (elem.classList.contains('active')) {
            theYcontent = elem;
        }
    });

    return theYcontent;
}

// 预加载 gif 图
var gifURLs = ['./img/muay.gif',
                './img/boxing.gif',
                './img/judo.gif',
                './img/x-sports.gif',
                './img/tricking.gif',
                './img/aikido.gif',
                './img/parkour.gif'];
function letGifIn () {
    var imgs = document.getElementsByTagName('img');
    var newImgs = [];
    for (var i=0; i<imgs.length; i++) {
        newImgs[i] = new Image;
        newImgs[i].index = i;
        newImgs[i].addEventListener('load', function () {
            $(imgs[this.index]).replaceWith(this);
        });
        newImgs[i].src = gifURLs[i];
    }
}