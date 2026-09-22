import { CodeExample } from "@/types";

type Snippet = { title: string; js: string; py: string; cpp: string; java: string };

const snippets: Record<string, Snippet> = {
  "access-by-index": {
    title: "Reads an array element by index in constant time.",
    js: `function accessByIndex(array, index) {\n  if (index < 0 || index >= array.length) {\n    throw new Error("Index out of bounds");\n  }\n  const value = array[index];\n  return value;\n}`,
    py: `def access_by_index(array, index):\n    if index < 0 or index >= len(array):\n        raise IndexError("Index out of bounds")\n    value = array[index]\n    return value`,
    cpp: `int accessByIndex(const vector<int>& array, int index) {\n    if (index < 0 || index >= static_cast<int>(array.size())) {\n        throw out_of_range("Index out of bounds");\n    }\n    int value = array[index];\n    return value;\n}`,
    java: `int accessByIndex(int[] array, int index) {\n    if (index < 0 || index >= array.length) {\n        throw new IndexOutOfBoundsException("Index out of bounds");\n    }\n    int value = array[index];\n    return value;\n}`,
  },
  "random-access": {
    title: "Uses direct indexing to access any position.",
    js: `function accessByIndex(array, index) {\n  if (index < 0 || index >= array.length) {\n    throw new Error("Index out of bounds");\n  }\n  const value = array[index];\n  return value;\n}`,
    py: `def access_by_index(array, index):\n    if index < 0 or index >= len(array):\n        raise IndexError("Index out of bounds")\n    value = array[index]\n    return value`,
    cpp: `int accessByIndex(const vector<int>& array, int index) {\n    if (index < 0 || index >= static_cast<int>(array.size())) {\n        throw out_of_range("Index out of bounds");\n    }\n    int value = array[index];\n    return value;\n}`,
    java: `int accessByIndex(int[] array, int index) {\n    if (index < 0 || index >= array.length) {\n        throw new IndexOutOfBoundsException("Index out of bounds");\n    }\n    int value = array[index];\n    return value;\n}`,
  },
  "forward-traversal": {
    title: "Visits every array element from left to right.",
    js: `function forwardTraversal(array) {\n  for (let i = 0; i < array.length; i++) {\n    console.log(array[i]);\n  }\n}`,
    py: `def forward_traversal(array):\n    for value in array:\n        print(value)`,
    cpp: `void forwardTraversal(const vector<int>& array) {\n    for (int i = 0; i < static_cast<int>(array.size()); i++) {\n        cout << array[i] << " ";\n    }\n}`,
    java: `void forwardTraversal(int[] array) {\n    for (int i = 0; i < array.length; i++) {\n        System.out.print(array[i] + " ");\n    }\n}`,
  },
  "reverse-traversal": {
    title: "Visits every array element from right to left.",
    js: `function reverseTraversal(array) {\n  for (let i = array.length - 1; i >= 0; i--) {\n    console.log(array[i]);\n  }\n}`,
    py: `def reverse_traversal(array):\n    for i in range(len(array) - 1, -1, -1):\n        print(array[i])`,
    cpp: `void reverseTraversal(const vector<int>& array) {\n    for (int i = static_cast<int>(array.size()) - 1; i >= 0; i--) {\n        cout << array[i] << " ";\n    }\n}`,
    java: `void reverseTraversal(int[] array) {\n    for (int i = array.length - 1; i >= 0; i--) {\n        System.out.print(array[i] + " ");\n    }\n}`,
  },
  "range-traversal": {
    title: "Visits a selected inclusive range of indexes.",
    js: `function rangeTraversal(array, start, end) {\n  for (let i = start; i <= end; i++) {\n    console.log(array[i]);\n  }\n}`,
    py: `def range_traversal(array, start, end):\n    for i in range(start, end + 1):\n        print(array[i])`,
    cpp: `void rangeTraversal(const vector<int>& array, int start, int end) {\n    for (int i = start; i <= end; i++) {\n        cout << array[i] << " ";\n    }\n}`,
    java: `void rangeTraversal(int[] array, int start, int end) {\n    for (int i = start; i <= end; i++) {\n        System.out.print(array[i] + " ");\n    }\n}`,
  },
  "insert-beginning": {
    title: "Shifts all elements right and inserts a new value at index 0.",
    js: `function insertBeginning(array, value) {\n  for (let i = array.length - 1; i >= 0; i--) {\n    array[i + 1] = array[i];\n  }\n  array[0] = value;\n  return array;\n}`,
    py: `def insert_beginning(array, value):\n    array.append(None)\n    for i in range(len(array) - 2, -1, -1):\n        array[i + 1] = array[i]\n    array[0] = value\n    return array`,
    cpp: `void insertBeginning(vector<int>& array, int value) {\n    array.push_back(0);\n    for (int i = static_cast<int>(array.size()) - 2; i >= 0; i--) {\n        array[i + 1] = array[i];\n    }\n    array[0] = value;\n}`,
    java: `int[] insertBeginning(int[] array, int value) {\n    int[] newArr = new int[array.length + 1];\n    for (int i = 0; i < array.length; i++) {\n        newArr[i + 1] = array[i];\n    }\n    newArr[0] = value;\n    return newArr;\n}`,
  },
  "insert-end": {
    title: "Appends a new value directly to the end of the array.",
    js: `function insertEnd(array, value) {\n  array.push(value);\n  return array;\n}`,
    py: `def insert_end(array, value):\n    array.append(value)\n    return array`,
    cpp: `void insertEnd(vector<int>& array, int value) {\n    array.push_back(value);\n}`,
    java: `int[] insertEnd(int[] array, int value) {\n    int[] newArr = Arrays.copyOf(array, array.length + 1);\n    newArr[array.length] = value;\n    return newArr;\n}`,
  },
  "insert-index": {
    title: "Shifts elements right from index and inserts a new value.",
    js: `function insertAtIndex(array, index, value) {\n  for (let i = array.length - 1; i >= index; i--) {\n    array[i + 1] = array[i];\n  }\n  array[index] = value;\n  return array;\n}`,
    py: `def insert_at_index(array, index, value):\n    array.append(None)\n    for i in range(len(array) - 2, index - 1, -1):\n        array[i + 1] = array[i]\n    array[index] = value\n    return array`,
    cpp: `void insertAtIndex(vector<int>& array, int index, int value) {\n    array.push_back(0);\n    for (int i = static_cast<int>(array.size()) - 2; i >= index; i--) {\n        array[i + 1] = array[i];\n    }\n    array[index] = value;\n}`,
    java: `int[] insertAtIndex(int[] array, int index, int value) {\n    int[] newArr = new int[array.length + 1];\n    for (int i = 0; i < index; i++) newArr[i] = array[i];\n    newArr[index] = value;\n    for (int i = index; i < array.length; i++) newArr[i + 1] = array[i];\n    return newArr;\n}`,
  },
  "delete-beginning": {
    title: "Removes the first element and shifts all remaining elements left.",
    js: `function deleteBeginning(array) {\n  if (array.length === 0) return null;\n  const removed = array[0];\n  for (let i = 0; i < array.length - 1; i++) {\n    array[i] = array[i + 1];\n  }\n  array.pop();\n  return removed;\n}`,
    py: `def delete_beginning(array):\n    if not array:\n        return None\n    removed = array[0]\n    for i in range(len(array) - 1):\n        array[i] = array[i + 1]\n    array.pop()\n    return removed`,
    cpp: `int deleteBeginning(vector<int>& array) {\n    if (array.empty()) return -1;\n    int removed = array[0];\n    for (int i = 0; i < static_cast<int>(array.size()) - 1; i++) {\n        array[i] = array[i + 1];\n    }\n    array.pop_back();\n    return removed;\n}`,
    java: `int deleteBeginning(int[] array) {\n    if (array.length == 0) return -1;\n    int removed = array[0];\n    for (int i = 0; i < array.length - 1; i++) {\n        array[i] = array[i + 1];\n    }\n    return removed;\n}`,
  },
  "delete-end": {
    title: "Removes the last element from the array.",
    js: `function deleteEnd(array) {\n  if (array.length === 0) return null;\n  const removed = array[array.length - 1];\n  array.pop();\n  return removed;\n}`,
    py: `def delete_end(array):\n    if not array:\n        return None\n    removed = array[-1]\n    array.pop()\n    return removed`,
    cpp: `int deleteEnd(vector<int>& array) {\n    if (array.empty()) return -1;\n    int removed = array.back();\n    array.pop_back();\n    return removed;\n}`,
    java: `int deleteEnd(int[] array) {\n    if (array.length == 0) return -1;\n    int removed = array[array.length - 1];\n    return removed;\n}`,
  },
  "delete-index": {
    title: "Removes an element at a given index and shifts remaining elements left.",
    js: `function deleteAtIndex(array, index) {\n  if (index < 0 || index >= array.length) return null;\n  const removed = array[index];\n  for (let i = index; i < array.length - 1; i++) {\n    array[i] = array[i + 1];\n  }\n  array.pop();\n  return removed;\n}`,
    py: `def delete_at_index(array, index):\n    if index < 0 or index >= len(array):\n        return None\n    removed = array[index]\n    for i in range(index, len(array) - 1):\n        array[i] = array[i + 1]\n    array.pop()\n    return removed`,
    cpp: `int deleteAtIndex(vector<int>& array, int index) {\n    if (index < 0 || index >= static_cast<int>(array.size())) return -1;\n    int removed = array[index];\n    for (int i = index; i < static_cast<int>(array.size()) - 1; i++) {\n        array[i] = array[i + 1];\n    }\n    array.pop_back();\n    return removed;\n}`,
    java: `int deleteAtIndex(int[] array, int index) {\n    if (index < 0 || index >= array.length) return -1;\n    int removed = array[index];\n    for (int i = index; i < array.length - 1; i++) {\n        array[i] = array[i + 1];\n    }\n    return removed;\n}`,
  },
  "delete-value": {
    title: "Searches for a value, removes its first occurrence, and shifts elements left.",
    js: `function deleteByValue(array, value) {\n  let foundIndex = -1;\n  for (let i = 0; i < array.length; i++) {\n    if (array[i] === value) {\n      foundIndex = i;\n      break;\n    }\n  }\n  if (foundIndex === -1) return false;\n  for (let i = foundIndex; i < array.length - 1; i++) {\n    array[i] = array[i + 1];\n  }\n  array.pop();\n  return true;\n}`,
    py: `def delete_by_value(array, value):\n    found_idx = -1\n    for i in range(len(array)):\n        if array[i] == value:\n            found_idx = i\n            break\n    if found_idx == -1:\n        return False\n    for i in range(found_idx, len(array) - 1):\n        array[i] = array[i + 1]\n    array.pop()\n    return True`,
    cpp: `bool deleteByValue(vector<int>& array, int value) {\n    int foundIndex = -1;\n    for (int i = 0; i < static_cast<int>(array.size()); i++) {\n        if (array[i] == value) {\n            foundIndex = i;\n            break;\n        }\n    }\n    if (foundIndex == -1) return false;\n    for (int i = foundIndex; i < static_cast<int>(array.size()) - 1; i++) {\n        array[i] = array[i + 1];\n    }\n    array.pop_back();\n    return true;\n}`,
    java: `boolean deleteByValue(int[] array, int value) {\n    int foundIndex = -1;\n    for (int i = 0; i < array.length; i++) {\n        if (array[i] == value) {\n            foundIndex = i;\n            break;\n        }\n    }\n    if (foundIndex == -1) return false;\n    for (int i = foundIndex; i < array.length - 1; i++) {\n        array[i] = array[i + 1];\n    }\n    return true;\n}`,
  },
  "update-by-index": {
    title: "Updates the element at a specified index after validating bounds.",
    js: `function updateByIndex(array, index, newValue) {\n  if (index < 0 || index >= array.length) {\n    throw new Error("Index out of bounds");\n  }\n  const oldValue = array[index];\n  array[index] = newValue;\n  return oldValue;\n}`,
    py: `def update_by_index(array, index, new_value):\n    if index < 0 or index >= len(array):\n        raise IndexError("Index out of bounds")\n    old_value = array[index]\n    array[index] = new_value\n    return old_value`,
    cpp: `int updateByIndex(vector<int>& array, int index, int newValue) {\n    if (index < 0 || index >= static_cast<int>(array.size())) {\n        throw out_of_range("Index out of bounds");\n    }\n    int oldValue = array[index];\n    array[index] = newValue;\n    return oldValue;\n}`,
    java: `int updateByIndex(int[] array, int index, int newValue) {\n    if (index < 0 || index >= array.length) {\n        throw new IndexOutOfBoundsException("Index out of bounds");\n    }\n    int oldValue = array[index];\n    array[index] = newValue;\n    return oldValue;\n}`,
  },
  "update-by-value": {
    title: "Searches for a target value and updates its first occurrence.",
    js: `function updateByValue(array, target, newValue) {\n  for (let i = 0; i < array.length; i++) {\n    if (array[i] === target) {\n      array[i] = newValue;\n      return true;\n    }\n  }\n  return false;\n}`,
    py: `def update_by_value(array, target, new_value):\n    for i in range(len(array)):\n        if array[i] == target:\n            array[i] = new_value\n            return True\n    return False`,
    cpp: `bool updateByValue(vector<int>& array, int target, int newValue) {\n    for (int i = 0; i < static_cast<int>(array.size()); i++) {\n        if (array[i] == target) {\n            array[i] = newValue;\n            return true;\n        }\n    }\n    return false;\n}`,
    java: `boolean updateByValue(int[] array, int target, int newValue) {\n    for (int i = 0; i < array.length; i++) {\n        if (array[i] == target) {\n            array[i] = newValue;\n            return true;\n        }\n    }\n    return false;\n}`,
  },
  "linear-search": {
    title: "Checks each element until the target is found.",
    js: `function linearSearch(array, target) {\n  for (let i = 0; i < array.length; i++) {\n    if (array[i] === target) return i;\n  }\n  return -1;\n}`,
    py: `def linear_search(array, target):\n    for i, value in enumerate(array):\n        if value == target:\n            return i\n    return -1`,
    cpp: `int linearSearch(int array[], int n, int target) {\n    for (int i = 0; i < n; i++) {\n        if (array[i] == target) return i;\n    }\n    return -1;\n}`,
    java: `int linearSearch(int[] array, int target) {\n    for (int i = 0; i < array.length; i++) {\n        if (array[i] == target) return i;\n    }\n    return -1;\n}`,
  },
  "binary-search": {
    title: "Halves the search interval in a sorted array.",
    js: `function binarySearch(array, target) {\n  let low = 0, high = array.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (array[mid] === target) return mid;\n    if (array[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}`,
    py: `def binary_search(array, target):\n    low, high = 0, len(array) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if array[mid] == target: return mid\n        if array[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1`,
    cpp: `int binarySearch(vector<int>& array, int target) {\n    int low = 0, high = array.size() - 1;\n    while (low <= high) {\n        int mid = (low + high) / 2;\n        if (array[mid] == target) return mid;\n        if (array[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
    java: `int binarySearch(int[] array, int target) {\n    int low = 0, high = array.length - 1;\n    while (low <= high) {\n        int mid = (low + high) / 2;\n        if (array[mid] == target) return mid;\n        if (array[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
  },
  "jump-search": {
    title:
      "Jumps ahead by fixed steps to find a block where the target resides, then linear searches.",
    js: `function jumpSearch(array, target) {\n  let n = array.length;\n  let step = Math.floor(Math.sqrt(n));\n  let prev = 0;\n  while (array[Math.min(step, n) - 1] < target) {\n    prev = step;\n    step += Math.floor(Math.sqrt(n));\n    if (prev >= n) return -1;\n  }\n  while (array[prev] < target) {\n    prev++;\n    if (prev === Math.min(step, n)) return -1;\n  }\n  if (array[prev] === target) return prev;\n  return -1;\n}`,
    py: `import math\ndef jump_search(array, target):\n    n = len(array)\n    step = int(math.sqrt(n))\n    prev = 0\n    while array[min(step, n) - 1] < target:\n        prev = step\n        step += int(math.sqrt(n))\n        if prev >= n: return -1\n    while array[prev] < target:\n        prev += 1\n        if prev == min(step, n): return -1\n    if array[prev] == target: return prev\n    return -1`,
    cpp: `int jumpSearch(vector<int>& array, int target) {\n    int n = array.size();\n    int step = sqrt(n);\n    int prev = 0;\n    while (array[min(step, n) - 1] < target) {\n        prev = step;\n        step += sqrt(n);\n        if (prev >= n) return -1;\n    }\n    while (array[prev] < target) {\n        prev++;\n        if (prev == min(step, n)) return -1;\n    }\n    if (array[prev] == target) return prev;\n    return -1;\n}`,
    java: `int jumpSearch(int[] array, int target) {\n    int n = array.length;\n    int step = (int) Math.sqrt(n);\n    int prev = 0;\n    while (array[Math.min(step, n) - 1] < target) {\n        prev = step;\n        step += (int) Math.sqrt(n);\n        if (prev >= n) return -1;\n    }\n    while (array[prev] < target) {\n        prev++;\n        if (prev == Math.min(step, n)) return -1;\n    }\n    if (array[prev] == target) return prev;\n    return -1;\n}`,
  },
  "interpolation-search": {
    title: "Estimates target position based on values, similar to opening a dictionary.",
    js: `function interpolationSearch(arr, target) {\n  let low = 0, high = arr.length - 1;\n  while (low <= high && target >= arr[low] && target <= arr[high]) {\n    if (arr[low] === arr[high]) return arr[low] === target ? low : -1;\n    const pos = low + Math.floor(((high - low) / (arr[high] - arr[low])) * (target - arr[low]));\n    if (arr[pos] === target) return pos;\n    if (arr[pos] < target) low = pos + 1;\n    else high = pos - 1;\n  }\n  return -1;\n}`,
    py: `def interpolation_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high and target >= arr[low] and target <= arr[high]:\n        if arr[low] == arr[high]: return low if arr[low] == target else -1\n        pos = low + int(((high - low) / (arr[high] - arr[low])) * (target - arr[low]))\n        if arr[pos] == target: return pos\n        if arr[pos] < target: low = pos + 1\n        else: high = pos - 1\n    return -1`,
    cpp: `int interpolationSearch(vector<int>& arr, int target) {\n    int low = 0, high = arr.size() - 1;\n    while (low <= high && target >= arr[low] && target <= arr[high]) {\n        if (arr[low] == arr[high]) return arr[low] == target ? low : -1;\n        int pos = low + (((double)(high - low) / (arr[high] - arr[low])) * (target - arr[low]));\n        if (arr[pos] == target) return pos;\n        if (arr[pos] < target) low = pos + 1;\n        else high = pos - 1;\n    }\n    return -1;\n}`,
    java: `int interpolationSearch(int[] arr, int target) {\n    int low = 0, high = arr.length - 1;\n    while (low <= high && target >= arr[low] && target <= arr[high]) {\n        if (arr[low] == arr[high]) return arr[low] == target ? low : -1;\n        int pos = low + (int) (((double) (high - low) / (arr[high] - arr[low])) * (target - arr[low]));\n        if (arr[pos] == target) return pos;\n        if (arr[pos] < target) low = pos + 1;\n        else high = pos - 1;\n    }\n    return -1;\n}`,
  },
  "bubble-sort": {
    title:
      "Repeatedly steps through the list, swaps adjacent elements if they are in the wrong order.",
    js: `function bubbleSort(arr) {\n  let n = arr.length, swapped;\n  for (let i = 0; i < n - 1; i++) {\n    swapped = false;\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n        swapped = true;\n      }\n    }\n    if (!swapped) break;\n  }\n  return arr;\n}`,
    py: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n - 1):\n        swapped = False\n        for j in range(n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped: break\n    return arr`,
    cpp: `void bubbleSort(vector<int>& arr) {\n    int n = arr.size();\n    bool swapped;\n    for (int i = 0; i < n - 1; i++) {\n        swapped = false;\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                swap(arr[j], arr[j + 1]);\n                swapped = true;\n            }\n        }\n        if (!swapped) break;\n    }\n}`,
    java: `void bubbleSort(int[] arr) {\n    int n = arr.length;\n    boolean swapped;\n    for (int i = 0; i < n - 1; i++) {\n        swapped = false;\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n                swapped = true;\n            }\n        }\n        if (!swapped) break;\n    }\n}`,
  },
  "selection-sort": {
    title: "Finds the minimum element from the unsorted region and puts it at the beginning.",
    js: `function selectionSort(arr) {\n  for (let i = 0; i < arr.length - 1; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[j] < arr[minIdx]) minIdx = j;\n    }\n    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n  }\n  return arr;\n}`,
    py: `def selection_sort(arr):\n    for i in range(len(arr) - 1):\n        min_idx = i\n        for j in range(i + 1, len(arr)):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        if min_idx != i:\n            arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr`,
    cpp: `void selectionSort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIdx]) minIdx = j;\n        }\n        if (minIdx != i) swap(arr[i], arr[minIdx]);\n    }\n}`,
    java: `void selectionSort(int[] arr) {\n    int n = arr.length;\n    for (int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIdx]) minIdx = j;\n        }\n        if (minIdx != i) {\n            int temp = arr[i];\n            arr[i] = arr[minIdx];\n            arr[minIdx] = temp;\n        }\n    }\n}`,
  },
  "insertion-sort": {
    title:
      "Builds the final sorted array one item at a time by inserting elements into their correct position.",
    js: `function insertionSort(arr) {\n  for (let i = 1; i < arr.length; i++) {\n    let key = arr[i];\n    let j = i - 1;\n    while (j >= 0 && arr[j] > key) {\n      arr[j + 1] = arr[j];\n      j--;\n    }\n    arr[j + 1] = key;\n  }\n  return arr;\n}`,
    py: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr`,
    cpp: `void insertionSort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 1; i < n; i++) {\n        int key = arr[i];\n        int j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = key;\n    }\n}`,
    java: `void insertionSort(int[] arr) {\n    int n = arr.length;\n    for (int i = 1; i < n; i++) {\n        int key = arr[i];\n        int j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = key;\n    }\n}`,
  },
  "merge-sort": {
    title: "Divides the array into halves, recursively sorts them, and merges the sorted halves.",
    js: `function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  const result = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) result.push(left[i++]);\n    else result.push(right[j++]);\n  }\n  return result.concat(left.slice(i)).concat(right.slice(j));\n}`,
    py: `def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    \n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result`,
    cpp: `void mergeSort(vector<int>& arr, int left, int right) {\n    if (left >= right) return;\n    int mid = left + (right - left) / 2;\n    mergeSort(arr, left, mid);\n    mergeSort(arr, mid + 1, right);\n    \n    vector<int> temp(right - left + 1);\n    int i = left, j = mid + 1, k = 0;\n    while (i <= mid && j <= right) {\n        if (arr[i] <= arr[j]) temp[k++] = arr[i++];\n        else temp[k++] = arr[j++];\n    }\n    while (i <= mid) temp[k++] = arr[i++];\n    while (j <= right) temp[k++] = arr[j++];\n    for (int p = 0; p < temp.size(); p++) arr[left + p] = temp[p];\n}`,
    java: `void mergeSort(int[] arr, int left, int right) {\n    if (left >= right) return;\n    int mid = left + (right - left) / 2;\n    mergeSort(arr, left, mid);\n    mergeSort(arr, mid + 1, right);\n    \n    int[] temp = new int[right - left + 1];\n    int i = left, j = mid + 1, k = 0;\n    while (i <= mid && j <= right) {\n        if (arr[i] <= arr[j]) temp[k++] = arr[i++];\n        else temp[k++] = arr[j++];\n    }\n    while (i <= mid) temp[k++] = arr[i++];\n    while (j <= right) temp[k++] = arr[j++];\n    for (int p = 0; p < temp.length; p++) arr[left + p] = temp[p];\n}`,
  },
  "quick-sort": {
    title: "Picks a pivot element and partitions the array around it.",
    js: `function quickSort(arr, low = 0, high = arr.length - 1) {\n  if (low < high) {\n    const pivot = arr[high];\n    let i = low - 1;\n    for (let j = low; j < high; j++) {\n      if (arr[j] < pivot) {\n        i++;\n        [arr[i], arr[j]] = [arr[j], arr[i]];\n      }\n    }\n    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];\n    const pi = i + 1;\n    quickSort(arr, low, pi - 1);\n    quickSort(arr, pi + 1, high);\n  }\n  return arr;\n}`,
    py: `def quick_sort(arr, low, high):\n    if low < high:\n        pivot = arr[high]\n        i = low - 1\n        for j in range(low, high):\n            if arr[j] < pivot:\n                i += 1\n                arr[i], arr[j] = arr[j], arr[i]\n        arr[i + 1], arr[high] = arr[high], arr[i + 1]\n        pi = i + 1\n        quick_sort(arr, low, pi - 1)\n        quick_sort(arr, pi + 1, high)`,
    cpp: `void quickSort(vector<int>& arr, int low, int high) {\n    if (low < high) {\n        int pivot = arr[high];\n        int i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                swap(arr[i], arr[j]);\n            }\n        }\n        swap(arr[i + 1], arr[high]);\n        int pi = i + 1;\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}`,
    java: `void quickSort(int[] arr, int low, int high) {\n    if (low < high) {\n        int pivot = arr[high];\n        int i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n        int temp = arr[i + 1];\n        arr[i + 1] = arr[high];\n        arr[high] = temp;\n        int pi = i + 1;\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}`,
  },
  "heap-sort": {
    title: "Converts the array into a max heap, then repeatedly extracts the max.",
    js: `function heapify(arr, n, i) {\n  let largest = i, left = 2 * i + 1, right = 2 * i + 2;\n  if (left < n && arr[left] > arr[largest]) largest = left;\n  if (right < n && arr[right] > arr[largest]) largest = right;\n  if (largest !== i) {\n    [arr[i], arr[largest]] = [arr[largest], arr[i]];\n    heapify(arr, n, largest);\n  }\n}\nfunction heapSort(arr) {\n  const n = arr.length;\n  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);\n  for (let i = n - 1; i > 0; i--) {\n    [arr[0], arr[i]] = [arr[i], arr[0]];\n    heapify(arr, i, 0);\n  }\n  return arr;\n}`,
    py: `def heapify(arr, n, i):\n    largest, left, right = i, 2 * i + 1, 2 * i + 2\n    if left < n and arr[left] > arr[largest]: largest = left\n    if right < n and arr[right] > arr[largest]: largest = right\n    if largest != i:\n        arr[i], arr[largest] = arr[largest], arr[i]\n        heapify(arr, n, largest)\n\ndef heap_sort(arr):\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1): heapify(arr, n, i)\n    for i in range(n - 1, 0, -1):\n        arr[i], arr[0] = arr[0], arr[i]\n        heapify(arr, i, 0)\n    return arr`,
    cpp: `void heapify(vector<int>& arr, int n, int i) {\n    int largest = i, left = 2 * i + 1, right = 2 * i + 2;\n    if (left < n && arr[left] > arr[largest]) largest = left;\n    if (right < n && arr[right] > arr[largest]) largest = right;\n    if (largest != i) {\n        swap(arr[i], arr[largest]);\n        heapify(arr, n, largest);\n    }\n}\nvoid heapSort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);\n    for (int i = n - 1; i > 0; i--) {\n        swap(arr[0], arr[i]);\n        heapify(arr, i, 0);\n    }\n}`,
    java: `void heapify(int[] arr, int n, int i) {\n    int largest = i, left = 2 * i + 1, right = 2 * i + 2;\n    if (left < n && arr[left] > arr[largest]) largest = left;\n    if (right < n && arr[right] > arr[largest]) largest = right;\n    if (largest != i) {\n        int temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;\n        heapify(arr, n, largest);\n    }\n}\nvoid heapSort(int[] arr) {\n    int n = arr.length;\n    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);\n    for (int i = n - 1; i > 0; i--) {\n        int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;\n        heapify(arr, i, 0);\n    }\n}`,
  },
  "counting-sort": {
    title: "Counts frequency of elements, maps them to array indexes (fast for small int ranges).",
    js: `function countingSort(arr) {\n  const max = Math.max(...arr);\n  const count = new Array(max + 1).fill(0);\n  for (let num of arr) count[num]++;\n  let k = 0;\n  for (let i = 0; i <= max; i++) {\n    while (count[i] > 0) {\n      arr[k++] = i;\n      count[i]--;\n    }\n  }\n  return arr;\n}`,
    py: `def counting_sort(arr):\n    max_val = max(arr)\n    count = [0] * (max_val + 1)\n    for num in arr: count[num] += 1\n    k = 0\n    for i in range(max_val + 1):\n        while count[i] > 0:\n            arr[k] = i\n            k += 1\n            count[i] -= 1\n    return arr`,
    cpp: `void countingSort(vector<int>& arr) {\n    int max_val = *max_element(arr.begin(), arr.end());\n    vector<int> count(max_val + 1, 0);\n    for (int num : arr) count[num]++;\n    int k = 0;\n    for (int i = 0; i <= max_val; i++) {\n        while (count[i] > 0) {\n            arr[k++] = i;\n            count[i]--;\n        }\n    }\n}`,
    java: `void countingSort(int[] arr) {\n    int max = Arrays.stream(arr).max().getAsInt();\n    int[] count = new int[max + 1];\n    for (int num : arr) count[num]++;\n    int k = 0;\n    for (int i = 0; i <= max; i++) {\n        while (count[i] > 0) {\n            arr[k++] = i;\n            count[i]--;\n        }\n    }\n}`,
  },
  "radix-sort": {
    title:
      "Sorts integers by grouping them by individual digits starting from least significant digit.",
    js: `function countingSortByDigit(arr, exp) {\n  const output = new Array(arr.length), count = new Array(10).fill(0);\n  for (const value of arr) count[Math.floor(value / exp) % 10]++;\n  for (let i = 1; i < 10; i++) count[i] += count[i - 1];\n  for (let i = arr.length - 1; i >= 0; i--) {\n    const digit = Math.floor(arr[i] / exp) % 10;\n    output[--count[digit]] = arr[i];\n  }\n  for (let i = 0; i < arr.length; i++) arr[i] = output[i];\n}\nfunction radixSort(arr) {\n  const max = Math.max(...arr);\n  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {\n    countingSortByDigit(arr, exp);\n  }\n  return arr;\n}`,
    py: `def counting_sort_by_digit(arr, exp):\n    output, count = [0] * len(arr), [0] * 10\n    for value in arr: count[(value // exp) % 10] += 1\n    for i in range(1, 10): count[i] += count[i - 1]\n    for i in range(len(arr) - 1, -1, -1):\n        digit = (arr[i] // exp) % 10\n        count[digit] -= 1\n        output[count[digit]] = arr[i]\n    arr[:] = output\n\ndef radix_sort(arr):\n    max_val, exp = max(arr), 1\n    while max_val // exp > 0:\n        counting_sort_by_digit(arr, exp)\n        exp *= 10\n    return arr`,
    cpp: `void countingSortByDigit(vector<int>& arr, int exp) {\n    vector<int> output(arr.size()), count(10, 0);\n    for (int value : arr) count[(value / exp) % 10]++;\n    for (int i = 1; i < 10; i++) count[i] += count[i - 1];\n    for (int i = arr.size() - 1; i >= 0; i--) {\n        int digit = (arr[i] / exp) % 10;\n        output[--count[digit]] = arr[i];\n    }\n    arr = output;\n}\nvoid radixSort(vector<int>& arr) {\n    int maxValue = *max_element(arr.begin(), arr.end());\n    for (int exp = 1; maxValue / exp > 0; exp *= 10) {\n        countingSortByDigit(arr, exp);\n    }\n}`,
    java: `void countingSortByDigit(int[] arr, int exp) {\n    int[] output = new int[arr.length], count = new int[10];\n    for (int value : arr) count[(value / exp) % 10]++;\n    for (int i = 1; i < 10; i++) count[i] += count[i - 1];\n    for (int i = arr.length - 1; i >= 0; i--) {\n        int digit = (arr[i] / exp) % 10;\n        output[--count[digit]] = arr[i];\n    }\n    System.arraycopy(output, 0, arr, 0, arr.length);\n}\nvoid radixSort(int[] arr) {\n    int max = Arrays.stream(arr).max().getAsInt();\n    for (int exp = 1; max / exp > 0; exp *= 10) {\n        countingSortByDigit(arr, exp);\n    }\n}`,
  },
  "merge-sorted-arrays": {
    title: "Merges two sorted halves of a single array into one sorted array.",
    js: `function mergeSortedHalves(arr) {\n  const mid = Math.floor(arr.length / 2);\n  let i = 0, j = mid;\n  const result = [];\n  while (i < mid && j < arr.length) {\n    if (arr[i] <= arr[j]) {\n      result.push(arr[i]);\n      i++;\n    } else {\n      result.push(arr[j]);\n      j++;\n    }\n  }\n  while (i < mid) result.push(arr[i++]);\n  while (j < arr.length) result.push(arr[j++]);\n  return result;\n}`,
    py: `def merge_sorted_halves(arr):\n    mid = len(arr) // 2\n    i, j = 0, mid\n    result = []\n    while i < mid and j < len(arr):\n        if arr[i] <= arr[j]:\n            result.append(arr[i])\n            i += 1\n        else:\n            result.append(arr[j])\n            j += 1\n    while i < mid:\n        result.append(arr[i])\n        i += 1\n    while j < len(arr):\n        result.append(arr[j])\n        j += 1\n    return result`,
    cpp: `vector<int> mergeSortedHalves(vector<int>& arr) {\n    int mid = arr.size() / 2;\n    int i = 0, j = mid;\n    vector<int> result;\n    while (i < mid && j < arr.size()) {\n        if (arr[i] <= arr[j]) {\n            result.push_back(arr[i]);\n            i++;\n        } else {\n            result.push_back(arr[j]);\n            j++;\n        }\n    }\n    while (i < mid) result.push_back(arr[i++]);\n    while (j < arr.size()) result.push_back(arr[j++]);\n    return result;\n}`,
    java: `int[] mergeSortedHalves(int[] arr) {\n    int mid = arr.length / 2;\n    int i = 0, j = mid, k = 0;\n    int[] result = new int[arr.length];\n    while (i < mid && j < arr.length) {\n        if (arr[i] <= arr[j]) {\n            result[k++] = arr[i];\n            i++;\n        } else {\n            result[k++] = arr[j];\n            j++;\n        }\n    }\n    while (i < mid) result[k++] = arr[i++];\n    while (j < arr.length) result[k++] = arr[j++];\n    return result;\n}`,
  },
  "reverse-array": {
    title: "Reverses elements in place using two pointers.",
    js: `function reverse(arr) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++; right--;\n  }\n}`,
    py: `def reverse(arr):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        arr[left], arr[right] = arr[right], arr[left]\n        left += 1; right -= 1`,
    cpp: `void reverse(vector<int>& arr) {\n    int left = 0, right = arr.size() - 1;\n    while (left < right) {\n        swap(arr[left++], arr[right--]);\n    }\n}`,
    java: `void reverse(int[] arr) {\n    int left = 0, right = arr.length - 1;\n    while (left < right) {\n        int temp = arr[left]; arr[left] = arr[right]; arr[right] = temp;\n        left++; right--;\n    }\n}`,
  },
  "left-rotation": {
    title: "Rotates the array to the left by shifting elements.",
    js: `function leftRotate(arr, d) {\n  let n = arr.length;\n  d = d % n;\n  let temp = arr.slice(0, d);\n  for (let i = 0; i < n - d; i++) arr[i] = arr[i + d];\n  for (let i = 0; i < d; i++) arr[n - d + i] = temp[i];\n}`,
    py: `def left_rotate(arr, d):\n    n = len(arr)\n    d = d % n\n    temp = arr[:d]\n    for i in range(n - d): arr[i] = arr[i + d]\n    for i in range(d): arr[n - d + i] = temp[i]`,
    cpp: `void leftRotate(vector<int>& arr, int d) {\n    int n = arr.size();\n    d = d % n;\n    vector<int> temp(arr.begin(), arr.begin() + d);\n    for (int i = 0; i < n - d; i++) arr[i] = arr[i + d];\n    for (int i = 0; i < d; i++) arr[n - d + i] = temp[i];\n}`,
    java: `void leftRotate(int[] arr, int d) {\n    int n = arr.length;\n    d = d % n;\n    int[] temp = Arrays.copyOfRange(arr, 0, d);\n    for (int i = 0; i < n - d; i++) arr[i] = arr[i + d];\n    for (int i = 0; i < d; i++) arr[n - d + i] = temp[i];\n}`,
  },
  "right-rotation": {
    title: "Rotates the array to the right by shifting elements.",
    js: `function rightRotate(arr, d) {\n  let n = arr.length;\n  d = d % n;\n  let temp = arr.slice(n - d, n);\n  for (let i = n - 1; i >= d; i--) arr[i] = arr[i - d];\n  for (let i = 0; i < d; i++) arr[i] = temp[i];\n}`,
    py: `def right_rotate(arr, d):\n    n = len(arr)\n    d = d % n\n    temp = arr[n - d:n]\n    for i in range(n - 1, d - 1, -1): arr[i] = arr[i - d]\n    for i in range(d): arr[i] = temp[i]`,
    cpp: `void rightRotate(vector<int>& arr, int d) {\n    int n = arr.size();\n    d = d % n;\n    vector<int> temp(arr.end() - d, arr.end());\n    for (int i = n - 1; i >= d; i--) arr[i] = arr[i - d];\n    for (int i = 0; i < d; i++) arr[i] = temp[i];\n}`,
    java: `void rightRotate(int[] arr, int d) {\n    int n = arr.length;\n    d = d % n;\n    int[] temp = Arrays.copyOfRange(arr, n - d, n);\n    for (int i = n - 1; i >= d; i--) arr[i] = arr[i - d];\n    for (int i = 0; i < d; i++) arr[i] = temp[i];\n}`,
  },
  "remove-duplicates": {
    title: "Removes duplicate elements from an array by keeping track of seen elements.",
    js: `function removeDuplicates(arr) {\n  return [...new Set(arr)];\n}`,
    py: `def remove_duplicates(arr):\n    return list(dict.fromkeys(arr))`,
    cpp: `void removeDuplicates(vector<int>& arr) {\n    unordered_set<int> seen;\n    vector<int> result;\n    for (int num : arr) {\n        if (seen.find(num) == seen.end()) {\n            seen.insert(num);\n            result.push_back(num);\n        }\n    }\n    arr = result;\n}`,
    java: `int[] removeDuplicates(int[] arr) {\n    return Arrays.stream(arr).distinct().toArray();\n}`,
  },
};

const aliases: Record<string, string> = {
  access: "access-by-index",
  "insert-beginning": "insert",
  "insert-index": "insert",
  "insert-end": "insert",
  "delete-beginning": "delete",
  "delete-index": "delete",
  "delete-end": "delete",
  "delete-value": "delete",
  "update-by-index": "update",
  "update-by-value": "update",
};

const genericSnippets: Record<string, Snippet> = {
  sort: {
    title: "Sorts the array by repeatedly comparing and moving elements.",
    js: `array.sort((a, b) => a - b);`,
    py: `array.sort()`,
    cpp: `sort(array.begin(), array.end());`,
    java: `Arrays.sort(array);`,
  },
  insert: {
    title: "Shifts elements right and writes the new value at the selected index.",
    js: `array.splice(index, 0, value);`,
    py: `array.insert(index, value)`,
    cpp: `for (int i = n; i > index; i--) array[i] = array[i - 1];\narray[index] = value;\nn++;`,
    java: `for (int i = n; i > index; i--) array[i] = array[i - 1];\narray[index] = value;`,
  },
  delete: {
    title: "Shifts elements left to overwrite the deleted position.",
    js: `array.splice(index, 1);`,
    py: `array.pop(index)`,
    cpp: `for (int i = index; i < n - 1; i++) array[i] = array[i + 1];\nn--;`,
    java: `for (int i = index; i < n - 1; i++) array[i] = array[i + 1];`,
  },
  update: {
    title: "Directly overwrites the value at a specified index.",
    js: `array[index] = newValue;`,
    py: `array[index] = new_value`,
    cpp: `array[index] = newValue;`,
    java: `array[index] = newValue;`,
  },
};

export function getArrayCodeExamples(slug: string, algorithmId: string): CodeExample[] {
  const snippet = snippets[slug] ?? snippets[aliases[slug]] ?? genericSnippets[aliases[slug]];
  if (!snippet) return [];

  return [
    {
      id: `${algorithmId}-js`,
      algorithmId,
      language: "javascript",
      isPrimary: true,
      explanation: snippet.title,
      code: snippet.js,
    },
    {
      id: `${algorithmId}-py`,
      algorithmId,
      language: "python",
      isPrimary: false,
      explanation: snippet.title,
      code: snippet.py,
    },
    {
      id: `${algorithmId}-cpp`,
      algorithmId,
      language: "cpp",
      isPrimary: false,
      explanation: snippet.title,
      code: snippet.cpp,
    },
    {
      id: `${algorithmId}-java`,
      algorithmId,
      language: "java",
      isPrimary: false,
      explanation: snippet.title,
      code: snippet.java,
    },
  ];
}
