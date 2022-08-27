class TestSettingsController {
  #numpadLayout;

  #inputQuestionSize;
  #inputNumpadSize;
  #inputNumpadLayout;

  #numpadPreview;
  #questionPreview;

  #numpadTest;
  #questionTest;

  constructor(inputQuestionSize,
              inputNumpadSize,
              inputNumpadLayout,
              numpadPreview,
              questionPreview,
              numpadTest,
              questionTest) {
    this.#numpadLayout = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      [7, 8, 9, 4, 5, 6, 1, 2, 3, 0]
    ];

    this.#inputQuestionSize = inputQuestionSize;
    this.#inputNumpadSize = inputNumpadSize;
    this.#inputNumpadLayout = inputNumpadLayout;

    this.#numpadPreview = numpadPreview;
    this.#questionPreview = questionPreview;

    this.#numpadTest = numpadTest;
    this.#questionTest = questionTest;
  }

  init() {
    this.#inputQuestionSize.addEventListener('input', this.onInputQuestionSize.bind(this));
    this.#inputNumpadSize.addEventListener('input', this.onInputNumpadSize.bind(this));
    for (let i = 0 ; i < this.#inputNumpadLayout.length ; i++) {
      this.#inputNumpadLayout[i].addEventListener('change', this.onInputNumpadLayout.bind(this));
    }
  }

  onInputQuestionSize(e) {
    let newSize = e.target.value;
    e.target.labels[1].textContent = "" + newSize;
    this.#resizeQuestion(newSize);
  }

  onInputNumpadSize(e) {
    let newSize = e.target.value;
    e.target.labels[1].textContent = "" + newSize;
    this.#resizeNumpad(newSize);
  }

  onInputNumpadLayout(e) {
    let layout = e.target.value;
    this.#reconfigureLayout(layout);
  }

  #resizeNumpad(newSize) {
    this.#numpadPreview.forEach((numpad) => {
      numpad.style.fontSize = Math.round(newSize * 0.382) + "mm";
      numpad.style.minWidth = newSize + "mm";
      numpad.style.minHeight = newSize + "mm";
    });
    this.#numpadTest.forEach((numpad) => {
      numpad.style.fontSize = Math.round(newSize * 0.382) + "mm";
      numpad.style.minWidth = newSize + "mm";
      numpad.style.minHeight = newSize + "mm";
    });
  }

  #resizeQuestion(newSize) {
    this.#questionPreview.forEach((txt) => {
      txt.style.fontSize = newSize + "mm";
    });
    this.#questionTest.forEach((txt) => {
      txt.style.fontSize = newSize + "mm";
    });
  }

  #reconfigureLayout(layout) {
    this.#numpadPreview.forEach((numpad, i) => {
      numpad.textContent = "" + this.#numpadLayout[layout][i];
      numpad.value = "" + this.#numpadLayout[layout][i];
    }, this);
    this.#numpadTest.forEach((numpad, i) => {
      numpad.textContent = "" + this.#numpadLayout[layout][i];
      numpad.value = "" + this.#numpadLayout[layout][i];
    }, this);
  }
}
