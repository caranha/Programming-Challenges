#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

int main () {
  int n, t, m;
  vector<int> p;

  cin >> n >> m;
  for (int i = 0; i < n; i++) { 
      cin >> t; p.push_back(t); 
  } 

  for (int i = 0; i < (1 << n); i++) {
      t = 0; 
      for (int j = 0; j < n; j++)
          t += (i & (1 << j) ? p[j] : 0);
      if (t == m)
          cout << "found!" << endl;
  }
}
