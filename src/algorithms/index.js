import { generateBubbleSortSteps, bubbleSortPseudocode, bubbleSortComplexity } from './sorting/bubbleSort'
import { generateMergeSortSteps, mergeSortPseudocode, mergeSortComplexity } from './sorting/mergeSort'
import { generateQuickSortSteps, quickSortPseudocode, quickSortComplexity } from './sorting/quickSort'
import { generateBinarySearchSteps, binarySearchPseudocode, binarySearchComplexity } from './searching/binarySearch'
import { generateLinearSearchSteps, linearSearchPseudocode, linearSearchComplexity } from './searching/linearSearch'

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
  {
    id: 'mergeSort',
    name: 'Merge Sort',
    category: 'sorting',
    description: 'Divides the array in half, recursively sorts each half, then merges them back in order. Guaranteed O(n log n) performance — reliable and predictable.',
    generateSteps: generateMergeSortSteps,
    pseudocode: mergeSortPseudocode,
    complexity: mergeSortComplexity,
    accentColor: '#FF6B6B',
  },
  {
    id: 'quickSort',
    name: 'Quick Sort',
    category: 'sorting',
    description: 'Picks a pivot element, partitions the array around it so smaller go left and larger go right, then recursively sorts each partition.',
    generateSteps: generateQuickSortSteps,
    pseudocode: quickSortPseudocode,
    complexity: quickSortComplexity,
    accentColor: '#00FFD1',
  },
  {
    id: 'binarySearch',
    name: 'Binary Search',
    category: 'searching',
    description: 'Efficiently finds a target in a sorted array by repeatedly halving the search range. Far faster than linear search — cuts work in half each step.',
    generateSteps: generateBinarySearchSteps,
    pseudocode: binarySearchPseudocode,
    complexity: binarySearchComplexity,
    accentColor: '#A78BFA',
  },
  {
    id: 'linearSearch',
    name: 'Linear Search',
    category: 'searching',
    description: 'Scans every element from left to right until the target is found. Simple, works on unsorted data, but slow on large arrays.',
    generateSteps: generateLinearSearchSteps,
    pseudocode: linearSearchPseudocode,
    complexity: linearSearchComplexity,
    accentColor: '#FB923C',
  },
]

export const ALGORITHM_CATEGORIES = ['sorting', 'searching', 'graph']

export function getAlgorithmById(id) {
  return ALGORITHMS.find(a => a.id === id) ?? null
}

export function getAlgorithmsByCategory(category) {
  return ALGORITHMS.filter(a => a.category === category)
}
