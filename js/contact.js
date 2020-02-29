var week = 0

function myMap() {
    var mapProp= {
    center:new google.maps.LatLng(44.4268, 26.1025),
    zoom:15
    };
    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

window.onload = function() {
    markCurrentWeek()
    displayCurrentWeek()

    $('.up-bttn').on('click', function() {
        if(week != 1) {
            $('tr').eq(week).children().each(function() {
                $(this).removeClass('current-week')
            })

            $('tr').eq(week-1).children().each(function() {
                $(this).addClass('current-week')
            })

            week--
            displayCurrentWeek()
        }
    })

    $('.down-bttn').on('click', function() {
        if(week != $('tr').length - 1) {
            $('tr').eq(week).children().each(function() {
                $(this).removeClass('current-week')
            })

            $('tr').eq(week+1).children().each(function() {
                $(this).addClass('current-week')
            })

            week++
            displayCurrentWeek()
        }
    })
    
    var months = $('.months li a')
    for(let i = 0; i < months.length; i++) {
        months[i].href = "contact?month=" + i
    }
}

function markCurrentWeek(){
    var weeks = document.querySelectorAll('tr')
    var index = 0
    var currentWeek_ = 0
    weeks.forEach(week => {
        Array.prototype.forEach.call(week.children, day => {
            if(day.classList.contains('current-day')) {
                currentWeek_ = index
            }
        })
        index++
    })
    Array.prototype.forEach.call(weeks[currentWeek_].children, day => {
        day.classList.add('current-week')
    })
    week = currentWeek_
}

function displayCurrentWeek() {
    var days = $('td').children('.wrapper')
    var currentDays = $('td.current-week').children('.wrapper')

    days.each(function() {
        $(this).css('opacity', '0')
    })
    
    currentDays.each(function() {
        $(this).css('opacity', '1')
    })
}