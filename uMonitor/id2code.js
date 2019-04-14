var studentlist = [
"yubon",
"Kzyk",
"br3.kyokyo",
"Lenny_183",
"daigoro",
"hoshizora1997",
"hogehoge",
"hatayanshota",
"mackerel",
"yaziroboei",
"u5Oo6rewlD",
"yuabrsn",
"delt",
"DaSH512810",
"k.s.",
"bcms1",
"rynak",
"chocolate cake",
"ref",
"nick9104",
"TNOK",
"WATASHIDESU",
"1046819",
"TKBAze",
"Gurrium",
"latte0119",
];

var studentids = new Array(studentlist.length);

// asynchronously load from uhunt-api
function ajaxp(api_url, p, result_callback) {
  var xhr = window.XMLHttpRequest ?
        new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.onload = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);
          // Parse the text into Javascript object.
        result_callback(data, p); // Notify the caller.
      } else {
        console.error(xhr.statusText);
      }
    }
  }
  xhr.open("GET", api_url, true);
    // Use asynchronous call so that your browser does not hang.
  xhr.onerror = function (e) { console.error(xhr.statusText); };
    // Log to console if there is an error.
  xhr.send();
}

function render() {

   for (i = 0; i < studentlist.length; i++) {
   ajaxp("https://uhunt.onlinejudge.org/api/uname2uid/" + studentlist[i],i,
			function (id,i) {
			   studentids[i] = id;
            document.getElementById("body").innerHTML = studentids.join(',');
         });
   }
}
