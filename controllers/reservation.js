const Handlebars = require('handlebars');

function customDate(day, date, month) {
    this.day = day;
    this.date = date;
    this.month = month;
}

async function getNextFiveWeekdays() {
    const weekdays = [];
    let currentDate = new Date();

    // Ensure the current date is a weekday
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add the next 5 weekdays to the array
    for (let i = 0; i < 5; i++) {
        weekdays.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
        // Skip weekends
        while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    const nextDays = [];
    const weekdaysString = ["Mon", "Tues", "Wed", "Thurs", "Fri"];
    const monthString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    weekdays.forEach(element => {
        let date = new customDate(weekdaysString[element.getDay()-1], element.getDate(), monthString[element.getMonth()]);
        nextDays.push(date);
    });

    return nextDays;
}

async function availableCapacity(Laboratory) {
    let counter = 0
    for(const reservation of Laboratory.reservationData ) {
        if(reservation.isOccupied) {
            counter++;
        }
    }

    return counter;
}

module.exports = { availableCapacity, getNextFiveWeekdays, availableCapacity };
 

