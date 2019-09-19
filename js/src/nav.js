$(function() {

  $('#lownav a, #ctabox a, #fullnav a').on('click tap', function(e) {
    e.preventDefault();
    var hash = this.hash;
    var $target = $(hash);
    console.log($target.offset().top);
    $('html, body').animate({ scrollTop: $target.offset().top }, 1000);
  });

  $('#mnav_hamburger').on('click tap', function(e) {
    e.preventDefault();
    $('#mnav_overlay').fadeToggle(200);
  });

  $('#fullnav a').on('click tap', function() {
    $('#mnav_overlay').fadeToggle(200);
  });

  $('.highlights').on('click tap', function() {
    var getDetail = $(this).data('highlight');
    $('.details').fadeOut(200);
    $('#' + getDetail).fadeIn(200);
  });



});