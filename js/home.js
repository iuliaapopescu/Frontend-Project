var carousel = $('.carousel').children('div');
var index = 0;
var curr = 0;
var left = $('.left-button');
var right = $('.right-button');
var length = carousel.length;

carousel.each(function() {
    $(this).hide();
})

carousel.first().show();

setInterval(function() {
    if(curr == length - 1) {
        carousel.eq(curr).fadeOut('slow');
        carousel.eq(0).fadeIn('slow');
        curr = 0;
    }
    else {
        carousel.eq(curr).fadeOut('slow');
        carousel.eq(curr + 1).fadeIn('slow');
        curr += 1;
    }
}, 7000)

left.on('click', function() {
    if(curr == 0) {
        carousel.eq(curr).fadeOut('slow');
        carousel.eq(length - 1).fadeIn('slow');
        curr = length - 1;
    }
    else {
        carousel.eq(curr).fadeOut('slow');
        carousel.eq(curr - 1).fadeIn('slow');
        curr -= 1;
    }
})

right.on('click', function() {
    if(curr == length - 1) {
        carousel.eq(curr).fadeOut('slow');
        carousel.eq(0).fadeIn('slow');
        curr = 0;
    }
    else {
        carousel.eq(curr).fadeOut('slow');
        carousel.eq(curr + 1).fadeIn('slow');
        curr += 1;
    }
})