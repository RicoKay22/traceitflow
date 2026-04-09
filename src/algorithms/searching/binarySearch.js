/**
 * Binary Search — requires a SORTED array.
 * We sort the array first, then search for a target.
 * Target is auto-selected as a random element for demo purposes.
 */
export function generateBinarySearchSteps(inputArray) {
  const steps = []
  const arr = [...inputArray].sort((a, b) => a - b) // binary search needs sorted array
  const target = arr[Math.floor(arr.length * 0.6)] // pick an element that exists
  const n = arr.length

  const snap = (left, right, mid, found, description, codeLine) => {
    steps.push({
      array: [...arr],
      comparing: mid >= 0 ? [mid] : [],
      swapping: [],
      sorted: arr.map((_, i) => i), // all sorted since we pre-sorted
      searching: left >= 0 ? Array.from({ length: right - left + 1 }, (_, i) => left + i) : [],
      found: found >= 0 ? found : undefined,
      target,
      description,
      codeLine,
    })
  }

  snap(-1, -1, -1, -1, `Array is sorted. Searching for target: ${target}`, 0)

  let left = 0, right = n - 1, foundAt = -1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    snap(left, right, mid, -1,
      `Search range [${left}..${right}], checking middle index ${mid} → value ${arr[mid]}`, 2)

    if (arr[mid] === target) {
      foundAt = mid
      snap(left, right, mid, mid, `Found ${target} at index ${mid}!`, 4)
      break
    } else if (arr[mid] < target) {
      snap(left, right, mid, -1, `${arr[mid]} < ${target}, search right half`, 5)
      left = mid + 1
    } else {
      snap(left, right, mid, -1, `${arr[mid]} > ${target}, search left half`, 6)
      right = mid - 1
    }
  }

  if (foundAt === -1) {
    snap(-1, -1, -1, -1, `${target} not found in array`, 7)
  }

  return steps
}

export const binarySearchPseudocode = {
  javascript: [
    'function binarySearch(arr, target) {',
    '  let left = 0, right = arr.length - 1',
    '  while (left <= right) {',
    '    let mid = Math.floor((left + right) / 2)',
    '    if (arr[mid] === target) return mid',
    '    if (arr[mid] < target) left = mid + 1',
    '    else right = mid - 1',
    '  }',
    '  return -1',
    '}',
  ],
  python: [
    'def binary_search(arr, target):',
    '  left, right = 0, len(arr) - 1',
    '  while left <= right:',
    '    mid = (left + right) // 2',
    '    if arr[mid] == target: return mid',
    '    elif arr[mid] < target: left = mid + 1',
    '    else: right = mid - 1',
    '  return -1',
    '',
  ],
  c: [
    'int binarySearch(int arr[], int n, int target) {',
    '  int left = 0, right = n - 1;',
    '  while (left <= right) {',
    '    int mid = left + (right - left) / 2;',
    '    if (arr[mid] == target) return mid;',
    '    if (arr[mid] < target) left = mid + 1;',
    '    else right = mid - 1;',
    '  }',
    '  return -1;',
    '}',
  ],
}

export const binarySearchComplexity = {
  best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)',
}
