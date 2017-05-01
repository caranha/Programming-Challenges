// TODO: Decouple data loading from data showing:

// "big table" of users x problems. For each cell, list
// Sucessfull, Failed, Late submissions
// Make a button that load this data per problem (or re-load at a reasonable time frame)

// Function that displays the data into the page -- should be reloaded whenever
// the table gets "dirty" -- set dirty flag on the end of data loading, set clean flag
// on the end of datashowing. Should repeat from time to time.

// Get statistics on the number of API calls, and probably on the quantity of data
// Pause updating button, Force updating button.

// Probably still nee

// UCT date parsing incantation from Norman Gray
// http://stackoverflow.com/questions/439630/how-do-you-create-a-javascript-date-object-with-a-set-timezone-without-using-a-s
function parseUCT(dateString) {
    var timebits = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})(?::([0-9]*)(\.[0-9]*)?)?(?:([+-])([0-9]{2})([0-9]{2}))?/;
    var m = timebits.exec(dateString);
    var resultDate;
    if (m) {
        var utcdate = Date.UTC(parseInt(m[1]),
                               parseInt(m[2])-1, // months are zero-offset (!)
                               parseInt(m[3]),
                               parseInt(m[4]), parseInt(m[5]), // hh:mm
                               (m[6] && parseInt(m[6]) || 0),  // optional seconds
                               (m[7] && parseFloat(m[7])*1000) || 0); // optional fraction
        // utcdate is milliseconds since the epoch
        if (m[9] && m[10]) {
            var offsetMinutes = parseInt(m[9]) * 60 + parseInt(m[10]);
            utcdate += (m[8] === '+' ? -1 : +1) * offsetMinutes * 60000;
        }
        resultDate = new Date(utcdate);
    } else {
        resultDate = null;
    }
    return resultDate;
}

//** Data **//
var problemlist = [
    {name:"Non-grading Problems",
     deadline:"2017-07-29T23:59:59",
     mlist:[3710,3565,2113]},
    {name:"Week 0: Introduction and Problem Solving",
     deadline:"2017-04-20T14:59:59",
     mlist:[36,2827,2595,2899,834,1146,97,388]},
    {name:"Week 1: Data Structures",
     deadline:"2017-04-28T14:59:59",
     mlist:[979,2315,3778,2628,1135,1073,2949,1099]},
    {name:"Week 2: Search Problems",
     deadline:"2017-05-12T14:59:59",
     mlist:[2267,1018,691,3886,2842,1301,2612,3086]},
];

var studentlist = [161504, 161945, 769683, 769718, 898781, 898787, 898789, 898790, 
898792, 898794, 898798, 898799, 898800, 898801, 898803, 898804, 898805, 898806, 
898807, 898809, 898810, 898812, 898815, 898817, 898818, 898819, 898820, 898821, 
898822, 898826, 898830, 898835, 898838, 898850, 898863, 899020, 899005, 898949,
898839, 898944, 899051, 898942, 899097, 898811, 898802, 899086, 899051, 899183,
898796, 898791, 899199, 899172, 899115, 899311, 898826
];

var startdate = parseUCT("2017-03-30T00:00:00");
var enddate = parseUCT("2017-07-30T00:00:00");

var StudentWeekSolved = new Array(studentlist.length);
for (var i = 0; i < studentlist.length; i++) {
    StudentWeekSolved[i] = Array.apply(null, Array(problemlist.length)).map(Number.prototype.valueOf,0);
}

var WeekSolvedLevel = new Array(problemlist.length);
for (var i = 0; i < problemlist.length; i++) {
    WeekSolvedLevel[i] = Array.apply(null, Array(15)).map(Number.prototype.valueOf,0);
    WeekSolvedLevel[i][0] = studentlist.length;
}

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
	    problemdata(id,parseUCT(problemlist[i].deadline));
	}
    }
}


function basicdata()
{
    // empty tables, problem ids
    var htmlBuffer = [];
    for (var i = 0; i < problemlist.length; i++) {
        
        date = parseUCT(problemlist[i].deadline);
        datestr = date.toLocaleString();

	timeleft = parseUCT(problemlist[i].deadline) - (Date.now());
	timeleft = timeleft > 0 ? interval(timeleft)+" from now": "expired";

	htmlBuffer.push("<div class=\"weektable\" id=\"weektable"+i+"\">");
	htmlBuffer.push("<span class=\"weektitle\">"+problemlist[i].name+"</span><br>");
	htmlBuffer.push("<span class=\"deadline\">Deadline: "+datestr+" ("+timeleft+")</span>");
	htmlBuffer.push("<div class=\"deadline\" id=\"solvedlevel"+i+"\">Loading</div>");
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
	    "<a target=\"_blank\" href=\"https://uva.onlinejudge.org/index.php?"+
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

       // Counting how many students solved how many problems per week
       var week = 0;
       for (var i = 0; i < problemlist.length; i++) {
	   for (var j = 0; j < problemlist[i].mlist.length; j++) {
	       if (problemlist[i].mlist[j] == cdata[0].pid) { week = i; }}}
       for (var i = 0; i < solved.length; i++) {
	   if (solved[i] == 1) {
	       StudentWeekSolved[i][week] += 1;
	       WeekSolvedLevel[week][StudentWeekSolved[i][week] - 1] -= 1;
	       WeekSolvedLevel[week][StudentWeekSolved[i][week]] += 1; }}
       var htmlBuffer = [];
	htmlBuffer.push("Problems Solved --");
	for (var j = 0; j < WeekSolvedLevel[week].length; j++) {
	    if (WeekSolvedLevel[week][j] > 0) {
		htmlBuffer.push(" "+j+"P:"+WeekSolvedLevel[week][j]+","); }
	}
	document.getElementById("solvedlevel"+week).innerHTML = htmlBuffer.join('');
    }
}

function mysubmissions()
{
    //Remove table elements in case a previous user info has been searched for.
    var status_column = document.getElementsByClassName("status");
    for(var i = 0; i < status_column.length; i++) {
        status_column[i].innerHTML = "";
    }

    // load data for a user from her username
    username = document.getElementById('uname').value;
    ajax("http://uhunt.felix-halim.net/api/uname2uid/" + username,
	 function (uid)
	 {
	     if (uid != 0) {
		 // signal that we got the username
		 var student = -1;
		 for (var i = 0; i < studentlist.length; i++) {
		     console.log(i+" "+studentlist[i]+" "+uid+" "+student);
		     if (studentlist[i] == uid) { student = i;}}
		 if (student == -1) {
		     document.getElementById("username").innerHTML = "Invalid User";
		     return; 
		 }
		 var problemarray = [];
		 var sum = 0;
		 for (var i = 0; i < StudentWeekSolved[student].length; i++) {
		     problemarray.push(StudentWeekSolved[student][i]);
		     sum += StudentWeekSolved[student][i];
		 }
		 var output =
		     "Problems for user "+username+ " <br>(Total: "+sum+", per week:";
		 var output = output + problemarray.join('/') + ")";
		 
		 document.getElementById("username").innerHTML =
		     output;

		 for (var i=0; i < problemlist.length; i++) {
		     var start = Math.floor(startdate/1000);
		     var end = Math.floor(
			 parseUCT(problemlist[i].deadline)/1000);
		     var mlist = problemlist[i].mlist;
		     for (var j=0; j < mlist.length; j++) {
			 var pid = mlist[j];
			 ajaxp("http://uhunt.felix-halim.net/api/subs-pids/"+
			      uid+"/"+pid+"/0",end,
			      function (data,end) {
				  if (data[uid].subs.length == 0) { return; }
				  var status = 0;
                                 var tt = 0;
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
				      if (s > status) { status = s; tt = sub[4]}
				      status = s > status ? s : status;
				  }
				  var v;
				  switch (status) {
				  case 0: v = "<div class=\"ns\">Not submitted</div>"; break;
				  case 1: v = "<div class=\"na\">Not accepted</div>"; break;
                                 //case 2: v = "<div class=\"al\">Accepted ("+s2d(tt-end)+" late)</div>"; break;
                                 // Uncomment the version above to show exactly how late an exercise is
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

function s2d(t)
{
    return (t/(3600*24));
}

