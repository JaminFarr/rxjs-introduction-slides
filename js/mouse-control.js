
function setupMouseControl (reveal) {
  window.addEventListener("contextmenu", function(e) { e.preventDefault(); }, false)
  window.addEventListener("mousedown", handleClick, false);

  function handleClick(e) {
    e.preventDefault();
    if(e.button === 0) reveal.next(); 
    if(e.button === 2) reveal.prev(); 
  }
}
