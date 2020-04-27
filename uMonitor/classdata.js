var claus_id = [161945]; //[161945,1137204];
var student_id = [1047312, 1112458, 1137119, 1137134, 1137153, 1137157, 1137161, 1137181, 1137186, 1137233, 1137240, 1137249, 1137260, 1137263, 1137308, 1137312];

var student_list = student_id.concat(claus_id);

var startdate = parseUCT("2020-04-01T00:00:00+09:00");
var enddate = parseUCT("2020-07-07T14:59:59+09:00");

var problemlist = [
    {name:"Example Problems (Non-grading)",
     deadline:"2020-04-20T14:59:59+09:00",
     mlist:[2113,3710,2949,734]},
    {name:"Week 1: Introduction and Ad-hoc problems",
     deadline:"2020-05-07T14:59:59+09:00",
     mlist:[36,2827,2595,2899,834,1146,97,979]},
    // {name:"Week 2: Data Structures",
    //  deadline:"2020-05-18T14:59:59+09:00",
    //  mlist:[3778,2628,1073,1099,2026,1135,2315,2176]},
    // {name:"Week 3: Search Problems",
    //  deadline:"2019-05-09T14:59:59+09:00",
    //  mlist:[2267,1018,3886,1301,2612,3086,3488,802]},
    // {name:"Week 4: Dynamic Programming I",
    //  deadline:"2019-05-16T14:59:59+09:00",
    //  mlist:[2445, 448, 777, 1072, 2890, 1760, 2512, 52]},
    // {name:"Week 5: Graphs I",
    //  deadline:"2019-05-23T14:59:59+09:00",
    //  mlist:[3053, 3873, 813, 2021, 1706, 2938, 1541, 3544]},
    // {name:"Week 6: Graphs II",
    //  deadline:"2019-05-30T14:59:59+09:00",
    //  mlist:[499, 1112, 2352, 3497, 1295, 195, 1421, 1021]},
    // // Formerly Week 8
    // {name:"Week 7: String Manipulation",
    //  deadline:"2019-06-06T14:59:59+09:00",
    //  mlist:[585, 495, 2342, 2266, 2225, 1576, 1239, 2048]},
    // {name:"Week 8: Mathematics",
    //  deadline:"2019-06-13T14:59:59+09:00",
    //  mlist:[1244, 1700, 990, 2396, 1109, 1425, 1031, 2117]},
    // {name:"Week 9: Computational Geometry",
    //  deadline:"2019-06-20T14:59:59+09:00",
    //  mlist:[861, 774, 2934, 2093, 1518, 3060, 3552, 1593]},
    // {name:"Week 10: Final Problems. Remix!",
    //  deadline:"2019-06-27T14:59:59+09:00",
    //  mlist:[1878, 944, 3679, 3672, 655, 953, 231, 3520]}
];
