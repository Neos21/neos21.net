var r;
xx = new Array();
xx[0] = '<A HREF=\"http://banana.fruitmail.net/cgi/introduce_jump1.cgi?2147962\" TARGET=_blank><IMG SRC=\"http://www.fruitmail.net/image/fruit468.gif\" BORDER=0></A>';
xx[1] = '<A HREF=\"http://banana.fruitmail.net/cgi/introduce_jump1.cgi?2147962\" TARGET=_blank><IMG SRC=\"http://www.fruitmail.net/image/fruit234.gif\" BORDER=0></A>';
xx[2] = '<A HREF=\"http://banana.fruitmail.net/cgi/introduce_jump1.cgi?2147962\" TARGET=_blank><IMG SRC=\"http://www.fruitmail.net/image/non_counter.gif\" BORDER=0></A>';
xx[3] = '<A HREF=\"http://banana.fruitmail.net/cgi/introduce_jump1.cgi?2147962\" TARGET=_blank><IMG SRC=\"http://www.fruitmail.net/image/fruit.gif\" BORDER=0></A>';
xx[4] = '<A HREF=\"http://banana.fruitmail.net/cgi/introduce_jump1.cgi?2147962\" TARGET=_blank><IMG SRC=\"http://www.fruitmail.net/image/fruit120.gif\" BORDER=0></A>';
xx[5] = '<A href=\"http://www1.cmsite.co.jp/scripts/gwiisole.dll/CMSiteSC.MainClass.Action?zigoro\" TARGET=_blank><IMG src=\"http://www.cmsite.co.jp/banner/gif_banner01.gif\" BORDER=0></A>';
xx[6] = '<A href=\"http://www1.cmsite.co.jp/scripts/gwiisole.dll/CMSiteSC.MainClass.Action?zigoro\" TARGET=_blank><IMG src=\"http://www.cmsite.co.jp/banner/gif_banner02.gif\" BORDER=0></A>';
xx[7] = '<A href=\"http://www1.cmsite.co.jp/scripts/gwiisole.dll/CMSiteSC.MainClass.Action?zigoro\" TARGET=_blank><IMG src=\"http://www.cmsite.co.jp/banner/gif_banner07.gif\" BORDER=0></A>';
xx[8] = '<A href=\"http://www1.cmsite.co.jp/scripts/gwiisole.dll/CMSiteSC.MainClass.Action?zigoro\" TARGET=_blank><IMG src=\"http://www.cmsite.co.jp/banner/gif_banner08.gif\" BORDER=0></A>';
xx[9] = '<A href=\"http://www1.cmsite.co.jp/scripts/gwiisole.dll/CMSiteSC.MainClass.Action?zigoro\" TARGET=_blank><IMG src=\"http://www.cmsite.co.jp/banner/gif_banner03.gif\" BORDER=0></A>';
xx[10] = '<A href=\"#\" TARGET=_blank><IMG src=\"gif_banner04.gif\" BORDER=0></A>';  // 保管庫注釈 : http://www1.cmsite.co.jp/scripts/gwiisole.dll/CMSiteSC.MainClass.Action?zigoro
xx[11] = '<A href=\"http://www1.cmsite.co.jp/scripts/gwiisole.dll/CMSiteSC.MainClass.Action?zigoro\" TARGET=_blank><IMG src=\"http://www.cmsite.co.jp/banner/gif_banner05.gif\" BORDER=0></A>';
xx[12] = '<A href=\"http://www1.cmsite.co.jp/scripts/gwiisole.dll/CMSiteSC.MainClass.Action?zigoro\" TARGET=_blank><IMG src=\"http://www.cmsite.co.jp/banner/gif_banner06.gif\" BORDER=0></A>';
// r = Math.floor(Math.random() * xx.length);  // 保管庫注釈 : アーカイブ用に必ず xx[10] を有効にする
r = xx[10];

document.write("<DIV style=\"width:100%;border:2px solid #0066FF;margin:10pt 5px 5px 5px;padding:10px;\"><IFRAME src=a.html width=\"100%\" height=\"570\" frameborder=0 scrolling=\"NO\" marginwidth=0 marginheight=0></IFRAME></DIV>");
document.write("<BR clear=all>");
document.write("<DIV align=center>");
document.write(xx[r]);
document.write("</DIV>");
document.write("<P align=right>Copyright (C) 2002-2004 Neo, All rights reserved.</P>");

//	｢"｣を打つ時は｢\｣を先に打つ
//	document.write("？");
//	xx[] = '？？';
//	0	フルーツメール	468×060
//	1	フルーツメール	234×060
//	2	フルーツメール	170×060
//	3	フルーツメール	143×060
//	4	フルーツメール	120×060
//	5	CMサイト	468×060青
//	6	CMサイト	468×060赤
//	7	CMサイト	140×050青
//	8	CMサイト	140×050赤
//	9	CMサイト	240×080青
//	10	CMサイト	240×080赤
//	11	CMサイト	130×130青
//	12	CMサイト	130×130赤
