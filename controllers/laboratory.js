const Lab = require('../models/laboratories.js');

function labSeats(seatNum, date, time,) {
    let seats = [];

  
  
    for(i = 1; i <= seatNum; i++) {
      seats.push({SlotID: i});
    }
  
    const reservationData = seats.map(seat => ({
      UserID: "", // Default value for UserID
      SlotID: seat.SlotID,
      isOccupied: false, // Default value for isOccupied
      date: date, // Default value for date
      time: time // Default value for time
    }));
  
    return reservationData; 
}
  
async function createSampleLabs() {
    sampleLabData1 = labSeats(20);
    sampleLabData2 = labSeats(25);
    sampleLabData3 = labSeats(25);
    sampleLabData4 = labSeats(15);
    sampleLabData5 = labSeats(20);
  
    const sampleLabs = [
      { id:1, name: 'Lab 1', capacity: 20, reservationData: sampleLabData1},
      { id:2, name: 'Lab 2', capacity: 25, reservationData: sampleLabData2},
      { id:3, name: 'Lab 3', capacity: 25, reservationData: sampleLabData3},
      { id:4, name: 'Lab 4', capacity: 15, reservationData: sampleLabData4},
      { id:5, name: 'Lab 5', capacity: 20, reservationData: sampleLabData5},
    ]; 
  
    try {
        await Lab.insertMany(sampleLabs)
        .then(result => {
           console.log('Sample reservations inserted successfully');
           console.log('Reservations added to lab successfully');
        })
    } catch (error) {
      console.error('Error inserting sample labs', error);
    }
}

async function createNewReservationList(labName, date, time) {
    const existingLab = await Lab.findOne({name: labName}); // looks for laboratory in the database to add reservation list to
    
    let newReservationList = labSeats(existingLab.capacity, date, time); // creates the new list of seats for the requested date and time

    try {
        await Lab.findOneAndUpdate(
          { name: labName }, // find a lab with the given name
          { $push: { reservationData: {reservationList: newReservationList} } }, // push the new reservation list into the reservationData array
          { new: true } // return the updated document
      );
    } catch(error) {
        console.error('Error inserting new reservation list', error);
    }

    return newReservationList;
}

async function checkExistingReservationList(selectedLab, labName, date, time) {
    if(selectedLab.length == 0 ) { // if reservation list we're looking of is null
        selectedLab = await createNewReservationList(labName, date, time);
        console.log("null");
        console.log("created new reservation list for " + date, "at " + time);
    } 
    return selectedLab;
}

module.exports = {checkExistingReservationList}