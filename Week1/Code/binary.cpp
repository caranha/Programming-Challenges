#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

int main () {
  int n, k, s;
  vector<int> v;

  cin >> n >> s;
  for (int i = 0; i < n; i++) 
  { cin >> k; v.push_back(k); } 

  sort (v.begin(), v.end());

  vector<int>::iterator low,up;
  low = lower_bound (v.begin(), v.end(), s);
  up  = upper_bound (v.begin(), v.end(), s);

  cout <<"lower at "<<(low-v.begin())<< '\n';
  cout <<"upper at "<<(up -v.begin())<< '\n';
}
