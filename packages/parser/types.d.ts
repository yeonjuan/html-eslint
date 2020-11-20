export interface IEmitter {
  on(name: string, listener: (...any) => void): void;
  emit(name: string, ...arg: any[]): void;
}

export interface ITraverser {
  traverse(node: any, parent: any): void;
}

export interface IStack {
  push(item: any): void;
  pop(): any;
  top(): any;
  isEmpty(): boolean;
}

type HTMLNode = any;
type ESNode = any;

export interface IASTConverter {
  convert(ast: HTMLNode): ESNode;
}

export interface IParser {
  parse(code: string): ESNode;
}
