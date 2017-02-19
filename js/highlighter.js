var Observable = Rx.Observable

function setupHighlighter (reveal) {
  var updateHighlight$ = Observable.merge(
    Observable.fromEvent(reveal, 'slidechanged'),
    Observable.fromEvent(reveal, 'fragmentshown'),
    Observable.fromEvent(reveal, 'fragmenthidden')
  )

  updateHighlight$
    .map(function () {
      return {
        slideEl: reveal.getCurrentSlide(),
        fragmentIndex: Reveal.getState().indexf + 1
      }
    })
    .do(function (update) {
      update.slideEl
        .querySelectorAll('.highlighted')
        .forEach(function (el) {
          el.classList.remove('highlighted')
        })
    })
    .filter(function (update) {
      return !isNaN(update.fragmentIndex)
    })
    .subscribe(function (update) {
      update.slideEl
        .querySelectorAll('.hl-' + update.fragmentIndex)
        .forEach(function (el, i) {
          el.classList.add('highlighted')
        })
    })
}
