export function getAlgorithmPseudocode(slug: string): string[] {
  switch (slug) {
    case "access":
    case "access-by-index":
    case "random-access":
      return [
        "function access(array, index):",
        "    if index < 0 or index >= length(array):",
        "        return error",
        "    return array[index]",
      ];
    case "forward-traversal":
      return [
        "function traverseForward(array):",
        "    for i from 0 to length(array) - 1:",
        "        visit array[i]",
      ];
    case "reverse-traversal":
      return [
        "function traverseReverse(array):",
        "    for i from length(array) - 1 down to 0:",
        "        visit array[i]",
      ];
    case "range-traversal":
      return [
        "function traverseRange(array, start, end):",
        "    validate start and end",
        "    for i from start to end:",
        "        visit array[i]",
      ];
    case "linear-search":
      return [
        "function linearSearch(array, target):",
        "    for each index i from 0 to array.length - 1:",
        "        if array[i] == target:",
        "            return i",
        "    return -1",
      ];
    case "binary-search":
      return [
        "function binarySearch(array, target):",
        "    low = 0, high = array.length - 1",
        "    while low <= high:",
        "        mid = (low + high) / 2",
        "        if array[mid] == target: return mid",
        "        if array[mid] < target: low = mid + 1",
        "        else: high = mid - 1",
        "    return -1",
      ];
    case "bubble-sort":
      return [
        "function bubbleSort(array):",
        "    for i from 0 to array.length - 1:",
        "        swapped = false",
        "        for j from 0 to array.length - i - 1:",
        "            if array[j] > array[j + 1]:",
        "                swap array[j] and array[j + 1]",
        "                swapped = true",
        "        if not swapped: break",
      ];
    case "selection-sort":
      return [
        "function selectionSort(array):",
        "    for i from 0 to array.length - 1:",
        "        minIndex = i",
        "        for j from i + 1 to array.length:",
        "            if array[j] < array[minIndex]: minIndex = j",
        "        swap array[i] and array[minIndex]",
      ];
    case "insertion-sort":
      return [
        "function insertionSort(array):",
        "    for i from 1 to array.length - 1:",
        "        key = array[i]",
        "        j = i - 1",
        "        while j >= 0 and array[j] > key:",
        "            array[j + 1] = array[j]",
        "            j = j - 1",
        "        array[j + 1] = key",
      ];
    case "merge-sort":
      return [
        "function mergeSort(array):",
        "    if length(array) <= 1: return array",
        "    split array into left and right",
        "    mergeSort(left)",
        "    mergeSort(right)",
        "    merge sorted halves",
      ];
    case "quick-sort":
      return [
        "function quickSort(array, low, high):",
        "    if low < high:",
        "        pivotIndex = partition(array, low, high)",
        "        quickSort(array, low, pivotIndex - 1)",
        "        quickSort(array, pivotIndex + 1, high)",
      ];
    case "insert-beginning":
    case "insert-end":
    case "insert-index":
      return [
        "function insert(array, index, element):",
        "    validate index and capacity",
        "    shift elements right from index",
        "    array[index] = element",
        "    size = size + 1",
      ];
    case "delete-beginning":
    case "delete-end":
    case "delete-index":
      return [
        "function delete(array, index):",
        "    validate index",
        "    save deleted element",
        "    shift elements left from index",
        "    size = size - 1",
        "    return deleted element",
      ];
    case "update-by-index":
      return [
        "function updateByIndex(array, index, newValue):",
        "    validate index",
        "    current = array[index]",
        "    array[index] = newValue",
        "    return current",
      ];
    case "update-by-value":
      return [
        "function updateByValue(array, oldValue, newValue):",
        "    for each element in array:",
        "        if element == oldValue:",
        "            element = newValue",
        "            return success",
        "    return not found",
      ];
    case "remove-duplicates":
      return [
        "function removeDuplicates(array):",
        "    seen = new Set()",
        "    result = []",
        "    for each element in array:",
        "        if element not in seen:",
        "            seen.add(element)",
        "            result.push(element)",
        "        else: discard duplicate",
        "    return result",
      ];
    default:
      return [];
  }
}
