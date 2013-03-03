$(window).scroll(function() {
  updateGoTop();
});

function updateGoTop() {
  $gotop = $('.gotop');
  if ($(window).scrollTop() > 280) {
    $gotop.animate({opacity: 'show'});
  } else {
    $gotop.animate({opacity: 'hide'});
  }
}

updateGoTop();
