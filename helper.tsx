/**
 * Defines ListNode, DoublyLinkedList classes.
 */

export class ListNode {
  id: string;
  title: string;
  datetime: Date;
  prev: ListNode| null = null;
  next: ListNode | null = null;
  content: string

  constructor(id: string, title: string, datetime: Date, content: string) {
    this.id = id;
    this.title = title;
    this.datetime = datetime;
    this.content = content;
  }
}


export class DoublyLinkedList {
  head: ListNode | null = null;
  tail: ListNode | null = null;
  length: number = 0;


/**
 * Defines function to insert sets of data at end of DoublyLinkedList.
 * @param id 
 * @param title 
 * @param datetime 
 * @param content 
 */
   insertAtEnd(id: string, title: string, datetime: Date, content: string) {
    const newNode = new ListNode(id, title, datetime, content);

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  /**
   * Defines function to build an array.
   * @param arr 
   */
   buildFromArray(arr: { id: string; title: string; datetime: Date, content: string }[]) {
    arr.forEach(item =>{
      const dateObj = item.datetime instanceof Date? item.datetime: new Date (item.datetime)
      this.insertAtEnd(item.id, item.title, item.datetime, item.content);
    });
  }

  /**
   * Defines function to get a node by its Id.
   * @param id 
   * @returns Null
   */

  getNodeById(id: string): ListNode | null {
  let current = this.head;
  while (current !== null) {
    if (current.id === id) {
      return current;
    }
    current = current.next;
  }
  return null; 
}


}


