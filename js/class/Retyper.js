class Retyper {
  #element;
  #listText;
  #textIndex;
  #toWrite;
  #transitionDuration;
  #transitionDelay;
  #cycleHandler;

  constructor({ element, onCycleFinish = null }) {
    this.#element = element;
    let listText = JSON.parse(this.#element.dataset.listText);
    if (!Array.isArray(listText) || listText.length <= 0) {
      throw "expect listText to be an array and not empty";
    }
    this.#listText = listText;

    let currText = this.#element.textContent;
    let textIndex = this.#listText.indexOf(currText);
    if (textIndex < 0) {
      throw "expect pre-loaded text to be included in the listText";
    }
    this.#textIndex = textIndex;
    this.#toWrite = [];

    let transitionDuration = parseInt(this.#element.dataset.duration);
    if (transitionDuration <= 0) {
      throw "expect transition duration to be at least 1 ms";
    }
    this.#transitionDuration = transitionDuration;

    let transitionDelay = parseInt(this.#element.dataset.delay);
    if (transitionDelay <= 0) {
      throw "expect transition delay to be at least 1 ms";
    }
    this.#transitionDelay = transitionDelay;

    this.#cycleHandler = null;
    this.isCycleFinish = true;
    this.onCycleFinish = onCycleFinish;
  }

  write(delay) {
    this.#setText(this.#currText() + this.#toWrite.shift());
    if (this.#toWrite.length <= 0) {
      this.isCycleFinish = true;
      if (typeof this.onCycleFinish !== 'function') {
        this.runCycle();
      }
      else {
        this.onCycleFinish();
      }
      return;
    }
    else {
      clearTimeout(this.#cycleHandler);
      this.#cycleHandler = setTimeout(this.write.bind(this), delay, delay);
      return;
    }
  }

  erase(delay) {
    let str = this.#currText();
    if (str.length > 0) {
      this.#setText(str.slice(0, -1));

      clearTimeout(this.#cycleHandler);
      this.#cycleHandler = setTimeout(this.erase.bind(this), delay, delay);
      return;
    }
    else {
      this.write(delay);
      return;
    }
  }

  runCycle() {
    let currLen = this.#currText().length;
    let nextStr = this.#nextText();
    let nextLen = nextStr.length;
    let delay = Math.ceil(this.#transitionDuration / (currLen + nextLen));
    this.#toWrite = nextStr.split('');

    clearTimeout(this.#cycleHandler);
    this.isCycleFinish = false;
    this.#cycleHandler = setTimeout(this.erase.bind(this), this.#transitionDelay, delay);
  }

  #setText(str) {
    this.#element.textContent = str;
  }

  #currText() {
    return this.#element.textContent;
  }

  #nextText() {
    return this.#listText[(++this.#textIndex) % this.#listText.length];
  }
}
