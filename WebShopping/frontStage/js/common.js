let btnGoTop = $('.btnGoTop');
btnGoTop.click(function () {
    $('html,body').animate({
        scrollTop: 0
    }, 300);
});
$(window).scroll(function () {
    let s = $(document).scrollTop();
    if (s > 0) {
        btnGoTop.css({
            'opacity': '1',
            'visibility': 'visible'
        });
    } else {
        btnGoTop.css({
            'opacity': '0',
            'visibility': 'hidden'
        })
    }
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