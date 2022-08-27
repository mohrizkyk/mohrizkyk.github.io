window.addEventListener('load', (e) => {
  new SectionController(
    document.querySelectorAll('.section-main'),
    document.querySelectorAll('.section-nav-btn')
  ).init();

  new TestSettingsController(
    document.querySelector('#settings--question-size'),
    document.querySelector('#settings--btn-size'),
    document.querySelectorAll('[name="settings--key-layout"]'),
    document.querySelectorAll('.btn-numpad.elem-preview'),
    document.querySelectorAll('.txt-question.elem-preview'),
    document.querySelectorAll('.btn-numpad.elem-test'),
    document.querySelectorAll('.txt-question.elem-test')
  ).init();

  new TestController({
    sectionTestStatus: document.querySelector('#section-test-status'),
    sectionTestStatusText: document.querySelector('#section-test-status-text'),
    startTestConfirmation: document.querySelector('#test-start-confirmation'),
    startTestButton: document.querySelector('#test--start-test'),
    stopTestButton: document.querySelector('#test--stop-test'),
    testTimeDisplay: document.querySelector('#txt-test-time'),
    btnNumpads: document.querySelectorAll('.btn-numpad.elem-test'),
    txtTestQuestion: document.querySelector('#txt-test-question'),
    txtAnswerCount: document.querySelector('#test--answer-count'),
    btnViewResult: document.querySelector('#test--view-result'),
    resultSummary: new ResultSummary({
      txtStartTime: document.querySelector('#overall-perf--start-time'),
      txtEndTime: document.querySelector('#overall-perf--end-time'),
      txtDuration: document.querySelector('#overall-perf--duration'),
      txtStdDev1Upper: document.querySelector('#result--txt-stddev-1-upper'),
      txtStdDev1Lower: document.querySelector('#result--txt-stddev-1-lower'),
      txtStdDev1Value: document.querySelector('#result--txt-stddev-1-value'),
      txtStdDev1Status: document.querySelector('#result--txt-stddev-1-status'),
      txtStdDev2Upper: document.querySelector('#result--txt-stddev-2-upper'),
      txtStdDev2Lower: document.querySelector('#result--txt-stddev-2-lower'),
      txtStdDev2Value: document.querySelector('#result--txt-stddev-2-value'),
      txtStdDev2Status: document.querySelector('#result--txt-stddev-2-status'),
      txtStdDev3Upper: document.querySelector('#result--txt-stddev-3-upper'),
      txtStdDev3Lower: document.querySelector('#result--txt-stddev-3-lower'),
      txtStdDev3Value: document.querySelector('#result--txt-stddev-3-value'),
      txtStdDev3Status: document.querySelector('#result--txt-stddev-3-status'),
      txtStdDevConclusion: document.querySelector('#result--txt-stddev-conclusion'),
      txtRegressionConclusion1: document.querySelector('#result--txt-regression-conclusion-1'),
      txtRegressionConclusion2: document.querySelector('#result--txt-regression-conclusion-2')
    }),
    resultOverallResponseTime: new ResultPerformance(
      document.querySelector('#overall-perf--total'),
      document.querySelector('#overall-perf--correct'),
      document.querySelector('#overall-perf--wrong'),
      document.querySelector('#overall-perf--accuracy'),
      document.querySelector('#overall-perf--fastest'),
      document.querySelector('#overall-perf--slowest'),
      document.querySelector('#overall-perf--average'),
      document.querySelector('#overall-perf--chart').getContext('2d')
    ),
    resultLeftResponseTime: new ResultPerformance(
      document.querySelector('#left-perf--total'),
      document.querySelector('#left-perf--correct'),
      document.querySelector('#left-perf--wrong'),
      document.querySelector('#left-perf--accuracy'),
      document.querySelector('#left-perf--fastest'),
      document.querySelector('#left-perf--slowest'),
      document.querySelector('#left-perf--average'),
      document.querySelector('#left-perf--chart').getContext('2d')
    ),
    resultRightResponseTime: new ResultPerformance(
      document.querySelector('#right-perf--total'),
      document.querySelector('#right-perf--correct'),
      document.querySelector('#right-perf--wrong'),
      document.querySelector('#right-perf--accuracy'),
      document.querySelector('#right-perf--fastest'),
      document.querySelector('#right-perf--slowest'),
      document.querySelector('#right-perf--average'),
      document.querySelector('#right-perf--chart').getContext('2d')
    ),
    linkDownloadCsv: document.querySelector('#result--download-csv'),
    linkDownloadJson: document.querySelector('#result--download-json')
  }).init();
});
