
//** Data **//
var problemlist = [
    {deadline:"2016-07-09T00:00:00",
     mlist:[2113]},
    {deadline:"2016-04-22T00:00:01", 
     mlist:[2493,3098,36,1082]},
];
var studentlist = [161945,839071,580382,839067,839069,839075,839072,839081,769688,
839063,839062,420831,839073,218658,839074,560805,794790,796368,229188,839061,839068
,839079,839082,839268,839077,839105];

var startdate = Date.parse("2016-03-30T00:00:00");
var enddate = Date.parse("2016-07-09T00:00:00");

//** Code **//

// http://stackoverflow.com/questions/814613/
// how-to-read-get-data-from-a-url-using-javascript
function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

// asynchronously load from uhunt-api
function ajax(api_url, result_callback) {
  var xhr = window.XMLHttpRequest ? 
	new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.onload = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = JSON.parse(xhr.responseText); 
	  // Parse the text into Javascript object.
        result_callback(data); // Notify the caller.
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

// calculate time countdown
function interval(nano) {
    var ret = "";

    var day = Math.floor(nano/(1000*60*60*24));
    ret += day+" day";
    ret += day != 1 ? "s, ": ", "
    nano = nano%(1000*60*60*24);

    var hour = Math.floor(nano/(1000*60*60));
    ret += hour > 9 ? hour+":" : "0"+hour+":";
    nano = nano%(1000*60*60);

    var min = Math.floor(nano/(1000*60));
    ret += min > 9 ? min : "0"+min;
    
    ret += " hour"
    ret += hour != 1 ? "s":""

    return ret;
}

// render problem tables
function render() {
    // empty tables, problem ids
    basicdata();

    // load problem data and class data
    for (var i = 0; i < problemlist.length; i++) {
	var mlist = problemlist[i].mlist
	for (var j = 0; j < mlist.length; j++) {
	    id = mlist[j];
	    problemdata(id,Date.parse(problemlist[i].deadline));
	}
    }
}


function basicdata()
{
    // empty tables, problem ids
    var htmlBuffer = [];
    for (var i = 0; i < problemlist.length; i++) {

	timeleft = Date.parse(problemlist[i].deadline) - Date.now();
	timeleft = timeleft > 0 ? interval(timeleft)+" from now": "expired";

	htmlBuffer.push("<div class=\"weektable\" id=\"weektable"+i+"\">");
	htmlBuffer.push("<span class=\"weektitle\">Week "+i+"</span><br>");
	htmlBuffer.push("<span class=\"deadline\">Deadline: "+timeleft+"</span>");
	htmlBuffer.push("<table class=\"problemtable\" id=\"probtable"+i+"\">");
	htmlBuffer.push("<tr class=\"tablehead\"><td>#</td><td>Name</td>");
	htmlBuffer.push("<td>Sol/Sub/Total</td><td>My Status</td></tr>");
	
	var mlist = problemlist[i].mlist
	for (var j = 0; j < mlist.length; j++) {
	    id = mlist[j];
	    htmlBuffer.push("<tr>");
	    htmlBuffer.push("<td>"+(j+1)+"</td>")
	    htmlBuffer.push("<td class=\"pname\" id=\"n"+id+"\"></td>");
	    htmlBuffer.push("<td class=\"solcount\" id=\"sol"+id+"\">No submissions</td>");
	    htmlBuffer.push("<td class=\"status\" id=\"st"+id+"\"></td>");
	    htmlBuffer.push("</tr>");
	}
	htmlBuffer.push("</table><div class=\"toggle\">click to show/hide</div></div>");
        
    }
    document.getElementById("problemtable").innerHTML = htmlBuffer.join('\n');        
    $(".weektable").click(function(){
                $(this).find("table").toggle();
    });
}

function problemdata(pid, dl)
{
    // load problemdata and class data
    var start = Math.floor(startdate/1000);
    var end = Math.floor(dl/1000);
    
    ajax("http://uhunt.felix-halim.net/api/p/id/" + pid, function(pdata) {
	// name and link
	document.getElementById("n"+pdata.pid).innerHTML = 
	    "<a href=\"https://uva.onlinejudge.org/index.php?"+
	    "option=com_onlinejudge&Itemid=8&category=24&"+
	    "page=show_problem&problem="+pdata.pid+"\">"+pdata.title+"</a>";
	// class stats
	url = "http://uhunt.felix-halim.net/api/p/subs/"+
	    pdata.pid+"/"+start+"/"+end;
	ajax(url,classdata);
    })
}

function classdata(cdata)
{
   // load class stats
   var total = studentlist.length;
   if (cdata.length > 0) {
	var nsolved = 0;
	var nsubmitted = 0;
	solved = Array.apply(null, Array(total)).map(Number.prototype.valueOf,0);
   submitted = Array.apply(null, Array(total)).map(Number.prototype.valueOf,0);
   
	for (var i = 0; i < cdata.length; i++) {
      for (j = 0; j < studentlist.length; j++) {
         if (cdata[i].uid == studentlist[j]) {
            if (submitted[j] == 0) {
               submitted[j] = 1;
               nsubmitted += 1;
            }
   			if (cdata[i].ver == 90 && solved[j] == 0) {
   			   nsolved += 1;
   			   solved[j] = 1;
   			}
			}
		}
	}
	document.getElementById("sol"+cdata[0].pid).innerHTML = 
	    nsolved+"/"+nsubmitted+"/"+total;
   }   
}

function mysubmissions()
{
    // load data for a user from her username
    username = document.getElementById('uname').value;
    ajax("http://uhunt.felix-halim.net/api/uname2uid/" + username, 
	 function (uid) 
	 { 
	     if (uid != 0) {
		 // signal that we got the username
		 var output = 
		     "Problems for user "+username;
		 document.getElementById("username").innerHTML = 
		     output;
		 
		 for (var i=0; i < problemlist.length; i++) {
		     var start = Math.floor(startdate/1000);
		     var end = Math.floor(
			 Date.parse(problemlist[i].deadline)/1000);
		     var mlist = problemlist[i].mlist;
		     for (var j=0; j < mlist.length; j++) {
			 var pid = mlist[j];
			 ajax("http://uhunt.felix-halim.net/api/subs-pids/"+
			      uid+"/"+pid+"/0",
			      function (data) {
				  if (data[uid].subs.length == 0) { return; }
				  var status = 0;
				  var id = data[uid].subs[0][1];
				  for (var k = 0; k < data[uid].subs.length; k++) {
				      sub = data[uid].subs[k];
				      var s = 0;
				      if (sub[4] > start) {
					  s = 1;
					  if (sub[2] == 90) {
					      s = sub[4] > end ?
						  2 : 3;
					  }
				      }
				      status = s > status ? s : status;
				  }
				  var v;
				  switch (status) {
				  case 0: v = "<div class=\"ns\">Not submitted</div>"; break;
				  case 1: v = "<div class=\"na\">Not accepted</div>"; break;
				  case 2: v = "<div class=\"al\">Accepted (late)</div>"; break;
				  case 3: v = "<div class=\"ac\">Accepted</div>"; break;
				  }
				  document.getElementById("st"+id).innerHTML = v;
			      });
		     }
		 }
	     }
	 });
}	     

