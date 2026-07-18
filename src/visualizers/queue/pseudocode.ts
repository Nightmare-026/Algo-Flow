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
    default:
      return [];
  }
}
