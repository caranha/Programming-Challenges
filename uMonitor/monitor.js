/**

  TODO 3: Use the API : /api/p to load all problem names at once, instead of calling the names one by one.

  TODO 1: Consider Rewriting the Ajax code to use: /api/subs-user/{user-id}

  This should reduce greatly the number of API calls (one per student, instead of one per problem + one per student),
  and each call should be much smaller.

  TODO 2: Consider Saving some of the Data to local storage:

  If the client has local storage, we can store the data retrieved above and just load new
  submissions from each user by using: /api/subs-user/{user-id}/{min-sid}

  This should cut the loading time even further.

  When calling each user, add to a "user processed count", and call the "display" function at the end of the callback.
  The display function only updates the display + save data after all the ajax is done.
**/

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
     deadline:"2019-07-05T14:59:59+09:00",
     mlist:[2113,3710,3565,2949,734]},
    {name:"Week 0: Introduction and Problem Solving",
     deadline:"2019-04-18T14:59:59+09:00",
     mlist:[36,2827,2595,2899,834,1146,97,979]},
    {name:"Week 1: Data Structures",
     deadline:"2019-04-25T14:59:59+09:00",
     mlist:[3778,2628,1073,1099,2026,1135,2315,2176]},
    {name:"Week 2: Search Problems",
     deadline:"2019-05-09T14:59:59+09:00",
     mlist:[2267,1018,3886,1301,2612,3086,3488,802]},
    // {name:"Week 3: Dynamic Programming I",
    //  deadline:"2018-05-24T14:59:59+09:00",
    // mlist:[2445, 448, 777, 1072, 2890, 1760, 2512, 52]},
    // {name:"Week 4: Graphs I",
    //  deadline:"2018-05-31T14:59:59+09:00",
    //  mlist:[3053, 3873, 813, 2021, 1706, 2938, 1541, 3544]},
    // {name:"Week 5: Graphs II",
    //  deadline:"2018-06-07T14:59:59+09:00",
    //  mlist:[499, 1112, 2352, 3497, 1295, 195, 1421, 1021]},
    // {name:"Week 6: Mathematics",
    //  deadline:"2018-06-14T14:59:59+09:00",
    //  mlist:[1244, 1700, 990, 2396, 1109, 1425, 1031, 2117]},
    // {name:"Week 7: Computational Geometry",
    //  deadline:"2018-06-21T14:59:59+09:00",
    //  mlist:[861, 774, 2934, 2093, 1518, 3060, 3552, 1593]},
    // {name:"Week 8: String Manipulation",
    //  deadline:"2018-06-28T14:59:59+09:00",
    //  mlist:[585, 495, 2342, 2266, 2225, 1576, 1239, 2048]},
    // {name:"Week 9: Interesting Problem Remix!",
    //  deadline:"2018-07-05T14:59:59+09:00",
    //  mlist:[1878, 944, 3679, 3672, 655, 953, 231, 3520]}
];

var studentlist = [161945,1046817,1046863,1047396,1047062,1047078,1047327,1047380,1047312,1046818,876277,
961985,1047365,962913,1047381,1046832,961973,1046827,1046826,1047017,1047260,1046796,1046830,1046712,1047245,
1046831,1046835,1046820,1046847,1047261,1046846,1046839,1047137,1046833,1046868,1046849,1047168,1047267,
1046836,1047232,1047222,1046834,1047046,1046894,1046819,1046844,1046825,1046829,1047359];

var startdate = parseUCT("2019-04-08T00:00:00+09:00");
var enddate = parseUCT("2019-07-05T14:59:59+09:00");

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
function ajax(api_url, result_callback, ...params) {
  var xhr = window.XMLHttpRequest ?
	new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.onload = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);
	  // Parse the text into Javascript object.
        result_callback(data, params); // Notify the caller.
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

  ajax("https://uhunt.onlinejudge.org/api/p/id/" + pid,
       function(pdata) {
	     // get name and link
	       document.getElementById("n"+pdata.pid).innerHTML =
	        "<a target=\"_blank\" href=\"https://uva.onlinejudge.org/index.php?"+
          "option=com_onlinejudge&Itemid=8&"+
          "page=show_problem&problem="+pdata.pid+"\">"+pdata.title+"</a>";
	     // class stats
	       url = "https://uhunt.onlinejudge.org/api/p/subs/"+
	             pdata.pid+"/"+start+"/"+end;

         ajax(url,classdata);
         $(".weektable a").click(function (e) {
	          e.stopPropagation();
          });
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
                    if ((cdata[i].ver == 90 || cdata[i].ver == 80)&& solved[j] == 0) {
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
    ajax("https://uhunt.onlinejudge.org/api/uname2uid/" + username,
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
		     "Problems for user "+username+ " <br>(Total: "+sum+", Week Total: ";
		 var output = output + problemarray.join(' - ') + ")";

		 document.getElementById("username").innerHTML =
		     output;

		 for (var i=0; i < problemlist.length; i++) {
		     var start = Math.floor(startdate/1000);
		     var end = Math.floor(
			 parseUCT(problemlist[i].deadline)/1000);
		     var mlist = problemlist[i].mlist;
		     for (var j=0; j < mlist.length; j++) {
			 var pid = mlist[j];
			 ajax("https://uhunt.onlinejudge.org/api/subs-pids/"+
			      uid+"/"+pid+"/0",
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
    					  if (sub[2] == 90 || sub[2] == 80) {
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
        },
      end);
		     }
		 }
	     }
	 });
}

function s2d(t)
{
    return (t/(3600*24));
}
