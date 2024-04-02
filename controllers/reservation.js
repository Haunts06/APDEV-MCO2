const Handlebars = require('handlebars');

function customDate(day, date, month) {
    this.day = day;
    this.date = date;
    // this.monthStr = monthStr;
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

async function availableCapacity(Reservations) {
    let counter = 0
    for(const reservation of Reservations) {
        if(reservation.isOccupied) {
            counter++;
        }
    }

    return counter;
}

Handlebars.registerHelper('renderSlots', function(selectedData, options) {
    let output = '';
    const reservationData = selectedData.reservationData;
    console.log(selectedData.reservationData);
    reservationData.forEach(slot => {
        if (slot.isOccupied) {
            output += `<div class="grid-status-item occupied" id="${slot.SlotID}">${slot.SlotID}</div>`;
        } else {
            output += `<button type="submit" class="grid-status-item" id="${slot.SlotID}" name="SlotID" value="${slot.SlotID}">${slot.SlotID}</button>`;
        }
    });
    return output;
});

module.exports = { availableCapacity, getNextFiveWeekdays, availableCapacity };
 

