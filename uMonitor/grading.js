// 0 - load student and problem list
// 1 - load submissions - submission list object
var submissions;
var student_grades;

function recoverStorage() {
  if (typeof(Storage) !== "undefined") submissions = JSON.parse(localStorage["submissions"]);
}

function loadData() {
  let btn = document.getElementById("loaddata");
  if (btn != null) btn.disabled = true;

  let _students = student_id.join();
  let _problems = problemlist.map( x => { return x.mlist.join()}).join();

  // construct API call
  let api_url = "https://uhunt.onlinejudge.org/api/subs-pids/"+_students+"/"+_problems+"/0"

  // loading data and saving to local storage
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.onload = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        submissions = JSON.parse(xhr.responseText);
        if (typeof(Storage) !== "undefined") localStorage["submissions"] = JSON.stringify(submissions);
        console.log("Done reading data");
      } else {
        console.error(xhr.statusText);
      }
      if (btn != null) btn.disabled = false;
    }
  }
  xhr.open("GET", api_url, true);
  xhr.onerror = function (e) { console.error(xhr.statusText); };
  xhr.send();
}

function doGrading() {
  if (typeof(submissions) == "undefined") {
    console.error("Need to load submission data first");
  }

  let grades = student_id.map(gradeStudent);

  grades.sort( (a,b) => {
    if (a.grade != b.grade) { return (a.grade < b.grade ? -1 : 1 ); }
    if (a.solved.length != b.solved.length) { return b.solved.length - a.solved.length };
    if (a.penalty != b.penalty) { return (a.penalty ? 1 : -1 ); }
    return 0;
  }
  );

  printGradingTable(grades);
  return grades;
}

function printGradingTable(grades) {
  let div = document.getElementById("gradeTable");
  let table = document.createElement("table");
  div.appendChild(table);
  let header = document.createElement("tr");
  table.appendChild(header);
  let headings = ["uname", "base", "penalty", "total", "late", "per week" ];

  headings.map( x => {
    let _th = document.createElement("th");
    _th.appendChild(document.createTextNode(x+", "));
    header.appendChild(_th);
  });


  grades.map( x => {
   let _tr = document.createElement("tr");
   table.appendChild(_tr);

   function addtd(text) {
     let _td = document.createElement("td");
     _td.appendChild(document.createTextNode(text+", "));
     _tr.appendChild(_td);
   }

   addtd(x.id); // name
   addtd(x.grade); // base grade
   addtd((x.penalty ? "Yes" : "No")); // penalty
   addtd(x.solved.length);
   addtd(x.late.length);
   addtd(x.week.join(", "));

 });


}

function gradeStudent(sid) {
  let student = submissions[sid];
  let res = {};

  // all problems;
  let _problems = problemlist.reduce( (acc,cur) => acc.concat(cur.mlist), []);

  res.id = student.uname;
  res.problems = _problems.map(x => gradeProblem(student, x));
  res.solved = res.problems.filter( x => x.accepted == true && x.week > 0);
  res.late = res.solved.filter(x => x.late == true);
  res.oneshots = res.solved.filter(x => x.psubs.length == 1);

  res.week = res.solved.reduce(
    (acc, cur) => {
      acc[cur.week - 1] += 1;
      return acc;
    }, [0,0,0,0,0,0,0,0,0,0]
  );

  res.min = Math.min(...res.week);
  res.grade = "D";
  if (res.min > 1) res.grade = "C";
  if (res.min > 2) res.grade = "B";
  if (res.min > 3) res.grade = "A";

  res.penalty = (res.late.length / res.solved.length) > 0.25;

  return res;
}

function gradeProblem(student, pid) {
  let pr = {}; // problem result object
  pr.pid = pid;
  pr.week = getWeek(pid);
  let deadline = parseUCT(problemlist[pr.week].deadline)

  pr.psubs = student.subs.filter( x => x[1] == pid &&
                                       x[4]*1000 > startdate &&
                                       x[4]*1000 < enddate)

  let acc_subs = pr.psubs.filter( x => x[2] == 90 || x[2] == 80);

  // any submission was accepted
  pr.accepted = acc_subs.length > 0;

  // accepted submissions exist after the week's deadline
  pr.late = pr.accepted && !acc_subs.some( x => x[4]*1000 < deadline );

  return pr;
}

function getWeek(pid) {
  for (let i = 0; i < problemlist.length; i++)
    if (problemlist[i].mlist.includes(pid))
      return i;
  return -1;
}

function test() {
  let stu_id = 1137161;

  let res = gradeStudent(stu_id);

  return res;
}

  // 2 - create student object
  //     - problem performance object: pid, status, first ac, sub_count, week
  // 3 - calculate base grade for each student
  // 4 - output CSV for each student
  //     - student ID
  //     - base grade
  //     - total problems
  //     - total late problems
  //     - per problem: week, id, status, submissions, ac date
