
# Future
- [ ] Fix "display all grades"

Design:
=============================================

Data:
- Student ID list: for student list page
- Problem List: Deadline, Problem ID list
- Globals: Course Start Date, Course End Date





Links:
============================================
u-hunt API:
http://uhunt.felix-halim.net/api

u-hunt component repository:
https://github.com/felix-halim/uhunt-components

Loading Serverside files with Javascript:
http://stackoverflow.com/questions/4533018/how-to-read-a-text-file-from-server-using-javascript

API Reference:
=============================================
Submissions to Specific Problems

URL : /api/p/subs/{pids-csv}/{start-sbt}/{end-sbt}.

To view submissions to specific problems on a given submission date
range. {pids-csv} is a list of problem ids encoded in comma separated
values. {start-sbt} and {end-sbt} are the date range in unix
timestamp. Note that the submissions are returned in no particular
order. This API is suitable for virtual contests that run for a
specific date range on a number of problems.

URL : /api/p/num/{problem-number}.

To view specific problem by {problem-number}.

URL : /api/uname2uid/{uname}.

The {uname} is the username to be converted. The service will return
the user ID of that username.
