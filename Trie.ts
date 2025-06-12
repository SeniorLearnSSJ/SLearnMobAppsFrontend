export class TrieNode {
  children: { [key: string]: TrieNode };
  isWord: boolean;

  constructor() {
    this.children = {};
    this.isWord = false;
  }
}

export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isWord = true;
  }


private suggestHelper
(node: TrieNode, list: string[],
curr: string): void{
    if (node.isWord){
    list.push(curr);}
    for (const char in node.children){
        this.suggestHelper(node.children[char], list, curr + char);}}

       

        suggest (prefix: string): string[]{
            let node = this.root;
            let curr = "";
            for (const char of prefix){
                if (!node.children[char]){
                    return [];
                }
                node = node.children[char];
                curr += char;
            }
            const list: string[] = [];
            this.suggestHelper (node, list, curr);
            return list;
        }
    }