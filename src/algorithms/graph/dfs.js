/**
 * DFS — Depth First Search
 * Same demo graph as BFS for easy comparison in Comparison Mode.
 */
import { BFS_DEMO_GRAPH } from './bfs'

export function generateDFSSteps() {
  const graph = BFS_DEMO_GRAPH
  const steps = []
  const visited = new Set()
  const stack = []

  const snap = (current, visitedArr, stackArr, description, codeLine) => {
    steps.push({
      array: [],
      comparing: [],
      swapping: [],
      sorted: [],
      graphNodes: [...graph.nodes],
      graphEdges: [...graph.edges],
      visitedNodes: [...visitedArr],
      queueNodes: [...stackArr], // reuse queueNodes field for stack display
      currentNode: current,
      description,
      codeLine,
      isGraph: true,
    })
  }

  snap(-1, [], [], 'Starting DFS from node 0 — using a stack', 0)

  stack.push(graph.startNode)
  snap(-1, [], [...stack], `Push node 0 onto stack: [${stack.join(', ')}]`, 1)

  while (stack.length > 0) {
    const current = stack.pop()

    if (!visited.has(current)) {
      visited.add(current)
      snap(current, [...visited], [...stack], `Pop node ${current} — mark visited`, 3)

      // Push neighbors in reverse so left-to-right traversal order
      const neighbors = [...graph.adjacency[current]].reverse()
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor)
          snap(current, [...visited], [...stack], `Push neighbor ${neighbor} onto stack: [${stack.join(', ')}]`, 5)
        } else {
          snap(current, [...visited], [...stack], `Neighbor ${neighbor} already visited — skip`, 6)
        }
      }
    } else {
      snap(current, [...visited], [...stack], `Node ${current} already visited — skip`, 4)
    }
  }

  snap(-1, [...visited], [], 'DFS complete! All reachable nodes visited.', 8)
  return steps
}

export const dfsPseudocode = {
  javascript: [
    'function dfs(graph, start) {',
    '  const stack = [start]',
    '  const visited = new Set()',
    '  while (stack.length > 0) {',
    '    const node = stack.pop()',
    '    if (!visited.has(node)) {',
    '      visited.add(node)',
    '      for (const neighbor of graph[node]) {',
    '        if (!visited.has(neighbor))',
    '          stack.push(neighbor)',
    '      }',
    '    }',
    '  }',
  ],
  python: [
    'def dfs(graph, start):',
    '  stack = [start]',
    '  visited = set()',
    '  while stack:',
    '    node = stack.pop()',
    '    if node not in visited:',
    '      visited.add(node)',
    '      for neighbor in graph[node]:',
    '        if neighbor not in visited:',
    '          stack.append(neighbor)',
    '',
  ],
  c: [
    'void dfs(int graph[][MAX], int start, int n) {',
    '  bool visited[MAX] = {false};',
    '  int stack[MAX], top = -1;',
    '  stack[++top] = start;',
    '  while (top >= 0) {',
    '    int node = stack[top--];',
    '    if (!visited[node]) {',
    '      visited[node] = true;',
    '      for (int i = n-1; i >= 0; i--)',
    '        if (graph[node][i] && !visited[i])',
    '          stack[++top] = i; } }',
  ],
}

export const dfsComplexity = {
  best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)',
}
