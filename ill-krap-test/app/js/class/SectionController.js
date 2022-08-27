class SectionController {
  #sections;
  #navButtons;

  constructor(sections, navButtons) {
    this.#sections = sections;
    this.#navButtons = navButtons;
  }

  init() {
    for (let i = 0 ; i < this.#navButtons.length ; i++) {
      this.#navButtons[i].addEventListener('click', this.onClickNavButton.bind(this));
    }
  }

  onClickNavButton(e) {
    let section = e.target.value;
    this.#navigateTo(section);
  }

  #navigateTo(section) {
    this.#sections.forEach(sec => sec.style.display = "none");
    this.#sections.forEach((sec) => {
      if (sec.id == section) {
        sec.style.removeProperty("display");
      }
    });
  }
}
