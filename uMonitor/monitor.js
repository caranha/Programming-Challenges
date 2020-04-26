// TODO: Deal correctly with the case when uname returns -- ? -- (Should temporarily discard the data)
// TODO: Deal correctly with saving data and dropping dirty data

// 0-- sub id, 1-- prob id, 2-- veredict, 3-- runtime,
// 4-- submission timestamp, 5-- language, 6-- rank
var student_subs = {};
var student_maxsub = {};
var student_uname = {};
var student_status = {};
var problem_info = {};

var student_calls = 0;
var submissions_read = 0;
var submissions_error = 0;

var variables = ["student_maxsub", "student_subs",
                 "student_uname", "student_status",
                 "problem_info"];

// -- General Functions -- //
function startup() {
  // loading from local storage
  // Stop loading from local storage until things stabilize
  clear_data();

  // if (typeof(Storage) !== "undefined") {
  //   for (var i = 0; i < variables.length; i++)
  //   if (localStorage.hasOwnProperty(variables[i])) {
  //     window[variables[i]] = JSON.parse(localStorage[variables[i]]);
  //   }
  // } else {
  //   console.log("No local storage found!")
  // }

  load_and_render_problems();
}

function clear_data() {
  localStorage.clear();
  console.log("Cleared Local Storage");
}

function save_data() {
  if (typeof(Storage) !== "undefined") {
    for (var i = 0; i < variables.length; i++)
      if (typeof(window[variables[i]]) !== "undefined") {
        localStorage[variables[i]] = JSON.stringify(window[variables[i]]);
      }
  }
}

//-- Load Problem Info --//
function load_and_render_problems() {
  // render basic table
  render_problem_table();

  // render problem names and links
  _probcalls = 0;

  if (typeof(problem_info) == "undefined") {
    problem_info = [];
  }

  var _probsum = 0;
  for (var i = 0; i < problemlist.length; i++) {
     var mlist = problemlist[i].mlist
     for (var j = 0; j < mlist.length; j++) {
        var id = mlist[j];
        load_problem_data(id);
     }
  }

}

function load_problem_data(pid) {
  // console.log("Loading problem: "+pid)
  if (typeof(problem_info[pid]) == "undefined") {
    // console.log("getting from the internet")

    var api_url = "https://uhunt.onlinejudge.org/api/p/id/" + pid
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.onload = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var pdata = JSON.parse(xhr.responseText);
          problem_info[pid] = pdata;
          // get name and link
          document.getElementById("n"+pdata.pid).innerHTML =
            "<a target=\"_blank\" href=\"https://onlinejudge.org/index.php?"+
            "option=com_onlinejudge&Itemid=8&"+
            "page=show_problem&problem="+pdata.pid+"\">"+pdata.title+"</a>";
          $(".weektable a").click(function (e) { e.stopPropagation(); })
        } else {
          console.error(xhr.statusText);
        }
        _probcalls += 1
        if (_probcalls == _problemtotal) {
          console.log("Finished loading problem info.");
          save_data();
          load_submissions();
        }
      }
    }
    xhr.open("GET", api_url, true);
    xhr.onerror = function (e) { console.error(xhr.statusText); };
    xhr.send();

  } else {
    // console.log("Loading from saved Memory")
    var pdata = problem_info[pid];
    document.getElementById("n"+pdata.pid).innerHTML =
      "<a target=\"_blank\" href=\"https://onlinejudge.org/index.php?"+
      "option=com_onlinejudge&Itemid=8&"+
      "page=show_problem&problem="+pdata.pid+"\">"+pdata.title+"</a>";
    $(".weektable a").click(function (e) { e.stopPropagation(); })
    _probcalls += 1;
    if (_probcalls == _problemtotal) {
      console.log("Finished Loading all Problem info");
      save_data();
      load_submissions();
    }
  }
}

function render_problem_table() {
  var htmlBuffer = [];
  _problemtotal = 0;
  for (var i = 0; i < problemlist.length; i++) {
    var date = parseUCT(problemlist[i].deadline);
    var datestr = date.toLocaleString();

    var timeleft = parseUCT(problemlist[i].deadline) - (Date.now());
	  var timeleft = timeleft > 0 ? interval(timeleft)+" from now": "expired";

    htmlBuffer.push("<div class=\"weektable\" id=\"weektable"+i+"\">");
	  htmlBuffer.push("<span class=\"weektitle\">"+problemlist[i].name+"</span><br>");
	  htmlBuffer.push("<span class=\"deadline\">Deadline: "+datestr+" ("+timeleft+")</span>");
	  // htmlBuffer.push("<div class=\"deadline\" id=\"solvedlevel"+i+"\">Loading</div>");
	  htmlBuffer.push("<table class=\"problemtable\" id=\"probtable"+i+"\">");
	  htmlBuffer.push("<tr class=\"tablehead\"><td>#</td><td>Name</td>");
	  htmlBuffer.push("<td>Solv/Subs/Totl</td><td>My Status</td></tr>");

    var mlist = problemlist[i].mlist
    for (var j = 0; j < mlist.length; j++) {
      _problemtotal += 1;
      var id = mlist[j];
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

//-- Load Student and submission info -- //
function load_submissions() {
  student_calls = 0;
  submissions_read = 0;
  submissions_error = 0;

  for (var i = 0; i < student_list.length; i++) {
    if (!(student_maxsub.hasOwnProperty(student_list[i]))) {
      student_maxsub[student_list[i]] = 0;
    }
    if (!(student_subs.hasOwnProperty(student_list[i]))) {
      student_subs[student_list[i]] = [];
    }
    load_student(student_list[i], student_maxsub[student_list[i]]);
  }
}

function grade_students() {
  for (var i = 0; i < student_list.length; i++) {
    parse_student(student_list[i]);
  }
  console.log("Finished parsing all students.");
  aggregate_data();


  // TODO: re-think this code for end-of-semester
  // for (var i = 0; i < student_list.length; i++) {
  //
  //   addRowGradeSummary(student_list[i]);
  //   addRowDetailedSub(student_list[i]);
  // }
}

function aggregate_data() {
  for (let prob of Object.keys(problem_info)) {
    var solv = 0;
    var subs = 0;
    var totl = 0;
    for (let stud of Object.keys(student_uname)) {
      totl += 1;

      if (typeof(student_status[stud][prob]) !== "undefined") {
        if (student_status[stud][prob]["status"] > 0) { subs += 1;}
        if (student_status[stud][prob]["status"] > 1) { solv += 1;}
      }
    }
    if (document.getElementById("sol"+prob) !== null) {
      document.getElementById("sol"+prob).innerHTML = solv+"/"+subs+"/"+totl;
    }

  }
}

// TODO: re-think these functions for end-of-semester
function addRowGradeSummary(sid)
{
  var tabBody=document.getElementById("grade_table");
  var row=document.createElement("tr");

  var sname = document.createElement("td");
  var textnode = document.createTextNode(student_uname[sid]);
  sname.appendChild(textnode);
  row.appendChild(sname);

  var min_week = 8;
  var total_accept = 0;
  var total_lates = 0;

  for (var i = 1; i < 11; i++) {
    probcell = document.createElement("td");
    prob = problemlist[i];
    weekacc = 0;
    weeklate = 0;
    totalsubs = 0;

    for (var j = 0; j < problemlist.mlist.length; j++) {
      if (student_status[sid][prob.mlist[j]]) {
        totalsubs += student_status[sid][prob.mlist[j]].total_subs;
        if (student_status[sid][prob.mlist[j]].status > 1) weekacc += 1;
        if (student_status[sid][prob.mlist[j]].status == 2) weeklate += 1;
      }
    }

    total_accept += weekacc;
    total_lates += weeklate;
    min_week = Math.min(min_week,weekacc);

    if (weekacc < 2) probcell.style.backgroundColor = "yellow";

    textnode = document.createTextNode("A:"+weekacc+" L:"+weeklate+" T:"+totalsubs);
    probcell.appendChild(textnode);
    row.appendChild(probcell);
  }

  finalcell = document.createElement("td");
  textnode = document.createTextNode("B:"+min_week+" T:"+total_accept+" L:"+(total_lates/total_accept).toFixed(3));
  finalcell.appendChild(textnode);
  row.appendChild(finalcell);
  tabBody.appendChild(row);
}

// TODO: re-think these functions for end-of-semester
function addRowDetailedSub(sid)
{
   var tabBody=document.getElementById("submission_table");
   var row=document.createElement("tr");

   var sname = document.createElement("td");
   var textnode = document.createTextNode(student_uname[sid]);
   sname.appendChild(textnode);
   row.appendChild(sname);

   var stsub = document.createElement("td");
   var textnode = document.createTextNode(student_status[sid].total_subs);
   stsub.appendChild(textnode);
   row.appendChild(stsub);

   for (var i = 1; i < 11; i++) {
     var probcell = document.createElement("td");
     var prob = problemlist[i];
     var pstatus = [];
     var psubs = [];

     for (var j = 0; j < prob.mlist.length; j++) {
       if (student_status[sid][prob.mlist[j]]) {
         pstatus.push(student_status[sid][prob.mlist[j]].status);
         psubs.push(student_status[sid][prob.mlist[j]].total_subs);
       } else {
         pstatus.push(0);
         psubs.push(0);
       }
     }

     var textnode1 = document.createTextNode("("+pstatus.join(" / ")+")");
     var textnode2 = document.createTextNode("("+psubs.join(" / ")+")");
     probcell.appendChild(textnode1);
     probcell.appendChild(textnode2);
     row.appendChild(probcell);
   }

   tabBody.appendChild(row);
}

/**
  Receives a submission and returns: Invalid (outside DL),
  Not Solved, Late, Solved
  // 0-- sub id, 1-- prob id, 2-- veredict, 3-- runtime,
  // 4-- submission timestamp, 5-- language, 6-- rank
 **/
function parse_submission(sub)
{
  var prob = sub[1]; var time = sub[4]*1000; var result = sub[2];

  if (time < startdate || time > enddate) return 0; // outside valid date
  var dl = getProbDL(prob);
  if (dl == -1) return 0; // not a valid problem
  if (result < 80) return 1; // failed submission
  if (time > dl) return 2;
  else return 3;
}

function parse_student(student_id) {
  if (!(student_status.hasOwnProperty(student_id))) {
    student_status[student_id] = {};
    student_status[student_id].total_subs = 0;
  }

  for (var i = 0; i < student_subs[student_id].length; i++) {
    var sub = student_subs[student_id][i];
    var ret = parse_submission(sub);
    if (ret > 0) {
      student_status[student_id].total_subs += 1;
      if (!(student_status[student_id].hasOwnProperty(sub[1]))) {
        student_status[student_id][sub[1]] = {};
        student_status[student_id][sub[1]].total_subs = 0;
        student_status[student_id][sub[1]].status = 0;
      }
      student_status[student_id][sub[1]].total_subs += 1;
      student_status[student_id][sub[1]].status = Math.max(ret,student_status[student_id][sub[1]].status);
    }
  }
}

function check_student() {
  //Remove table elements in case a previous user info has been searched for.
  var status_column = document.getElementsByClassName("status");
  for(var i = 0; i < status_column.length; i++) {
      status_column[i].innerHTML = "";
  }

  var query = document.getElementById('uname').value;

  for (let key of Object.keys(student_uname)) {
    if (query == key || query == student_uname[key]) {
      query = key;
      for (let i of Object.keys(problem_info)) {
        var status = 0;
        if (typeof(student_status[query][i]) !== "undefined") {
          status = student_status[query][i]["status"];
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
        if (document.getElementById("st"+i) !== null) {
          document.getElementById("st"+i).innerHTML = v;
        }
      }
      return;
    }
  }

  // could not find the username
  document.getElementById("user_error").innerHTML = "Can't find username";
}


/**
  Load a student's submission data from uHunt API;
  Why did I take this out of the Ajax function?
**/
function load_student(student_id, last_sub)
{
  var api_url = "https://uhunt.onlinejudge.org/api/subs-user/"+student_id+"/"+last_sub
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.onload = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);
        var inqueue = false;
        student_subs[student_id] = student_subs[student_id].concat(data.subs);
        student_uname[student_id] = data.uname;
        student_calls += 1;
        submissions_read += data.subs.length;

        var max_sub = last_sub;
        for (var i = 0; i < data.subs.length; i++) {
          // try to update maxsubs
          if (data.subs[i][0] > max_sub) {
            max_sub = data.subs[i][0];
          }

          // do not update maxsubs if problem is in queue
          if (data.subs[i][2] == 0 || data.subs[i][2] == 20) {
            inqueue = true;
          }
        }
        if (inqueue == false) { student_maxsub[student_id] = max_sub; }
      } else {
        console.error(xhr.statusText);
        student_calls += 1;
        submissions_error += 1;
      }
      if (student_calls == student_list.length) {
        console.log("Loaded "+submissions_read+" subs from "+student_calls+" students. Errors: "+submissions_error+".");
        save_data();
        grade_students();
      }
    }
  }
  xhr.open("GET", api_url, true);
  xhr.onerror = function (e) { console.error(xhr.statusText); };
  xhr.send();
}
