
//** Data **//
var problemlist = [
    {name:"Extra Problems",
     deadline:"2016-07-09T00:00:00",
     mlist:[2113,691,1967,2445,1884,2352]},
    {name:"Week 0: How to Solve Problems",
     deadline:"2016-04-22T00:00:01",
     mlist:[2493,3098,36,1082]},
    {name:"Week 1: Data Structures",
     deadline:"2016-04-29T00:00:01",
     mlist:[979,3778,1796,1073,1199,3077,3682]},
    {name:"Week 2: Search Problems",
     deadline:"2016-05-13T00:00:01",
     mlist:[666,2842,2618,3886,1301,802,3768,3086,2267,967]},
    {name:"Week 3: Dynamic Programming",
     deadline:"2016-05-21T00:00:01",
     mlist:[448,1768,438,1072,1202,52,1278,1247]},
    {name:"Week 4: Dynamic Programming II",
     deadline:"2016-05-27T00:00:01",
     mlist:[1437,2259,1662,944,3702,977,1851,2402]},
    {name:"Week 5: Graphs I",
     deadline:"2016-06-03T00:00:01",
     mlist:[3053,3057,410,3104,2733,2021,551,2499,975,1310]},
    {name:"Week 6: Graphs II",
     deadline:"2016-06-10T00:00:01",
     mlist:[1128,499,3553,3497,1295,40,195,1421,2008,1021]},
];
var studentlist = [161945,580382,839069,839075,839072,839081,769688,839063,839582,839062,839070,
420831,218658,839445,839074,560805,840186,794790,796368,229188,839061,839068,
839079,839434,839082,839268,839083,839077,839105,844310,844350];


var startdate = Date.parse("2016-03-30T00:00:00");
var enddate = Date.parse("2016-07-09T00:00:00");

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

	timeleft = Date.parse(problemlist[i].deadline) - (Date.now());
	timeleft = timeleft > 0 ? interval(timeleft)+" from now": "expired";

	htmlBuffer.push("<div class=\"weektable\" id=\"weektable"+i+"\">");
	htmlBuffer.push("<span class=\"weektitle\">"+problemlist[i].name+"</span><br>");
	htmlBuffer.push("<span class=\"deadline\">Deadline: UCT "+problemlist[i].deadline+" ("+timeleft+")</span>");
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
