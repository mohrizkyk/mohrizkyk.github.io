class ResultSummary {
  #txtStartTime;
  #txtEndTime;
  #txtDuration;

  #txtStdDev1Upper;
  #txtStdDev1Lower;
  #txtStdDev1Value;
  #txtStdDev1Status;
  #txtStdDev2Upper;
  #txtStdDev2Lower;
  #txtStdDev2Value;
  #txtStdDev2Status;
  #txtStdDev3Upper;
  #txtStdDev3Lower;
  #txtStdDev3Value;
  #txtStdDev3Status;

  #txtStdDevConclusion;
  #txtRegressionConclusion1;
  #txtRegressionConclusion2;

  constructor(args) {
    let {
      txtStartTime,
      txtEndTime,
      txtDuration,
      txtStdDev1Upper,
      txtStdDev1Lower,
      txtStdDev1Value,
      txtStdDev1Status,
      txtStdDev2Upper,
      txtStdDev2Lower,
      txtStdDev2Value,
      txtStdDev2Status,
      txtStdDev3Upper,
      txtStdDev3Lower,
      txtStdDev3Value,
      txtStdDev3Status,
      txtStdDevConclusion,
      txtRegressionConclusion1,
      txtRegressionConclusion2
    } = args;

    this.#txtStartTime = txtStartTime;
    this.#txtEndTime = txtEndTime;
    this.#txtDuration = txtDuration;

    this.#txtStdDev1Upper = txtStdDev1Upper;
    this.#txtStdDev1Lower = txtStdDev1Lower;
    this.#txtStdDev1Value = txtStdDev1Value;
    this.#txtStdDev1Status = txtStdDev1Status;
    this.#txtStdDev2Upper = txtStdDev2Upper;
    this.#txtStdDev2Lower = txtStdDev2Lower;
    this.#txtStdDev2Value = txtStdDev2Value;
    this.#txtStdDev2Status = txtStdDev2Status;
    this.#txtStdDev3Upper = txtStdDev3Upper;
    this.#txtStdDev3Lower = txtStdDev3Lower;
    this.#txtStdDev3Value = txtStdDev3Value;
    this.#txtStdDev3Status = txtStdDev3Status;

    this.#txtStdDevConclusion = txtStdDevConclusion;
    this.#txtRegressionConclusion1 = txtRegressionConclusion1;
    this.#txtRegressionConclusion2 = txtRegressionConclusion2;
  }

  processRecords(args) {
    let {
      testStartTime,
      testEndTime,
      testRecords
    } = args;

    let startTime = testStartTime;
    let endTime = testEndTime;
    let duration = endTime - startTime;
    let calculationTime = {
      count: 0,
      sum: 0,
      avg: null,
      arrAvg: [],
      sumSqDev: 0,
      stdDev: null,
    };
    let empiricalRule = {
      "1": {
        count: 0,
        upper: null,
        lower: null,
        percentage: 0,
        isPass: false
      },
      "2": {
        count: 0,
        upper: null,
        lower: null,
        percentage: 0,
        isPass: false
      },
      "3": {
        count: 0,
        upper: null,
        lower: null,
        percentage: 0,
        isPass: false
      }
    };

    let totalData = testRecords.length;
    for (let i = 0 ; i < totalData ; i++) {
      calculationTime.count++;
      calculationTime.sum += testRecords[i].calculationTime;
      calculationTime.arrAvg.push(calculationTime.sum / calculationTime.count);
    }
    calculationTime.avg = calculationTime.sum / totalData;
    for (let i = totalData - 1 ; i >= 0 ; i--) {
      calculationTime.sumSqDev += (testRecords[i].calculationTime - calculationTime.avg)**2;
    }
    calculationTime.stdDev = Math.sqrt(calculationTime.sumSqDev / totalData);
    empiricalRule["1"].upper = Math.round(calculationTime.avg + calculationTime.stdDev);
    empiricalRule["2"].upper = Math.round(calculationTime.avg + calculationTime.stdDev * 2);
    empiricalRule["3"].upper = Math.round(calculationTime.avg + calculationTime.stdDev * 3);
    empiricalRule["1"].lower = Math.round(calculationTime.avg - calculationTime.stdDev);
    empiricalRule["2"].lower = Math.round(calculationTime.avg - calculationTime.stdDev * 2);
    empiricalRule["3"].lower = Math.round(calculationTime.avg - calculationTime.stdDev * 3);
    empiricalRule["1"].lower = Math.max(0, empiricalRule["1"].lower);
    empiricalRule["2"].lower = Math.max(0, empiricalRule["2"].lower);
    empiricalRule["3"].lower = Math.max(0, empiricalRule["3"].lower);
    for (let i = totalData - 1 ; i >= 0 ; i--) {
      empiricalRule["1"].count += empiricalRule["1"].lower <= testRecords[i].calculationTime && testRecords[i].calculationTime <= empiricalRule["1"].upper ? 1 : 0;
      empiricalRule["2"].count += empiricalRule["2"].lower <= testRecords[i].calculationTime && testRecords[i].calculationTime <= empiricalRule["2"].upper ? 1 : 0;
      empiricalRule["3"].count += empiricalRule["3"].lower <= testRecords[i].calculationTime && testRecords[i].calculationTime <= empiricalRule["3"].upper ? 1 : 0;
    }
    empiricalRule["1"].percentage = empiricalRule["1"].count / totalData * 100;
    empiricalRule["2"].percentage = empiricalRule["2"].count / totalData * 100;
    empiricalRule["3"].percentage = empiricalRule["3"].count / totalData * 100;
    empiricalRule["1"].isPass = empiricalRule["1"].percentage >= 68 - 0.005;
    empiricalRule["2"].isPass = empiricalRule["2"].percentage >= 95 - 0.005;
    empiricalRule["3"].isPass = empiricalRule["3"].percentage >= 99.7 - 0.005;

    let regressionRun = testRecords[totalData - 1].answerTime - testRecords[0].answerTime;
    let regressionPoints = this.#calculateRegression(calculationTime.arrAvg);
    let regressionRise = regressionPoints[regressionPoints.length - 1] - regressionPoints[0];
    let regressionAngle = Math.atan(regressionRise / regressionRun) * (180 / Math.PI);

    let empiricalConclusion = this.#createEmpiricalConclusion(
      empiricalRule["1"].isPass ? 1 : 0,
      empiricalRule["2"].isPass ? 1 : 0,
      empiricalRule["3"].isPass ? 1 : 0
    );
    let regressionConclusion = this.#createRegressionConclussion(regressionAngle);

    this.#updateSummary({
      startTime: startTime,
      endTime: endTime,
      duration: duration,
      stdDev1Upper: empiricalRule["1"].upper,
      stdDev2Upper: empiricalRule["2"].upper,
      stdDev3Upper: empiricalRule["3"].upper,
      stdDev1Lower: empiricalRule["1"].lower,
      stdDev2Lower: empiricalRule["2"].lower,
      stdDev3Lower: empiricalRule["3"].lower,
      stdDev1Value: empiricalRule["1"].percentage,
      stdDev2Value: empiricalRule["2"].percentage,
      stdDev3Value: empiricalRule["3"].percentage,
      stdDev1Status: empiricalRule["1"].isPass,
      stdDev2Status: empiricalRule["2"].isPass,
      stdDev3Status: empiricalRule["3"].isPass,
      empiricalConclusion: empiricalConclusion,
      regressionConclusion1: regressionConclusion.stability,
      regressionConclusion2: regressionConclusion.performance
    });
  }

  #updateSummary(args = {}) {
    let {
      startTime,
      endTime,
      duration,
      stdDev1Upper,
      stdDev1Lower,
      stdDev1Value,
      stdDev1Status,
      stdDev2Upper,
      stdDev2Lower,
      stdDev2Value,
      stdDev2Status,
      stdDev3Upper,
      stdDev3Lower,
      stdDev3Value,
      stdDev3Status,
      empiricalConclusion,
      regressionConclusion1,
      regressionConclusion2
    } = args;

    this.#txtStartTime.textContent = this.#timestampToDateTimeString(startTime);
    this.#txtEndTime.textContent = this.#timestampToDateTimeString(endTime);
    this.#txtDuration.textContent = this.#millisecondToDurationString(duration);

    this.#txtStdDev1Upper.textContent = stdDev1Upper.toLocaleString();
    this.#txtStdDev1Lower.textContent = stdDev1Lower.toLocaleString();
    this.#txtStdDev1Value.textContent = stdDev1Value.toFixed(2);
    this.#txtStdDev1Status.textContent = stdDev1Status ? "PASS" : "NOT PASS";
    this.#txtStdDev1Status.style.color = stdDev1Status ? "#008a00" : "#eb0000";

    this.#txtStdDev2Upper.textContent = stdDev2Upper.toLocaleString();
    this.#txtStdDev2Lower.textContent = stdDev2Lower.toLocaleString();
    this.#txtStdDev2Value.textContent = stdDev2Value.toFixed(2);
    this.#txtStdDev2Status.textContent = stdDev2Status ? "PASS" : "NOT PASS";
    this.#txtStdDev2Status.style.color = stdDev2Status ? "#008a00" : "#eb0000";

    this.#txtStdDev3Upper.textContent = stdDev3Upper.toLocaleString();
    this.#txtStdDev3Lower.textContent = stdDev3Lower.toLocaleString();
    this.#txtStdDev3Value.textContent = stdDev3Value.toFixed(2);
    this.#txtStdDev3Status.textContent = stdDev3Status ? "PASS" : "NOT PASS";
    this.#txtStdDev3Status.style.color = stdDev3Status ? "#008a00" : "#eb0000";

    this.#txtStdDevConclusion.textContent = empiricalConclusion;

    this.#txtRegressionConclusion1.textContent = regressionConclusion1;
    this.#txtRegressionConclusion2.textContent = regressionConclusion2;
  }

  #createEmpiricalConclusion(x, y, z) {
    let str = "" + x + y + z;
    switch(str) {
      case '111': return 'a very consistent'; break;
      case '110': return 'a consistent'; break;
      case '101': return 'an almost consistent'; break;
      case '100': return 'a fairly consistent'; break;
      case '011':
      case '010':
      case '001': return 'an almost fairly consistent'; break;
      case '000': return 'an inconsistent'; break;
      default: return 'a mysterious'; break;
    }
  }

  #createRegressionConclussion(regressionAngle) {
    // https://geographyfieldwork.com/SlopeSteepnessIndex.htm
    // +===================+====================+
    // |                   | Approximate Angles |
    // | Terms             +==========+=========+
    // |                   |      Min | Max     |
    // +===================+==========+=========+
    // | Level             |        0 | 0       |
    // | Nearly level      |      0.3 | 1.1     |
    // | Very gentle slope |      1.1 | 3       |
    // | Gentle slope      |        3 | 5       |
    // | Moderate slope    |        5 | 8.5     |
    // | Strong slope      |      8.5 | 16.5    |
    // | Very strong slope |     16.5 | 24      |
    // | Extreme slope     |       24 | 35      |
    // | Steep slope       |       35 | 45      |
    // | Very steep slope  |       45 |         |
    // +===================+==========+=========+
    let regressionConclusion = {
      stability: "",
      performance: ""
    };

    let absRegressionAngle = Math.abs(regressionAngle);
    if (absRegressionAngle < 0.3) {
      regressionConclusion.stability = 'very stable';
    }
    else if (absRegressionAngle < 1.1) {
      regressionConclusion.stability = 'stable';
    }
    else if (absRegressionAngle < 3) {
      regressionConclusion.stability = 'relatively stable';
    }
    else if (absRegressionAngle < 5) {
      regressionConclusion.stability = 'gently changing';
    }
    else if (absRegressionAngle < 8.5) {
      regressionConclusion.stability = 'moderately changing';
    }
    else if (absRegressionAngle < 24) {
      regressionConclusion.stability = 'changing';
    }
    else {
      regressionConclusion.stability = 'rapidly changing';
    }

    // set sensitivity to 5% of 0.3 degree
    if (regressionAngle > 0.015) {
      regressionConclusion.performance = 'a decreasing';
    }
    else if (regressionAngle < 0.015) {
      regressionConclusion.performance = 'an increasing';
    }
    else {
      regressionConclusion.performance = 'a steady';
    }

    return regressionConclusion;
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

  #timestampToDateTimeString(timestamp) {
    let tzOffset = new Date().getTimezoneOffset() * 60000;
    let date = new Date(timestamp - tzOffset);
    return date.toISOString().split('T').join(' ').slice(0, -1);
  }
}
