export class Language {
  /**
   * @param {"html" | "javascript"} language
   */
  constructor(language) {
    this.value = language;
  }

  mime() {
    return `text/${this.value}`;
  }
}
