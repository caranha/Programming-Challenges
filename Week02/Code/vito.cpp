#include<iostream>
#include<algorithm>

using namespace std;

int main() 
{
    int n;
    int add[100];
    
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> add[i];
    }
    sort(add, add+n);
    
    cout << add[n/2] << endl;    
}
