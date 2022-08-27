window.addEventListener('load', (e) => {
  let syncer1 = new RetyperMultiSync();
  syncer1.listTextRewriter.push(
    new Retyper({
      element: document.querySelector('#banner-rewriteable-1-1'),
      onCycleFinish: syncer1.onCycleFinish.bind(syncer1)
    }),
    new Retyper({
      element: document.querySelector('#banner-rewriteable-1-2'),
      onCycleFinish: syncer1.onCycleFinish.bind(syncer1)
    })
  );
  syncer1.runCycle();

  new Retyper({
    element: document.querySelector('#banner-rewriteable-2')
  }).runCycle();
});
