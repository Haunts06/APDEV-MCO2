const User = require('./users.js');
const Lab = require('./laboratories.js');
const Reservations = require('./reservations.js');

async function createSampleUsers() {
  // Define sample users
  const sampleUsers = [
    { fname: 'Jillian', lname: 'Garcilan', id: '1234567', password: '123', email: 'garcilan@example.com', profilepic:"https://en.wikipedia.org/wiki/Kirby_%28character%29#/media/File:SSU_Kirby_artwork.png"},
  ];

  try {
    await User.insertMany(sampleUsers);
    console.log('Sample users inserted successfully');
  } catch (error) {
    console.error('Error inserting sample users', error);
  }
}

function labSeats(seatNum) {
  let seats = [];


  for(i = 1; i <= seatNum; i++) {
    seats.push({SlotID: i});
  }

  const reservationList = seats.map(seat => ({
    UserID: "", // Default value for UserID
    SlotID: seat.SlotID,
    isOccupied: false, // Default value for isOccupied
    date: "", // Default value for date
    time: "" // Default value for time
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
    { id:1, name: 'Lab 1', capacity: 20, reservationData: {reservationList: sampleLabData1}},
    { id:2, name: 'Lab 2', capacity: 25, reservationData: {reservationList: sampleLabData2}},
    { id:3, name: 'Lab 3', capacity: 25, reservationData: {reservationList: sampleLabData3}},
    { id:4, name: 'Lab 4', capacity: 15, reservationData: {reservationList: sampleLabData4}},
    { id:5, name: 'Lab 5', capacity: 20, reservationData: {reservationList: sampleLabData5}},
  ]; 
  // console.log(sampleLabData1);

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
