count = 0;
var interV = setInterval(function () {
  for (var i = 0; i < document.getElementsByTagName("img").length; i++) {
    if (
      document.getElementsByTagName("img")[i].alt == "www.000webhost.com"
    ) {
      console.log(document.getElementsByTagName("img")[i]);
      document.getElementsByTagName("img")[i].remove();
      clearInterval(interV);
      break;
    }
  }
  count += 1;
  if (count > 1000) {
    clearInterval(interV);
  }
}, 1);