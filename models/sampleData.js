const User = require('./users.js');
const Lab = require('./laboratories.js');
const Reservations = require('./reservations.js');

function labSeats(seatNum) {
  let seats = [];


  for(i = 1; i <= seatNum; i++) {
    seats.push({SlotID: i});
  }

  const reservationList = seats.map(seat => ({
    UserID: "",
    SlotID: seat.SlotID,
    isOccupied: false, 
    date: "", 
    time: "" 
  }));

  return reservationList; 
}

async function createSampleLabs() {

  sampleLabData1 = labSeats(20);
  sampleLabData2 = labSeats(25);
  sampleLabData3 = labSeats(25);
  sampleLabData4 = labSeats(15);
  sampleLabData5 = labSeats(20);

  const sampleLabs = [
    { id:1, name: 'Lab 1', capacity: 20, },
    { id:2, name: 'Lab 2', capacity: 25, },
    { id:3, name: 'Lab 3', capacity: 25, },
    { id:4, name: 'Lab 4', capacity: 15, },
    { id:5, name: 'Lab 5', capacity: 20, },
  ]; 

  try {
      await Lab.deleteMany().then(result => {
        console.log('Previous sample reservations deleted successfully');
      });
      await Lab.insertMany(sampleLabs)
      .then(result => {
         console.log('Sample reservations inserted successfully');
      })
  } catch (error) {
    console.error('Error inserting sample labs', error);
  }
}

// Export the functions
module.exports = { createSampleUsers, createSampleLabs };
