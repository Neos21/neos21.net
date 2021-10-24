/*
    csskks.js
    Author: KITAMURA Akatsuki <kits@akatuskinishisu.net>
    Version: 2005-04-16
*/
if (document.getElementsByTagName) {
/* ======================= 設定 ======================= */
    /* 選択フォームのラベル */
    var label = '';
    /* スタイルを適用しない時の選択肢名 */
    var nostyle = 'no style';
    /* 選択フォームを含むdiv要素のclass名 */
    var selectformclass = 'selectstylesheet';
    /* 選択フォームのselect要素のid名 */
    var selectelementid = 'styleselectelement';
    /* cookieの名前 */
    var cname = 'STYLESHEET';
    /* cookieを設定するサイトのパス */
    var cpath="/";
    /* cookieの有効日数 */
    var cdays = 10;
/* ==================================================== */

/* 初期化 */

    /* グローバル変数の設定 */
    var di = document.implementation;
    var sss = getStyleSheets();
    var isOpera = window.opera && navigator.userAgent.match(new RegExp('Opera[/ ]7'));
    var isMacIE = !isOpera && navigator.userAgent.match(new RegExp('MSIE 5.+Mac'));
    /* ページ遷移時にもcookieを保存 */
    /* (MozillaのUIでスタイルを切り替えた場合のため) */
    if (!isOpera) addEvent(window, 'unload', setCookie);
    /* 以降はページ読み込み完了時に実行 */
    addEvent((isOpera ? document : window), 'load', initialize);
}

/* 初期化(ページ読み込み完了後) */

function initialize() {
    /* スタイル適用 */
    setStyle();
    /* 選択フォームを追加 */
    appendSelectForm();
}

/* cookieに保存された名前のスタイルを適用する */

function setStyle() {
    /* cookieからスタイル名を取得 */
    var stitle = getCookie();
    if (!stitle) return;
    /* スタイルの変更 */
    applyStyle(stitle);
}

/* 選択フォームを追加 */

function appendSelectForm() {
    /* スタイル名のリストを取得 */
    var stitles = new Array();
    for (var i = 0; i < sss.length; i++) {
        if (!sss[i].title || isStyleElement(sss[i])) continue;
        /* 既に同じスタイル名がある場合は除く */
        var isSameTitle = false;
        for (var j = 0; j < i; j++) {
            if (sss[j].title == sss[i].title) {
                isSameTitle = true;
                break;
            }
        }
        if (!isSameTitle) {
            stitles[stitles.length] = sss[i].title;
        }
    }
    stitles[stitles.length] = nostyle;
    /* 選択フォームを生成 */
    ndiv = makeSelectForm(stitles);
    /* 選択フォームを本文に追加 */
    var nbody = document.getElementsByTagName('body')[0];
    nbody.insertBefore(ndiv, nbody.firstChild);
    /* 選択フォームの状態を変更 */
    var currentStyleTitle = getStyleTitle() || nostyle;
    var nsel = document.getElementById(selectelementid);
    for (i = 0; i < stitles.length; i++) {
        if (currentStyleTitle == stitles[i]) {
            nsel.selectedIndex = i;
            break;
        }
    }
    /* 選択フォームにスタイルを設定 */
    selectFormStyle(ndiv);
    /* 選択フォーム変更時イベントを設定 */
    addEvent(nsel, 'change', changeSelectForm);
}

/* 選択フォームを含むdiv要素を生成 */

function makeSelectForm(stitles) {
    var ndiv = createHTMLElement('div');
    ndiv.className = selectformclass;
    if (isMacIE) {
        var divHTML = '<label>' + label;
        divHTML += '<select id="' + selectelementid + '">';
        for (var i = 0; i < stitles.length; i++) {
            divHTML += '<option>' + stitles[i] + '</option>';
        }
        divHTML += '</select></label>';
        ndiv.innerHTML = divHTML;
    } else {
        var nsel = createHTMLElement('select');
        nsel.id = selectelementid;
        var nlabel = createHTMLElement('label');
        ndiv.appendChild(nlabel);
        nlabel.appendChild(document.createTextNode(label));
        nlabel.appendChild(nsel);
        for (i = 0; i < stitles.length; i++) {
            var nopt = createHTMLElement('option');
            nopt.appendChild(document.createTextNode(stitles[i]));
            nsel.appendChild(nopt);
        }
    }
    return ndiv;
}

/* フォームで選択された名前のスタイルを適用する */

function changeSelectForm() {
    var nsel = document.getElementById(selectelementid);
    var stitle = nsel.options[nsel.selectedIndex].text;
    /* Mozillaだったら nsel.value でもOK */
    applyStyle(stitle);
}

/* スタイルの適用 */

function applyStyle(stitle) {
    for (var i = 0; i < sss.length; i++) {
        sss[i].disabled = (sss[i].title == stitle || !sss[i].title || isStyleElement(sss[i])) ? false : true;
        stitle == nostyle && (sss[i].disabled = true);
    }
    setCookie();
}

/* スタイル名をcookieへ保存 */

function setCookie() {
    /* 現在適用されているスタイルの名前を取得 */
    var stitle = getStyleTitle() || nostyle;
    var c =  cname + '=' + escape(stitle) + ';' + 'path=' + cpath;
    /* 有効日数が設定されていれば追加 */
    if (cdays) {
        var cexp = new Date();
        cexp.setTime(cexp.getTime() + 1000*60*60*24*cdays);
        c += ';expires=' + cexp.toGMTString();
    }
    document.cookie = c;
}

/* cookieからスタイル名を取得 */

function getCookie() {
    var c = document.cookie + ';';
    var cindex = c.indexOf(cname + '=');
    if (cindex == -1) return false;
    var clen = c.indexOf(';', cindex + cname.length + 1);
    return unescape(c.substring(cindex + cname.length + 1, clen));
}

/* イベントを追加する */

function addEvent(obj, eventType, func) {
    if (di && di.hasFeature('HTMLEvents', '2.0')) {
        /* DOM2 HTMLEvents対応 */
        obj.addEventListener(eventType, func, false);
    } else if (obj.attachEvent) {
        /* WinIE5-6用 */
        obj.attachEvent('on' + eventType, func);
    } else {
        /* MacIE5用 */
        obj['on' + eventType] = func;
    }
}

/* StyleSheetオブジェクトがstyle要素かどうかを判定 */

function isStyleElement(ss) {
    if (di && di.hasFeature('StyleSheets', '2.0')) {
        /* DOM2 Style Sheetss対応 */
        var ssnode = ss.ownerNode;
        if(ssnode === undefined) return false;  /* 保管庫注釈 : エラー回避 */
        /* xml-stylesheet処理命令の時 */
        if (ssnode.nodeType == 7) return false;
        /* style要素の時 */
        if (ssnode.nodeType == 1 && ssnode.localName.toLowerCase() == 'style') return true;
        /* それ以外 */
        return false;
    } else {
        /* WinIE5-6はStyleSheets.ownerNodeが使えないので */
        /* href属性の有無で判定 */
        return (ss.href ? false : true);
    }
}

/* HTML要素を作成する */

function createHTMLElement(tagname) {
    if ( (di && di.hasFeature('Core', '2.0')) || isOpera) {
        /* DOM2 Core対応 or Opera */
        return document.createElementNS('http://www.w3.org/1999/xhtml', tagname);
    } else {
        /* IE5-6用 */
        return document.createElement(tagname);
    }
}

/* 現在適用されているスタイルの名前を取得 */

function getStyleTitle() {
    for (var i = 0; i < sss.length; i++) {
        if (isStyleElement(sss[i])) continue;
        if (sss[i].title && !sss[i].disabled) return sss[i].title;
    }
    return false;
}

/* 選択フォームのスタイル設定 */
/* (スタイル無しの場合にも選択フォームの位置を保つため) */
function selectFormStyle(element) {
    element.style.position = 'absolute';
    element.style.top      = '10px';
    element.style.right    = '10px';
    element.style.zIndex   = '100';
}

/* スタイルシートリストを取得 */

function getStyleSheets() {
    if (
        document.styleSheets &&
        document.styleSheets[0] &&
        document.styleSheets[0].title != null
    ) {
        return document.styleSheets;
    }
    var slinks = new Array();
    var links = document.getElementsByTagName('link');
    for (var i = 0; i < links.length; i++) {
        if (
            links[i].rel &&
            links[i].rel.toLowerCase().indexOf('stylesheet') != -1 &&
            links[i].title
        ) {
            slinks[slinks.length] = links[i];
        }
    }
    return slinks;
}
