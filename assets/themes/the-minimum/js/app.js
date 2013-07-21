// hide and show navigation on scroll
$(window).scroll(function() {
  updateGoTop();
});
function updateGoTop() {
  $gotop = $('.gotop');
  if ($(window).scrollTop() > 240) {
    $gotop.animate({opacity: 'show'});
  } else {
    $gotop.animate({opacity: 'hide'});
  }
}
updateGoTop();

// portfolio image behaviour
