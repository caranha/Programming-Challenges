// Find the SSSP for a graph from vertice 0 to vertice n-1
// Input:
// Graph #vertice, #edges
// edge list: v_s, v_e, w

#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int main() {

  typedef pair<int, int> edge;
  typedef vector<edge> neighb;

  int V; int E;
  cin >> V >> E;

  vector<neighb> AdjList(V, neighb());

  for (int i = 0; i < E; i++)
  {
    int s, e, w;
    cin >> s >> e >> w;
    AdjList[s].emplace_back(e, w);
  }

  vector <int> p(V, -1);        // parent list
  vector <int> dist(V, V*100);  // distance list
  dist[0] = 0;
  queue  <int> q; q.push(0);

  while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int j = 0; j < AdjList[u].size(); j++) {
      int v = AdjList[u][j].first;
      if (dist[v] > V) {
        dist[v] = dist[u] + 1;
        p[v] = u; q.push(v);
      }
    }
  }

  int u = V-1;
  while (p[u] != -1) {
    cout << u << " ";
    u = p[u];
  }
  cout << endl;
}
