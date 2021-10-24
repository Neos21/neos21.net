/* abbr要素を再生成する(for WinIE)
 * http://www.akatsukinishisu.net/perl/id/WinIE_abbr
 */

window.onload = init;

function init(){
	if ( navigator.userAgent.match(/MSIE.*Win/) && !navigator.userAgent.match(/Opera/) ) {
	regenerateAbbr();
	quote();
	}
}

function regenerateAbbr() {
    var abbrs = document.getElementsByTagName('abbr');
    for (var i = 0; i < abbrs.length; i++) {
        var oldAbbr = abbrs.item(i);
        var newAbbr = document.createElement('abbr');
        newAbbr.title = oldAbbr.title;
        oldAbbr.parentNode.insertBefore(newAbbr, oldAbbr);
        while (oldAbbr.nextSibling.nodeName != '/ABBR') {
            newAbbr.appendChild(oldAbbr.nextSibling);
        }
        oldAbbr.parentNode.removeChild(oldAbbr.nextSibling);
        oldAbbr.parentNode.removeChild(oldAbbr);
//        alert(newAbbr.parentNode.innerHTML);	確認用
    }
}


/* q要素の内容を引用符で括る(for WinIE)
 * http://hp.vector.co.jp/authors/VA022006/
 */

function quote(){
	var qs = document.getElementsByTagName("q");
	for (var i=0; i<qs.length; i++)
	{
		var obj = qs.item(i);
		var lang = obj.getAttribute("lang");
		if (obj.title || obj.cite) obj.style.cursor = "help";
		var open_quote  = (/^(ja)?$/.test(lang) ? "\u300C" : "\x22");
		var close_quote = (/^(ja)?$/.test(lang) ? "\u300D" : "\x22");
		obj.insertBefore( document.createTextNode(open_quote), obj.firstChild );
		obj.appendChild( document.createTextNode(close_quote) );
	}
}


/* 空のtd要素にスペースを入れ枠線を表示させる
 * http://pc8.2ch.net/test/read.cgi/hp/1110578338/675
 */

if (window.attachEvent) 
window.attachEvent("onload", function() { 
for (var i = 0; i < window.document.all.tags("td").length; i++) 
if (!/\S/.test(window.document.all.tags("td").item(i).innerHTML)) 
window.document.all.tags("td").item(i).innerHTML = "　"; 
});
