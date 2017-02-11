// ==UserScript==
// @name         nHentai图片导出
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 nhentai 中插入一个按钮，点击之后列出图片链接，以便使用下载软件进行下载。
// @author       zecy
// @match        https://nhentai.net/g/*/
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 定义边插入按钮
    var btnArea = document.getElementById('info').getElementsByClassName('buttons')[0];
    var btn = '<button id="getimglist" type="button" class="btn btn-primary" onclick="insertList();">点击获取图片链接</button>';
    btnArea.innerHTML = btnArea.innerHTML + btn;

    // 获取链接列表
    var getImageLinks = function () {
        // 获取链接
        var rawImgLinks = document.getElementsByClassName('lazyload');
        var imgLinks    = [];
        var linkPattern = /https:\/\/t.nhentai.net\/galleries\/(\d+)\/(\d+)t.(jpg|png)/;
        for ( var i = 0; i < rawImgLinks.length; i++ ){
            var rawLink = rawImgLinks[i].src;
            if ( !linkPattern.test(rawLink) ) {
                rawLink = 'https:' + rawImgLinks[i].dataset.src;
            }
            var link = rawLink.replace(linkPattern, "https://i.nhentai.net/galleries/$1/$2.$3");
            imgLinks.push(link);
        }

        return imgLinks;
    };

    // 获取链接列表
    var imglist = getImageLinks().join('<br>');

    // 链接注入当前网页
    var insertList = function() {
        // 列表框定位
        //// 父元素
        var content = document.getElementById('content');
        //// 要插入到这个元素前面
        var thumbnailContainer = document.getElementById('thumbnail-container');

        // 创建一个列表框
        if(!document.getElementById('listbox')) {
            var listBox = document.createElement('div');
            listBox.id = 'listbox';
            listBox.className = 'container';

            // 插入到页面
            content.insertBefore(listBox, thumbnailContainer);

            // 列表注入到页面
            listBox.innerHTML = '<div id="imglistbox" contentEditable>' + imglist + '</div>';
        } else {
            document.getElementById('imglistbox').innerHTML = imglist;
        }

    };
    // 函数注入页面
    window.insertList = insertList;
})();