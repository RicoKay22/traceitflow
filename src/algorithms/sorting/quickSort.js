export function generateQuickSortSteps(inputArray) {
  const steps = []
  const arr = [...inputArray]
  const sortedIndices = []

  const snap = (array, comparing = [], swapping = [], sorted = [], pivot = -1, description = '', codeLine = 0) => {
    steps.push({ array: [...array], comparing, swapping, sorted: [...sorted], pivot, description, codeLine })
  }

  snap(arr, [], [], [], -1, 'Starting Quick Sort — choosing pivots to partition', 0)

  function partition(array, low, high) {
    const pivotVal = array[high]
    snap(array, [], [], [...sortedIndices], high, `Pivot selected: ${pivotVal} at index ${high}`, 2)
    let i = low - 1

    for (let j = low; j < high; j++) {
      snap(array, [j, high], [], [...sortedIndices], high, `Comparing ${array[j]} with pivot ${pivotVal}`, 4)
      if (array[j] <= pivotVal) {
        i++
        snap(array, [], [i, j], [...sortedIndices], high, `${array[j]} ≤ pivot, swapping index ${i} and ${j}`, 5)
        ;[array[i], array[j]] = [array[j], array[i]]
        snap(array, [], [i, j], [...sortedIndices], high, `Swapped — ${array[i]} and ${array[j]}`, 6)
      }
    }
    ;[array[i + 1], array[high]] = [array[high], array[i + 1]]
    snap(array, [], [i + 1, high], [...sortedIndices], -1, `Pivot ${pivotVal} placed at final position ${i+1}`, 7)
    sortedIndices.push(i + 1)
    return i + 1
  }

  function quickSort(array, low, high) {
    if (low < high) {
      snap(array, [low, high], [], [...sortedIndices], -1, `Sorting subarray [${low}..${high}]`, 1)
      const pi = partition(array, low, high)
      quickSort(array, low, pi - 1)
      quickSort(array, pi + 1, high)
    } else if (low === high) {
      sortedIndices.push(low)
    }
  }

  quickSort(arr, 0, arr.length - 1)
  snap(arr, [], [], arr.map((_, i) => i), -1, 'Quick Sort complete!', 8)
  return steps
}

export const quickSortPseudocode = {
  javascript: [
    'function quickSort(arr, low, high) {',
    '  if (low < high) {',
    '    let pi = partition(arr, low, high)',
    '    quickSort(arr, low, pi - 1)',
    '    quickSort(arr, pi + 1, high)',
    '  }',
    '}',
    'function partition(arr, low, high) {',
    '  let pivot = arr[high], i = low - 1',
    '  // swap smaller elements before pivot',
    '}',
  ],
  python: [
    'def quick_sort(arr, low, high):',
    '  if low < high:',
    '    pi = partition(arr, low, high)',
    '    quick_sort(arr, low, pi - 1)',
    '    quick_sort(arr, pi + 1, high)',
    '',
    'def partition(arr, low, high):',
    '  pivot = arr[high]',
    '  i = low - 1',
    '  # compare and swap',
  ],
  c: [
    'void quickSort(int arr[], int low, int high) {',
    '  if (low < high) {',
    '    int pi = partition(arr, low, high);',
    '    quickSort(arr, low, pi - 1);',
    '    quickSort(arr, pi + 1, high);',
    '  }',
    '}',
    'int partition(int arr[], int low, int high) {',
    '  int pivot = arr[high];',
    '  // swap logic here',
  ],
}

export const quickSortComplexity = {
  best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)',
}
