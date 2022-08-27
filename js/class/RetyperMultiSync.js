class RetyperMultiSync {
  constructor() {
    this.listTextRewriter = new Array();
  }

  onCycleFinish() {
    let n = this.listTextRewriter.length;
    let isCycleFinish = true;
    for (let i = 0 ; i < n ; i++) {
      isCycleFinish = isCycleFinish ? this.listTextRewriter[i].isCycleFinish : isCycleFinish;
    }
    if (isCycleFinish) {
      this.runCycle();
    }
  }

  runCycle() {
    let n = this.listTextRewriter.length;
    for (let i = 0 ; i < n ; i++) {
      this.listTextRewriter[i].runCycle();
    }
  }
}
