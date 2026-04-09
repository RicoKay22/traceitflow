import { generateBubbleSortSteps, bubbleSortPseudocode, bubbleSortComplexity } from './sorting/bubbleSort'
// Import others as you build them:
// import { generateMergeSortSteps, mergeSortPseudocode, mergeSortComplexity } from './sorting/mergeSort'
// import { generateQuickSortSteps, quickSortPseudocode, quickSortComplexity } from './sorting/quickSort'
// import { generateBinarySearchSteps, binarySearchPseudocode, binarySearchComplexity } from './searching/binarySearch'
// import { generateLinearSearchSteps, linearSearchPseudocode, linearSearchComplexity } from './searching/linearSearch'

/**
 * Central algorithm registry.
 * Add entries here as you implement each algorithm.
 *
 * Shape:
 * {
 *   id: string,
 *   name: string,
 *   category: 'sorting' | 'searching' | 'graph',
 *   description: string,
 *   generateSteps: (array: number[]) => Snapshot[],
 *   pseudocode: { javascript: string[], python: string[], c: string[] },
 *   complexity: { best: string, average: string, worst: string, space: string },
 *   accentColor: string,  // unique color for this algorithm's bars
 * }
 */
export const ALGORITHMS = [
  {
    id: 'bubbleSort',
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Simple but inefficient for large datasets.',
    generateSteps: generateBubbleSortSteps,
    pseudocode: bubbleSortPseudocode,
    complexity: bubbleSortComplexity,
    accentColor: '#AAFF00',
  },
  // {
  //   id: 'mergeSort',
  //   name: 'Merge Sort',
  //   category: 'sorting',
  //   description: 'Divides the array in half, recursively sorts each half, then merges them back together.',
  //   generateSteps: generateMergeSortSteps,
  //   pseudocode: mergeSortPseudocode,
  //   complexity: mergeSortComplexity,
  //   accentColor: '#FF6B6B',
  // },
  // {
  //   id: 'quickSort',
  //   name: 'Quick Sort',
  //   category: 'sorting',
  //   description: 'Picks a pivot, partitions the array around it, then recursively sorts each partition.',
  //   generateSteps: generateQuickSortSteps,
  //   pseudocode: quickSortPseudocode,
  //   complexity: quickSortComplexity,
  //   accentColor: '#00FFD1',
  // },
  // {
  //   id: 'binarySearch',
  //   name: 'Binary Search',
  //   category: 'searching',
  //   description: 'Efficiently finds a target in a sorted array by repeatedly halving the search range.',
  //   generateSteps: generateBinarySearchSteps,
  //   pseudocode: binarySearchPseudocode,
  //   complexity: binarySearchComplexity,
  //   accentColor: '#A78BFA',
  // },
  // {
  //   id: 'linearSearch',
  //   name: 'Linear Search',
  //   category: 'searching',
  //   description: 'Scans every element from left to right until the target is found.',
  //   generateSteps: generateLinearSearchSteps,
  //   pseudocode: linearSearchPseudocode,
  //   complexity: linearSearchComplexity,
  //   accentColor: '#FB923C',
  // },
]

export const ALGORITHM_CATEGORIES = ['sorting', 'searching', 'graph']

export function getAlgorithmById(id) {
  return ALGORITHMS.find(a => a.id === id) ?? null
}

export function getAlgorithmsByCategory(category) {
  return ALGORITHMS.filter(a => a.category === category)
}
