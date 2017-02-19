var Observable = Rx.Observable

// Helper functions
function map (arrayLike, fn) {
  return Array.prototype.map.call(arrayLike, fn)
}

function selectSource (sources, index) {
  while (!sources.hasOwnProperty(index) && index > 0) {
    index--
  }

  return sources[index]
}

function sourcesAreEqual (src1, src2) {
  var commonLength = Math.min(src1.length, src2.length)

  return src1.slice(-commonLength) === src2.slice(-commonLength)
}

// Main function
function setupFragmentSrc (reveal) {
  var slideEl$ = Observable.merge(
      Observable.fromEvent(reveal, 'ready'),
      Observable.fromEvent(reveal, 'slidechanged')
    )
    .map(function (slide) {
      return reveal.getCurrentSlide()
    })

  var fragment$ = Observable
    .merge(
      Observable.fromEvent(reveal, 'fragmentshown'),
      Observable.fromEvent(reveal, 'fragmenthidden')
    )
    .startWith(1)
    .map(function () {
      return Reveal.getState().indexf + 1
    })
    .share()

  slideEl$
    .switchMap(function (slideEl) {
      var elements = slideEl.querySelectorAll('[data-fragment-src]')

      elements = map(elements, function (element) {
        return {
          element: element,
          sources: JSON.parse(element.getAttribute('data-fragment-src'))
        }
      })

      return fragment$.mergeMapTo(elements, function (fragmentIndex, element) {
        return Object.assign({},
          element,
          { fragmentIndex: fragmentIndex }
        )
      })
    })

    .map(function (update) {
      return Object.assign({
        source: selectSource(update.sources, update.fragmentIndex)
      }, update)
    })

    .filter(function (update) {
      return !sourcesAreEqual(update.element.src, update.source)
    })

    .subscribe(
      function (update) {
        update.element.src = update.source
      },
      function error (err) {
        throw err
      }
  )
}
