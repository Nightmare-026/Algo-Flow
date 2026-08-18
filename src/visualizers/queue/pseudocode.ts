export function getQueuePseudocode(slug: string): string[] {
  switch (slug) {
    case "queue-enqueue":
      return [
        "function enqueue(queue, value):",
        "    if isFull(queue): return overflow",
        "    rear = rear + 1",
        "    queue[rear] = value",
        "    return success",
      ];
    case "queue-dequeue":
      return [
        "function dequeue(queue):",
        "    if isEmpty(queue): return underflow",
        "    value = queue[front]",
        "    front = front + 1",
        "    return value",
      ];
    case "queue-peek":
      return [
        "function peek(queue):",
        "    if isEmpty(queue): return underflow",
        "    return queue[front]",
        "    queue is unchanged",
      ];
    case "queue-front-rear":
      return [
        "function frontRear(queue):",
        "    if isEmpty(queue): return underflow",
        "    frontValue = queue[front]",
        "    rearValue = queue[rear]",
        "    return frontValue, rearValue",
      ];
    case "deque-push-front":
      return [
        "function pushFront(deque, value):",
        "    if isFull(deque): return overflow",
        "    front = (front - 1 + capacity) % capacity; deque[front] = value",
        "    return success",
      ];
    case "deque-pop-rear":
      return [
        "function popRear(deque):",
        "    if isEmpty(deque): return underflow",
        "    value = deque[rear]",
        "    rear = (rear - 1 + capacity) % capacity",
        "    return value",
      ];
    case "priority-queue-enqueue":
      return [
        "function priorityEnqueue(pq, value):",
        "    if isFull(pq): return overflow",
        "    find slot index i matching priority order",
        "    insert value at index i",
        "    return success",
      ];
    case "priority-queue-dequeue":
      return [
        "function priorityDequeue(pq):",
        "    if isEmpty(pq): return underflow",
        "    maxElem = pq[front]",
        "    remove pq[front] and shift",
        "    return maxElem",
      ];
    default:
      return [];
  }
}
