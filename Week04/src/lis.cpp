#include<iostream>
#include<vector>
#include<algorithm>


using namespace std;

int main()
{
  int n;
  vector<int> A;

  cin >> n;
  for (int i = 0; i < n; i++) {
    int tmp;
    cin >> tmp;
    A.push_back(tmp);
  }

  vector<int> S_max; int max_len = 0;

  for (int i = 0; i < (1<<n); i++) {
    vector<int> S;
    int min = -99999; int len = 0;
    for (int j = 0; j < n; j++) {
      if ((1<<j)&i) {
        if (A[j] > min) {
          S.push_back(A[j]);
          min = A[j];
          len ++;
        } else {
          break;
        }
      }
    }
    if (len > max_len) {
      max_len = len; S_max = S;
    }
  }
  cout << max_len << "\n";
}
