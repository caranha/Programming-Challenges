var studentlist = ["inishie030",
"limich001",
"x5c",
"negset",
"Coco Kaine",
"nawta",
"kv333777",
"RI0",
"ganariya"];

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


function render2()
{
  for (i = 0; i < studentlist.length; i++) {
    var api_url = "https://uhunt.onlinejudge.org/api/uname2uid/"+studentlist[i];
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.onload = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var data = JSON.parse(xhr.responseText);
          console.log(data);
          studentids[i] = data;
          document.getElementById("body").innerHTML = studentids.join(',');
        } else {
          console.error(xhr.statusText);
        }
      }
    }
    xhr.open("GET", api_url, true);
    xhr.onerror = function (e) { console.error(xhr.statusText); };
    xhr.send();
  }
}
