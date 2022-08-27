class TestController {
  #isRun;
  #testRecords;
  #testRecordsLastIndex;
  #testRecordsCorrectCount;
  #testRecordsWrongCount;

  #sectionTestStatus;
  #sectionTestStatusText;

  #startTestConfirmation;
  #startTestButton;
  #stopTestButton;

  #startTime; // initialized on startTest
  #stopTime; // initialized on stopTest
  #testTimeDisplay;

  #btnNumpads;
  #txtTestQuestion;

  #txtAnswerCount;

  #btnViewResult;

  #resultSummary;
  #resultOverallResponseTime;
  #resultLeftResponseTime;
  #resultRightResponseTime;

  #linkDownloadCsv;
  #csvObjectUrl;

  #linkDownloadJson;
  #jsonObjectUrl;

  constructor(arg) {
    let {
      sectionTestStatus,
      sectionTestStatusText,
      startTestConfirmation,
      startTestButton,
      stopTestButton,
      testTimeDisplay,
      btnNumpads,
      txtTestQuestion,
      txtAnswerCount,
      btnViewResult,
      resultSummary,
      resultOverallResponseTime,
      resultLeftResponseTime,
      resultRightResponseTime,
      linkDownloadCsv,
      linkDownloadJson
    } = arg;

    this.#isRun = false;
    this.#testRecords = [];
    this.#testRecordsLastIndex = -1;
    this.#testRecordsCorrectCount = 0;
    this.#testRecordsWrongCount = 0;

    this.#sectionTestStatus = sectionTestStatus;
    this.#sectionTestStatusText = sectionTestStatusText;

    this.#startTestConfirmation = startTestConfirmation;
    this.#startTestButton = startTestButton;
    this.#stopTestButton = stopTestButton;

    this.#testTimeDisplay = testTimeDisplay;

    this.#btnNumpads = btnNumpads;
    this.#txtTestQuestion = txtTestQuestion;

    this.#txtAnswerCount = txtAnswerCount;

    this.#btnViewResult = btnViewResult;

    this.#resultSummary = resultSummary;
    this.#resultOverallResponseTime = resultOverallResponseTime;
    this.#resultLeftResponseTime = resultLeftResponseTime;
    this.#resultRightResponseTime = resultRightResponseTime;

    this.#linkDownloadCsv = linkDownloadCsv;
    this.#csvObjectUrl = null;

    this.#linkDownloadJson = linkDownloadJson;
    this.#jsonObjectUrl = null;
  }

  init() {
    // init ui
    this.#showConfirmationDialog();

    this.#enableStartButton();
    this.#showStartButton();

    this.#disableNumpad();

    this.#disableStopButton();
    this.#showStopButton();

    this.#disableViewResultButton();
    this.#hideViewResultButton();

    // bind event
    this.#startTestButton.addEventListener('click', this.onStart.bind(this));

    for (let i = 0 ; i < this.#btnNumpads.length ; i++) {
      this.#btnNumpads[i].addEventListener('click', this.onAnswer.bind(this));
    }

    this.#stopTestButton.addEventListener('click', this.onStop.bind(this));

    this.#btnViewResult.addEventListener('click', this.onViewResult.bind(this));
  }

  onStart(e) {
    // hide confirmation dialog
    this.#disableStartButton();
    this.#hideStartButton();
    this.#hideConfirmationDialog();

    this.onStartCountdown(3);
  }

  onStartCountdown(t) {
    if (t > 0) {
      this.#setStatusBgColor("#FFA");
      this.#setStatusText(`${t}`);

      setTimeout(this.onStartCountdown.bind(this), 1000, t - 1);
    }
    else {
      this.#setStatusBgColor();
      this.#setStatusText(`GO!`);

      this.#startTest();
    }
  }

  onAnswer(e) {
    if (!this.#isRun) {
      alert("Test hasn't started yet, please click the start button");
      return;
    }

    let answerTime = Date.now();
    let answer = +e.target.value;

    let record = this.#getLastTestRecord();
    let expectedAnswer = record.question.expectedAnswer;
    let questionTime = record.questionTime;

    record.answer = answer;
    record.answerTime = answerTime;
    record.calculationTime = answerTime - questionTime;

    if (answer == expectedAnswer) {
      record.isCorrect = true;
      this.#testRecordsCorrectCount++;

      this.#setStatusText("Correct!");
      this.#setStatusBgColor("#AFA");
    }
    else {
      record.isCorrect = false;
      this.#testRecordsWrongCount++;

      this.#setStatusText("Wrong!");
      this.#setStatusBgColor("#FAA");
    }

    this.#updateTestRecord(this.#testRecordsLastIndex, record);

    // create new question
    let newQuestion = this.#generateQuestion(record.question.x, record.question.y, (this.#testRecordsLastIndex + 1) % 2 == 1);
    this.#addTestRecord(newQuestion);
    this.#setQuestionText(`${newQuestion.x} + ${newQuestion.y}`);

    let answerCount = this.#testRecordsCorrectCount + this.#testRecordsWrongCount;
    let requiredAnswer = answerCount - 5;
    if (requiredAnswer < 0) {
      requiredAnswer = Math.abs(requiredAnswer);
      this.#setAnswerCountText(`Answer at least ${requiredAnswer} more ${requiredAnswer === 1 ? "question" : "questions"} to stop.`);
      this.#disableStopButton();
    }
    else {
      this.#setAnswerCountText(`You've answered ${answerCount.toLocaleString()} questions.`);
      this.#enableStopButton();
    }
  }

  onStop(e) {
    this.#stopTime = Date.now();
    this.#isRun = false;

    this.#disableNumpad();

    this.#disableStopButton();
    this.#hideStopButton();

    this.#enableViewResultButton();
    this.#showViewResultButton();

    this.#setStatusBgColor();
    this.#setStatusText("Stopped");
  }

  onViewResult(e) {
    let summaryTestRecords = [];
    let overallPerformanceTestRecords = [];
    let leftPerformanceTestRecords = [];
    let rightPerformanceTestRecords = [];

    for (let i = 0 ; i < this.#testRecords.length ; i++) {
      if (this.#testRecords[i].calculationTime !== null) {
        summaryTestRecords.push(this.#testRecords[i]);
        overallPerformanceTestRecords.push(this.#testRecords[i]);
        if (i !== 0 && i % 2 === 1) {
          leftPerformanceTestRecords.push(this.#testRecords[i]);
        }
        else if (i !== 0 && i % 2 === 0) {
          rightPerformanceTestRecords.push(this.#testRecords[i]);
        }
      }
    }

    setTimeout(this.#resultSummary.processRecords.bind(this.#resultSummary), 0, {
      testStartTime: this.#startTime,
      testEndTime: this.#stopTime,
      testRecords: summaryTestRecords
    });

    setTimeout(this.#resultOverallResponseTime.processRecords.bind(this.#resultOverallResponseTime), 0, {
      testStartTime: this.#startTime,
      testRecords: overallPerformanceTestRecords
    });

    setTimeout(this.#resultLeftResponseTime.processRecords.bind(this.#resultLeftResponseTime), 0, {
      testStartTime: this.#startTime,
      testRecords: leftPerformanceTestRecords
    });

    setTimeout(this.#resultRightResponseTime.processRecords.bind(this.#resultRightResponseTime), 0, {
      testStartTime: this.#startTime,
      testRecords: rightPerformanceTestRecords
    });

    setTimeout(this.#generateCsvLink.bind(this), 0);
    setTimeout(this.#generateJsonLink.bind(this), 0);
  }

  onUpdateTimer(thisArg = this) {
    if (thisArg.#isRun) {
      thisArg.#setTimerText(thisArg.#msDurationToTime(thisArg.#startTime, Date.now()));
      setTimeout(thisArg.onUpdateTimer, 1000 / 30, thisArg);
    }
  }

  #msDurationToTime(timeStart, timeEnd) {
    let e = timeEnd - timeStart;
    let m = ("" + Math.floor(e / 60000)).padStart(2, "0");
    let s = ("" + Math.floor((e % 60000) / 1000)).padStart(2, "0");
    let ms = ("" + (e % 1000)).padStart(3, "0");
    return `${m}:${s}.${ms}`;
  }

  #timestampToTime(timestamp) {
    let d = new Date(timestamp);
    return d.toLocaleTimeString({}, { hour12: false }) + "." + ("" + d.getMilliseconds()).padStart(3, "0");
  }

  #millisecondToDurationString(elapsed) {
    let minute = ("" + Math.floor(elapsed / 60000)).padStart(2, "0");
    let second = ("" + Math.floor((elapsed % 60000) / 1000)).padStart(2, "0");
    let millisecond = ("" + (elapsed % 1000)).padStart(3, "0");
    return `${minute}:${second}.${millisecond}`;
  }

  #timestampToDateTimeString(timestamp) {
    let tzOffset = new Date().getTimezoneOffset() * 60000;
    let date = new Date(timestamp - tzOffset);
    return date.toISOString().split('T').join(' ').slice(0, -1);
  }

  #startTest() {
    this.#startTime = Date.now();
    this.#isRun = true;

    // create new question
    let newQuestion = this.#generateQuestion();
    this.#addTestRecord(newQuestion);
    this.#setQuestionText(`${newQuestion.x} + ${newQuestion.y}`);

    this.#enableNumpad();

    this.#setAnswerCountText('Answer at least 5 more questions to stop.');
    this.#disableStopButton();
    this.#showStopButton();

    // start timer
    setTimeout(this.onUpdateTimer, 1000 / 30, this);
  }

  #generateRandomDigit(n = []) {
    // generating random 'n' exclusive number
    let x = null;
    do {
      x = Math.round(Math.random() * 9);
    }
    while(n.indexOf(x) >= 0);
    return x;
  }

  #generateQuestion(prevX = -1, prevY = -1, isOdd = false) {
    let x = null,
        y = null;

    // generating question
    if (prevX >= 0 && prevY >= 0) {
      x = isOdd ? this.#generateRandomDigit([prevX, prevY]) : prevX;
      y = isOdd ? prevY : this.#generateRandomDigit([prevX, prevY]);
    }
    else {
      x = this.#generateRandomDigit();
      y = this.#generateRandomDigit([x]);
    }

    let expectedAnswer = (x + y) % 10;

    return {
      x: x,
      y: y,
      expectedAnswer: expectedAnswer
    };
  }

  #generateCsvLink() {
    let csvStr = ""
      + "Question_No,"
      + "Test_Duration,"
      + "Question_Time,"
      + "Answer_Time,"
      + "Calculation_Time_ms,"
      + "Question_Left,"
      + "Question_Right,"
      + "Expected_Answer,"
      + "Answer,"
      + "Is_Correct\n";

    let n = this.#testRecords.length;
    for (let i = 0 ; i < n ; i++) {
      let r = this.#testRecords[i];
      csvStr += ``
        + `${i},`
        + `"${r.answerTime !== null ? this.#millisecondToDurationString(r.answerTime - this.#startTime) : "NA"}",`
        + `"${this.#timestampToDateTimeString(r.questionTime)}",`
        + `"${r.answerTime !== null ? this.#timestampToDateTimeString(r.answerTime) : "NA"}",`
        + `${r.calculationTime !== null ? r.calculationTime : `"NA"`},`
        + `${r.question.x},`
        + `${r.question.y},`
        + `${r.question.expectedAnswer},`
        + `${r.answer !== null ? r.answer : `"NA"`},`
        + `"${r.isCorrect ? "TRUE" : "FALSE"}"\n`;
    }

    this.#csvObjectUrl = URL.createObjectURL(new Blob([csvStr], {type: 'text/csv'}));
    this.#linkDownloadCsv.href = this.#csvObjectUrl;
    this.#linkDownloadCsv.download = 'ill-krap-result.csv';
    this.#linkDownloadCsv.textContent = 'Download data as CSV';
  }

  #generateJsonLink() {
    let jsonStr = JSON.stringify(this.#testRecords.map((r, i) => ({
      questionNo: i,
      testDuration: r.answerTime !== null ? this.#millisecondToDurationString(r.answerTime - this.#startTime) : null,
      questionTime: this.#timestampToDateTimeString(r.questionTime),
      answerTime: r.answerTime !== null ? this.#timestampToDateTimeString(r.answerTime) : null,
      calculationTime: r.calculationTime,
      questionLeft: r.question.x,
      questionRight: r.question.y,
      expectedAnswer: r.question.expectedAnswer,
      answer: r.answer,
      isCorrect: r.isCorrect
    })));

    this.#jsonObjectUrl = URL.createObjectURL(new Blob([jsonStr], {type: 'application/json'}));
    this.#linkDownloadJson.href = this.#jsonObjectUrl;
    this.#linkDownloadJson.download = 'ill-krap-result.json';
    this.#linkDownloadJson.textContent = 'Download data as JSON';
  }

  #addTestRecord(question) {
    this.#testRecords.push({
      question: question,
      questionTime: Date.now(),
      answer: null,
      answerTime: null,
      calculationTime: null,
      isCorrect: false
    });
    return ++this.#testRecordsLastIndex;
  }
  #updateTestRecord(i, testRecord) {
    this.#testRecords[i] = testRecord;
  }
  #getLastTestRecord() {
    return this.#testRecordsLastIndex >= 0 ? this.#testRecords[this.#testRecordsLastIndex] : null;
  }

  #setStatusText(str) {
    this.#sectionTestStatusText.textContent = str;
  }
  #setStatusBgColor(bgcol = null) {
    if (!bgcol || bgcol == "") {
      this.#sectionTestStatus.style.removeProperty("background-color");
    }
    else {
      this.#sectionTestStatus.style.backgroundColor = bgcol;
    }
  }

  #setQuestionText(str) {
    this.#txtTestQuestion.textContent = str;
  }

  #setAnswerCountText(str) {
    this.#txtAnswerCount.textContent = str;
  }

  #setTimerText(str) {
    this.#testTimeDisplay.textContent = str;
  }

  #disableNumpad() {
    this.#btnNumpads.forEach(btn => btn.setAttribute("disabled", ""));
  }
  #enableNumpad() {
    this.#btnNumpads.forEach(btn => btn.removeAttribute("disabled"));
  }

  #enableStartButton() {
    this.#startTestButton.removeAttribute("disabled");
  }
  #disableStartButton() {
    this.#startTestButton.setAttribute("disabled", "");
  }
  #showStartButton() {
    this.#startTestButton.style.removeProperty("display");
  }
  #hideStartButton() {
    this.#startTestButton.style.display = "none";
  }

  #showConfirmationDialog() {
    this.#startTestConfirmation.style.removeProperty("display");
  }
  #hideConfirmationDialog() {
    this.#startTestConfirmation.style.display = "none";
  }

  #enableStopButton() {
    this.#stopTestButton.removeAttribute("disabled");
  }
  #disableStopButton() {
    this.#stopTestButton.setAttribute("disabled", "");
  }
  #showStopButton() {
    this.#stopTestButton.style.removeProperty("display");
  }
  #hideStopButton() {
    this.#stopTestButton.style.display = "none";
  }

  #enableViewResultButton() {
    this.#btnViewResult.removeAttribute("disabled");
  }
  #disableViewResultButton() {
    this.#btnViewResult.setAttribute("disabled", "");
  }
  #showViewResultButton() {
    this.#btnViewResult.style.removeProperty("display");
  }
  #hideViewResultButton() {
    this.#btnViewResult.style.display = "none";
  }
}
