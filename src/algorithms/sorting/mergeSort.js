export function generateMergeSortSteps(inputArray) {
  const steps = []
  const arr = [...inputArray]

  const snap = (array, comparing = [], swapping = [], sorted = [], description = '', codeLine = 0) => {
    steps.push({ array: [...array], comparing, swapping, sorted, description, codeLine })
  }

  snap(arr, [], [], [], 'Starting Merge Sort — dividing array recursively', 0)

  const sortedIndices = []

  function merge(array, left, mid, right) {
    const leftArr = array.slice(left, mid + 1)
    const rightArr = array.slice(mid + 1, right + 1)
    let i = 0, j = 0, k = left

    snap(array, [left + i, mid + 1 + j], [], [...sortedIndices],
      `Merging subarrays [${left}..${mid}] and [${mid+1}..${right}]`, 4)

    while (i < leftArr.length && j < rightArr.length) {
      snap(array, [left + i, mid + 1 + j], [], [...sortedIndices],
        `Comparing ${leftArr[i]} and ${rightArr[j]}`, 5)

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i]
        i++
      } else {
        array[k] = rightArr[j]
        j++
      }
      snap(array, [], [k], [...sortedIndices], `Placed ${array[k]} at index ${k}`, 6)
      k++
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i]
      snap(array, [], [k], [...sortedIndices], `Copying remaining left element ${array[k]}`, 7)
      i++; k++
    }
    while (j < rightArr.length) {
      array[k] = rightArr[j]
      snap(array, [], [k], [...sortedIndices], `Copying remaining right element ${array[k]}`, 7)
      j++; k++
    }

    for (let x = left; x <= right; x++) sortedIndices.push(x)
  }

  function mergeSort(array, left, right) {
    if (left >= right) return
    const mid = Math.floor((left + right) / 2)
    snap(array, [left, right], [], [...sortedIndices],
      `Dividing: left=${left}, mid=${mid}, right=${right}`, 1)
    mergeSort(array, left, mid)
    mergeSort(array, mid + 1, right)
    merge(array, left, mid, right)
  }

  mergeSort(arr, 0, arr.length - 1)
  snap(arr, [], [], arr.map((_, i) => i), 'Merge Sort complete!', 8)
  return steps
}

export const mergeSortPseudocode = {
  javascript: [
    'function mergeSort(arr, left, right) {',
    '  if (left >= right) return',
    '  const mid = Math.floor((left + right) / 2)',
    '  mergeSort(arr, left, mid)',
    '  mergeSort(arr, mid + 1, right)',
    '  merge(arr, left, mid, right)',
    '}',
    'function merge(arr, l, m, r) {',
    '  // copy, compare, place',
    '}',
  ],
  python: [
    'def merge_sort(arr):',
    '  if len(arr) <= 1: return arr',
    '  mid = len(arr) // 2',
    '  left = merge_sort(arr[:mid])',
    '  right = merge_sort(arr[mid:])',
    '  return merge(left, right)',
    '',
    'def merge(left, right):',
    '  result = []',
    '  # compare and combine',
  ],
  c: [
    'void mergeSort(int arr[], int l, int r) {',
    '  if (l < r) {',
    '    int m = l + (r - l) / 2;',
    '    mergeSort(arr, l, m);',
    '    mergeSort(arr, m+1, r);',
    '    merge(arr, l, m, r);',
    '  }',
    '}',
    '',
  ],
}

export const mergeSortComplexity = {
  best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)',
}
