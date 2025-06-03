export class ParsingErrorException extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ParsingErrorException';
  }
}
