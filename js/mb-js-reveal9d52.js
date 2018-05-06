// hide content for JS-enabled users to be revealed when appropriate
var css = "body.fouc article.page { opacity: 0; visibility: hidden; }";
var head = document.head || document.getElementsByTagName("head")[0];
var contentHider = document.createElement("style");
contentHider.type = "text/css";
if (contentHider.styleSheet) {
	contentHider.styleSheet.cssText = css;
} else {
	contentHider.appendChild(document.createTextNode(css));
}
head.appendChild(contentHider);