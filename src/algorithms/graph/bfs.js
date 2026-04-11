/**
 * BFS — Breadth First Search
 * Visualized on an adjacency list graph.
 * We represent the graph as nodes 0..n-1 with edges.
 * Steps show: current node visiting, queue state, visited nodes.
 *
 * For visualization we use a fixed demo graph so it's always consistent.
 * Snapshot shape adds: nodes[], edges[], visited[], queue[], current
 */

// Demo graph — 8 nodes, undirected
export const BFS_DEMO_GRAPH = {
  nodes: [0, 1, 2, 3, 4, 5, 6, 7],
  edges: [
    [0, 1], [0, 2],
    [1, 3], [1, 4],
    [2, 5], [2, 6],
    [3, 7], [4, 7],
    [5, 6],
  ],
  adjacency: {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5, 6],
    3: [1, 7],
    4: [1, 7],
    5: [2, 6],
    6: [2, 5],
    7: [3, 4],
  },
  startNode: 0,
}

export function generateBFSSteps() {
  const graph = BFS_DEMO_GRAPH
  const steps = []
  const visited = new Set()
  const queue = []

  const snap = (current, visitedArr, queueArr, description, codeLine) => {
    steps.push({
      // Keep array field for BarCanvas compatibility (empty for graph)
      array: [],
      comparing: [],
      swapping: [],
      sorted: [],
      // Graph-specific fields
      graphNodes: [...graph.nodes],
      graphEdges: [...graph.edges],
      visitedNodes: [...visitedArr],
      queueNodes: [...queueArr],
      currentNode: current,
      description,
      codeLine,
      isGraph: true,
    })
  }

  snap(-1, [], [], 'Starting BFS from node 0 — initializing queue', 0)

  visited.add(graph.startNode)
  queue.push(graph.startNode)
  snap(graph.startNode, [...visited], [...queue], `Visit node 0, add to queue: [${queue.join(', ')}]`, 1)

  while (queue.length > 0) {
    const current = queue.shift()
    snap(current, [...visited], [...queue], `Dequeue node ${current} — exploring its neighbors`, 3)

    for (const neighbor of graph.adjacency[current]) {
      if (!visited.has(neighbor)) {
        snap(current, [...visited], [...queue], `Check neighbor ${neighbor} — not visited yet`, 4)
        visited.add(neighbor)
        queue.push(neighbor)
        snap(current, [...visited], [...queue], `Mark ${neighbor} visited, enqueue: [${queue.join(', ')}]`, 5)
      } else {
        snap(current, [...visited], [...queue], `Neighbor ${neighbor} already visited — skip`, 6)
      }
    }
  }

  snap(-1, [...visited], [], 'BFS complete! All reachable nodes visited.', 8)
  return steps
}

export const bfsPseudocode = {
  javascript: [
    'function bfs(graph, start) {',
    '  const visited = new Set([start])',
    '  const queue = [start]',
    '  while (queue.length > 0) {',
    '    const node = queue.shift()',
    '    for (const neighbor of graph[node]) {',
    '      if (!visited.has(neighbor)) {',
    '        visited.add(neighbor)',
    '        queue.push(neighbor)',
    '      }',
    '    }',
    '  }',
    '}',
  ],
  python: [
    'from collections import deque',
    'def bfs(graph, start):',
    '  visited = {start}',
    '  queue = deque([start])',
    '  while queue:',
    '    node = queue.popleft()',
    '    for neighbor in graph[node]:',
    '      if neighbor not in visited:',
    '        visited.add(neighbor)',
    '        queue.append(neighbor)',
  ],
  c: [
    'void bfs(int graph[][MAX], int start, int n) {',
    '  bool visited[MAX] = {false};',
    '  int queue[MAX], front=0, rear=0;',
    '  visited[start] = true;',
    '  queue[rear++] = start;',
    '  while (front < rear) {',
    '    int node = queue[front++];',
    '    for (int i = 0; i < n; i++)',
    '      if (graph[node][i] && !visited[i]) {',
    '        visited[i]=true; queue[rear++]=i; } }',
  ],
}

export const bfsComplexity = {
  best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)',
}
