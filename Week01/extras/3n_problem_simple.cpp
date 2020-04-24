#include <iostream>
using namespace std;

int main()
{
  int min = 1;
  int max = 10;
  int maxcycle = 0;

  for (int i = min; i <= max; i++)
  {
    int cycle = 1;
    int n = i;
    while (n != 1) {
      if (n % 2 == 0) { n = n / 2; }
      else { n = n*3 + 1; }
      cycle++;
    }
    if (cycle > maxcycle) maxcycle = cycle;
  }

    cout << min << " " << max << " " << maxcycle << "\n";
    return 0;
}
