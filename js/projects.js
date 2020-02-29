// Progress-bar

var fillColor = '#bababa';
var emptyColor = '#1c1c1c';
var prev = 0;
var steps = document.querySelectorAll('.step');

function currentStep() {
    for(let i = 0; i < steps.length - 1; i++) {
        if(steps[i].style.backgroundColor !=
            steps[i + 1].style.backgroundColor) {
            return i;
        }
    }
    return steps.length - 1;
}

function activate(index) {
    for(let j = 0; j <= index; j++) {
        steps[j].style.backgroundColor = fillColor
    }
    for(let k = index + 1; k < steps.length; k++) {
        steps[k].style.backgroundColor = emptyColor
    }
}

if(localStorage.getItem('current') == null)
    localStorage.setItem('current', '0')

if(screen.width > 1024) {
    activate(parseInt(localStorage.getItem('current')))

    for(let i = 0; i < steps.length; i++) {
        if(i != parseInt(localStorage.getItem('current')))
            $('.step-content').children('div').eq(i).css('animation', '')
        else
            $('.step-content').children('div').eq(i).css('animation', 'slideIn 1s ease 0s normal 1 forwards running')
    }
}

document.addEventListener('keyup', function() {
    curr = currentStep()
    
    //$('.step-content').children('div').eq(prev).fadeOut(250)
    //$('.step-content').children('div').eq(curr).delay(250).fadeIn(250)
    $('.step-content').children('div').eq(prev).css('animation', '')
    $('.step-content').children('div').eq(curr).css('animation', 'slideIn 1s ease 0s normal 1 forwards running')
})

$('.steps').children('div').each(function() {
    $(this).on('click', function() {
        prev = currentStep()

        index = $(this).index($(this).classList)
        activate(index)

        curr = currentStep()
        localStorage.setItem('current', curr)
        
        //$('.step-content').children('div').eq(prev).fadeOut(250)
        //$('.step-content').children('div').eq(curr).delay(250).fadeIn(250)
        $('.step-content').children('div').eq(prev).css('animation', '')
        $('.step-content').children('div').eq(curr).css('animation', 'slideIn 1s ease 0s normal 1 forwards running')
    })
})

document.addEventListener('keydown', function() {
    index = 0;

    // A - D
    if(event.which >= 65 && event.which <= 68) {
        prev = currentStep();
        activate(index);
        localStorage.setItem('current', index);
    }

    index++;

    // E - H
    if(event.which >= 69 && event.which <= 72) {
        prev = currentStep();
        activate(index);
        localStorage.setItem('current', index);
    }

    index++;

    // I - L
    if(event.which >= 73 && event.which <= 76) {
        prev = currentStep();
        activate(index);
        localStorage.setItem('current', index);
    }

    index++;

    // M - P
    if(event.which >= 77 && event.which <= 80) {
        prev = currentStep();
        activate(index);
        localStorage.setItem('current', index);
    }

    index++;

    // Q - T
    if(event.which >= 81 && event.which <= 84) {
        prev = currentStep();
        activate(index);
        localStorage.setItem('current', index);
    }

    index++;

    // U - Z
    if(event.which >= 85 && event.which <= 90) {
        prev = currentStep();
        activate(index);
        localStorage.setItem('current', index);
    }

    // ArrowLeft
    if(event.which == 37 && currentStep()) {
        prev = currentStep();
        activate(prev - 1);
        localStorage.setItem('current', prev - 1);
    }

    // ArrowRight and Enter
    if(currentStep() != steps.length - 1)
        if(event.which == 39 || event.which == 13) {
            prev = currentStep();
            activate(prev + 1);
            localStorage.setItem('current', prev + 1);
        }
})
