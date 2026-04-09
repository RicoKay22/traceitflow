/**
 * Bubble Sort — Step Snapshot Generator
 * Returns an array of snapshots. Each snapshot describes the full array
 * state and which indices are currently being compared/swapped/sorted.
 *
 * Snapshot shape:
 * {
 *   array: number[],
 *   comparing: [number, number] | [],
 *   swapping:  [number, number] | [],
 *   sorted:    number[],          // indices already in final position
 *   description: string,          // human-readable step description
 *   codeLine: number,             // active pseudocode line (0-indexed)
 * }
 */
export function generateBubbleSortSteps(inputArray) {
  const steps = []
  const arr = [...inputArray]
  const n = arr.length
  const sorted = []

  const snap = (comparing = [], swapping = [], description = '', codeLine = 0) => {
    steps.push({
      array: [...arr],
      comparing: [...comparing],
      swapping: [...swapping],
      sorted: [...sorted],
      description,
      codeLine,
    })
  }

  snap([], [], 'Starting Bubble Sort — comparing adjacent elements', 0)

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Highlight the two being compared
      snap([j, j + 1], [], `Comparing index ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]})`, 3)

      if (arr[j] > arr[j + 1]) {
        snap([j, j + 1], [j, j + 1], `Swapping ${arr[j]} and ${arr[j + 1]}`, 4)
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        snap([], [j, j + 1], `Swapped — array updated`, 5)
      }
    }
    // Mark the largest element of this pass as sorted
    sorted.push(n - 1 - i)
    snap([], [], `Pass ${i + 1} complete — element ${arr[n - 1 - i]} is in final position`, 7)
  }

  sorted.push(0)
  snap([], [], 'Bubble Sort complete! Array is sorted.', 8)

  return steps
}

// Pseudocode for display panel (each line corresponds to codeLine index)
export const bubbleSortPseudocode = {
  javascript: [
    'function bubbleSort(arr) {',
    '  for (let i = 0; i < arr.length - 1; i++) {',
    '    for (let j = 0; j < arr.length - i - 1; j++) {',
    '      if (arr[j] > arr[j + 1]) {',
    '        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]  // swap',
    '      }',
    '    }',
    '  }',
    '}',
  ],
  python: [
    'def bubble_sort(arr):',
    '  n = len(arr)',
    '  for i in range(n - 1):',
    '    for j in range(n - i - 1):',
    '      if arr[j] > arr[j + 1]:',
    '        arr[j], arr[j + 1] = arr[j + 1], arr[j]',
    '',
    '  return arr',
    '',
  ],
  c: [
    'void bubbleSort(int arr[], int n) {',
    '  for (int i = 0; i < n-1; i++) {',
    '    for (int j = 0; j < n-i-1; j++) {',
    '      if (arr[j] > arr[j+1]) {',
    '        int temp = arr[j];',
    '        arr[j] = arr[j+1];',
    '        arr[j+1] = temp;',
    '      }',
    '  } }',
  ],
}

export const bubbleSortComplexity = {
  best:    'O(n)',
  average: 'O(n²)',
  worst:   'O(n²)',
  space:   'O(1)',
}
