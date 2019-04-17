var studentlist = [
"nyaaann",
"yubon",
"Kzyk",
"teedra",
"br3.kyokyo",
"Lenny_183",
"Imokenpi",
"speretie",
"tempest11",
"daigoro",
"tosaka2",
"hoshizora1997",
"madoibito80",
"haruca_ichinose",
"basscat",
"hogehoge",
"atomscott",
"hatayanshota",
"mackerel",
"yaziroboei",
"ponzu",
"u5Oo6rewlD",
"yuabrsn",
"delt",
"Mask_coins",
"DaSH512810",
"hagure",
"catla",
"butterfly1040",
"y1n",
"himawi",
"Tacoma56",
"bcms1",
"rynak",
"chocolate cake",
"ref",
"nick9104",
"_mnmik",
"yamaarash1",
"amaoto17",
"crome110",
"bxugao",
"TNOK",
"watashidesu",
"1046819",
"TKBAze",
"Gurrium",
"latte0119"
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
