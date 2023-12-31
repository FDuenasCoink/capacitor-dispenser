export class Logger {
  private tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  log(message: string) {
    console.log(`[${this.tag}] ${message}`);
  }
}
