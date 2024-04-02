const Lab = require('../models/laboratories.js');


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

async function availableCapacity(selectedLab) {
    let counter = 0;

    for(let i = 0; i < selectedLab.length; i++) {
        if(selectedLab[i].isOccupied) {
            counter++;
        }
    }

    return counter;
}

async function updateDetails(labDetails, usage) {
    if(usage == labDetails.capcity) {
        labDetails.status = "Full";
    } 
    return labDetails;
} 

async function createReservation(UserID, SlotID, labName, date, time){

    // find the specific lab reservation list with the params labName date and time
    try {
        const updatedDocument = await Lab.findOneAndUpdate(
            { name: labName, "reservationData.reservationList.date": date, "reservationData.reservationList.time": time }, 
            { $inc: { "reservationData.reservationList.usage": 1} },
            { $set: { "reservationData.reservationList.UserID": UserID, "reservationData.reservationList.isOccupied": true } },
            { 
                arrayFilters: [{ "reservationList.reservationList.SlotID": SlotID, "reservationList.reservationList.reservation.isOccupied": false, }],
                new: true 
            }
        );

        await updatedDocument.save();

        if (updatedDocument) {
            console.log('Reservation updated successfully:', );
            console.log(updatedDocument);
            // The document was found and updated
        } else {
            console.log('No reservation found to update.');
            // No document was found that matches the criteria
        }
    } catch(error) {console.log(error);}
} 

module.exports = { getNextFiveWeekdays, updateDetails, availableCapacity, createReservation };
 

