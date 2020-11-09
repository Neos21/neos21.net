function getCSS()
{
datetoday = new Date();
timenow=datetoday.getTime();
datetoday.setTime(timenow);
thehour = datetoday.getHours();

if (thehour > 22)
display = "style_080909.css";
else if (thehour > 18)
display = "style_080909_b.css";
else if (thehour > 17)
display = "style_080909_y.css";
else if (thehour > 5)
display = "style_080909_g.css";
else if (thehour > 4)
display = "style_080909_y.css";
else
display = "style_080909_p.css";

var css = '<';  css+='link rel="stylesheet" href=' + display + ' \/';  css+='>';

document.write(css);
}

getCSS();
