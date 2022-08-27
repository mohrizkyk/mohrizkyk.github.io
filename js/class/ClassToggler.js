class ClassToggler {
  #toggleElement;

  #toggleData;
  #targetElement;

  constructor(toggleElement) {
    if (!toggleElement.dataset.toggle) {
      throw "expected data-toggle attribute"
    }
    let toggleData = toggleElement.dataset.toggle.split(' ');
    if (toggleData.length <= 0) {
      throw "expected data-toggle attribute to have at least one (space-separated) string"
    }
    if (!toggleElement.dataset.target) {
      throw "expected data-target attribute"
    }
    let targetQuery = toggleElement.dataset.target;
    let targetElement = document.querySelector(targetQuery);
    if (!targetElement) {
      throw "cannot find target element " + targetQuery;
    }

    this.#toggleElement = toggleElement;
    this.#toggleData = toggleData;
    this.#targetElement = targetElement;
  }

  init() {
    this.#toggleElement.addEventListener('click', this.onClick.bind(this));
  }

  onClick(e) {
    this.#toggleData.forEach((c) => {
      this.#targetElement.classList.toggle(c);
    });
  }
}