class ResultPerformance {
  #txtTotal;
  #txtCorrect;
  #txtWrong;
  #txtAccuracy;

  #txtFastest;
  #txtSlowest;
  #txtAverage;

  #chartContext;
  #chartData;
  #chartConfig;
  #chartChart;

  constructor(txtTotal,
              txtCorrect,
              txtWrong,
              txtAccuracy,
              txtFastest,
              txtSlowest,
              txtAverage,
              chartContext) {
    this.#txtTotal = txtTotal;
    this.#txtCorrect = txtCorrect;
    this.#txtWrong = txtWrong;
    this.#txtAccuracy = txtAccuracy;

    this.#txtFastest = txtFastest;
    this.#txtSlowest = txtSlowest;
    this.#txtAverage = txtAverage;

    this.#chartContext = chartContext;
    this.#chartData = {
      labels: [],
      datasets: [
        {
          label: 'Avg. Calculation Time (ms)',
          data: [],
          borderColor: 'rgba(255, 158, 158, 1)',
          backgroundColor: 'rgba(255, 158, 158, 1)',
          borderWidth: 2
        },
        {
          label: 'Calculation Time (ms)',
          data: [],
          borderColor: 'rgba(158, 158, 255, 1)',
          backgroundColor: 'rgba(158, 158, 255, 1)',
        },
        {
          label: 'Regression',
          data: [],
          borderColor: 'rgba(0, 0, 0, 0.38)',
          backgroundColor: 'rgba(0, 0, 0, 0.38)',
          borderWidth: 4
        }
      ]
    };
    this.#chartConfig = {
      type: 'line',
      data: this.#chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 31,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          title: {
            display: true,
            text: 'History',
            font: {
              family: "'PT Sans', sans-serif"
            }
          },
          subtitle: {
            display: true,
            position: 'bottom',
            text: ['* C/W/A = Correct/Wrong/Accuracy', '* Lower = Faster'],
            font: {
              family: "'PT Sans', sans-serif"
            }
          },
          legend: {
            display: false
          }
        },
        elements: {
          line: {
            borderWidth: 1
          },
          point: {
            radius: 0
          }
        },
        scales: {
          'x': {
            display: false
          }
        }
      }
    };
    this.#chartChart = new Chart(this.#chartContext, this.#chartConfig);
  }

  processRecords(args) {
    let {
      testStartTime,
      testRecords
    } = args;

    // clear records of previous data
    this.#clearData();

    let correct = 0;
    let wrong = 0;
    let accuracy = 0;
    let calculationTime = {
      sum: 0,
      count: 0,
      avg: null,
      arrAvg: [],
      fastest: Infinity,
      slowest: -Infinity
    }

    let n = testRecords.length;
    for (let i = 0 ; i < n ; i++) {
      calculationTime.sum += testRecords[i].calculationTime;
      calculationTime.count++;
      calculationTime.avg = Math.round(calculationTime.sum / calculationTime.count);
      calculationTime.arrAvg.push(calculationTime.avg);
      calculationTime.fastest = Math.min(testRecords[i].calculationTime, calculationTime.fastest);
      calculationTime.slowest = Math.max(testRecords[i].calculationTime, calculationTime.slowest);
      correct += testRecords[i].isCorrect ? 1 : 0;
      wrong += testRecords[i].isCorrect ? 0 : 1;
      accuracy = correct / calculationTime.count * 100;
      this.#pushData({
        testDuration: testRecords[i].answerTime - testStartTime,
        correct: correct,
        wrong: wrong,
        accuracy: accuracy,
        avgCalculationTime: calculationTime.avg,
        calculationTime: testRecords[i].calculationTime
      });
    }
    let regressionPoints = this.#calculateRegression(calculationTime.arrAvg);
    this.#addRegressionData(regressionPoints);

    this.#updateSummary({
      total: calculationTime.count,
      correct: correct,
      wrong: wrong,
      accuracy: accuracy,
      average: calculationTime.avg,
      fastest: calculationTime.fastest,
      slowest: calculationTime.slowest
    });

    this.#updateChart();
  }

  #updateSummary(args) {
    let {
      total,
      correct,
      wrong,
      accuracy,
      average,
      fastest,
      slowest
    } = args;

    this.#txtTotal.textContent = total.toLocaleString();
    this.#txtCorrect.textContent = correct.toLocaleString();
    this.#txtWrong.textContent = wrong.toLocaleString();
    this.#txtAccuracy.textContent = accuracy.toFixed(2);
    this.#txtFastest.textContent = fastest.toLocaleString();
    this.#txtSlowest.textContent = slowest.toLocaleString();
    this.#txtAverage.textContent = average.toLocaleString();
  }

  #clearData() {
    this.#chartData.labels = [];
    this.#chartData.datasets[0].data = [];
    this.#chartData.datasets[1].data = [];
    this.#chartData.datasets[2].data = [];
  }

  #pushData(args) {
    let {
      testDuration,
      correct,
      wrong,
      accuracy,
      avgCalculationTime,
      calculationTime
    } = args;

    let label = ``
      + `Test Duration: ${this.#millisecondToDurationString(testDuration)}\n`
      + `C/W/A: ${correct.toLocaleString()} / ${wrong.toLocaleString()} / ${accuracy.toFixed(2)}%`;

    this.#chartData.labels.push(label);
    this.#chartData.datasets[0].data.push(avgCalculationTime);
    this.#chartData.datasets[1].data.push(calculationTime);
  }

  #addRegressionData(regressionPoints) {
    this.#chartData.datasets[2].data = regressionPoints;
  }

  #updateChart() {
    this.#chartChart.update('normal');
  }

  #calculateRegression(data) {
    let n = data.length;
    let x = new Array(n).fill(0).map((_, i) => i + 1);
    let xSum = 0,
        ySum = 0,
        xySum = 0,
        xSqSum = 0;
    for (let i = 0 ; i < n ; i++) {
      xSum += x[i];
      ySum += data[i];
      xySum += x[i] * data[i];
      xSqSum += x[i]**2;
    }
    let m = (n * xySum - xSum * ySum) / (n * xSqSum - xSum**2);
    let b = (ySum - m * xSum) / n;
    return x.map((x) => m * x + b);
  }

  #millisecondToDurationString(elapsed) {
    let minute = ("" + Math.floor(elapsed / 60000)).padStart(2, "0");
    let second = ("" + Math.floor((elapsed % 60000) / 1000)).padStart(2, "0");
    let millisecond = ("" + (elapsed % 1000)).padStart(3, "0");
    return `${minute}:${second}.${millisecond}`;
  }
}
