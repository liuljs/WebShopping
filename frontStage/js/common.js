$(function () {
  var win = $(window), header = $('#header'), gotop = $('#gotop');
  win.on('resize scroll', function () {
    var bodyTop = $(this).scrollTop();
    if (bodyTop >= 300) {
      gotop.addClass('barscroll');
      header.removeClass('topscroll').addClass('barscroll');
    } else {
      gotop.removeClass('barscroll');
      header.removeClass('barscroll').addClass('topscroll');
    }
  }).trigger('resize scroll');

  gotop.on('click', function () {
    $('html, body').stop().animate({ scrollTop: 0 }, 1200);
  });

  $('#nav-icon').data('switch', 'open').on('click', function (e) {
    var $eleThis = $(this);
    $('#header .control-box').data('switch', 'open').removeClass('open');
    $('#header .control-list').removeClass('is-open');
    if ($eleThis.data('switch') == 'open') {
      $eleThis.data('switch', 'close').addClass('open');
      $('#header').addClass('is-open');
    } else {
      $eleThis.data('switch', 'open').removeClass('open');
      $('#header').removeClass('is-open');
    }
  });

  $('#header .control-box').data('switch', 'open').on('click', function (e) {
    var $eleThis = $(this);
    $('#nav-icon').data('switch', 'open').removeClass('open');
    $('#header').removeClass('is-open');
    if ($eleThis.data('switch') == 'open') {
      $eleThis.data('switch', 'close').addClass('open');
      $('#header .control-list').addClass('is-open');
    } else {
      $eleThis.data('switch', 'open').removeClass('open');
      $('#header .control-list').removeClass('is-open');
    }
  });

  $('.p-category .txt').data('switch', 'open').on('click', function (e) {
    var $eleThis = $(this);
    if ($eleThis.data('switch') == 'open') {
      $eleThis.data('switch', 'close');
      $('.p-category').addClass('is-open');
    } else {
      $eleThis.data('switch', 'open');
      $('.p-category').removeClass('is-open');
    }
  });

});

AOS.init({
  easing: 'ease-in-out-sine',
  duration: 900
});