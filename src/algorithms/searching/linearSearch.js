export function generateLinearSearchSteps(inputArray) {
  const steps = []
  const arr = [...inputArray]
  const target = arr[Math.floor(arr.length * 0.65)] // pick existing element

  const snap = (current, found, description, codeLine) => {
    steps.push({
      array: [...arr],
      comparing: current >= 0 && found < 0 ? [current] : [],
      swapping: [],
      sorted: [],
      searching: current >= 0 ? Array.from({ length: current + 1 }, (_, i) => i) : [],
      found: found >= 0 ? found : undefined,
      target,
      description,
      codeLine,
    })
  }

  snap(-1, -1, `Searching for ${target} — checking each element from left`, 0)

  for (let i = 0; i < arr.length; i++) {
    snap(i, -1, `Checking index ${i}: is ${arr[i]} === ${target}?`, 2)

    if (arr[i] === target) {
      snap(i, i, `Found ${target} at index ${i}!`, 3)
      return steps
    }
    snap(i, -1, `${arr[i]} ≠ ${target}, move to next`, 4)
  }

  snap(-1, -1, `${target} not found after checking all ${arr.length} elements`, 5)
  return steps
}

export const linearSearchPseudocode = {
  javascript: [
    'function linearSearch(arr, target) {',
    '  for (let i = 0; i < arr.length; i++) {',
    '    if (arr[i] === target) {',
    '      return i  // found!',
    '    }',
    '  }',
    '  return -1  // not found',
    '}',
    '',
  ],
  python: [
    'def linear_search(arr, target):',
    '  for i in range(len(arr)):',
    '    if arr[i] == target:',
    '      return i',
    '  return -1',
    '',
    '',
    '',
    '',
  ],
  c: [
    'int linearSearch(int arr[], int n, int target) {',
    '  for (int i = 0; i < n; i++) {',
    '    if (arr[i] == target) {',
    '      return i;',
    '    }',
    '  }',
    '  return -1;',
    '}',
    '',
  ],
}

export const linearSearchComplexity = {
  best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)',
}
