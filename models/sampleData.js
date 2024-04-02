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

  const reservationData = seats.map(seat => ({
    UserID: "", // Default value for UserID
    SlotID: seat.SlotID,
    isOccupied: false, // Default value for isOccupied
    date: "", // Default value for date
    time: "" // Default value for time
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

async function createSampleReservations() {
  // Define sample reservations
  const sampleReservations = [
    { LabName: "Lab 1", SlotID: 1, isOccupied: true},
    { LabName: "Lab 1", SlotID: 2 },
    { LabName: "Lab 1", SlotID: 3 },
    { LabName: "Lab 1", SlotID: 4 },
    { LabName: "Lab 1", SlotID: 5 },
    { LabName: "Lab 1", SlotID: 6 },
    { LabName: "Lab 1", SlotID: 7 },
    { LabName: "Lab 1", SlotID: 8 },
    { LabName: "Lab 1", SlotID: 9 },
    { LabName: "Lab 1", SlotID: 10, isOccupied: true},
    { LabName: "Lab 1", SlotID: 11 },
    { LabName: "Lab 1", SlotID: 12 },
    { LabName: "Lab 1", SlotID: 13 },
    { LabName: "Lab 1", SlotID: 14 },
    { LabName: "Lab 1", SlotID: 15, isOccupied: true },
    { LabName: "Lab 1", SlotID: 16 },
    { LabName: "Lab 1", SlotID: 17 },
    { LabName: "Lab 1", SlotID: 18 },
    { LabName: "Lab 1", SlotID: 19 },
    { LabName: "Lab 1", SlotID: 20, isOccupied: true},
    { LabName: "Lab 1", SlotID: 21 },
    { LabName: "Lab 1", SlotID: 22, isOccupied: true},
    { LabName: "Lab 1", SlotID: 23 },
    { LabName: "Lab 1", SlotID: 24 },
    { LabName: "Lab 1", SlotID: 25 },
    // Add more sample reservations as needed

    { LabName: "Lab 2", SlotID: 1,},
    { LabName: "Lab 2", SlotID: 2 },
    { LabName: "Lab 2", SlotID: 3 },
    { LabName: "Lab 2", SlotID: 4 },
    { LabName: "Lab 2", SlotID: 5 },
    { LabName: "Lab 2", SlotID: 6 },
    { LabName: "Lab 2", SlotID: 7 },
    { LabName: "Lab 2", SlotID: 8 },
    { LabName: "Lab 2", SlotID: 9 },
    { LabName: "Lab 2", SlotID: 10,},
    { LabName: "Lab 2", SlotID: 11 },
    { LabName: "Lab 2", SlotID: 12 },
    { LabName: "Lab 2", SlotID: 13 },
    { LabName: "Lab 2", SlotID: 14 },
    { LabName: "Lab 2", SlotID: 15,},
    { LabName: "Lab 2", SlotID: 16 },
    { LabName: "Lab 2", SlotID: 17 },
    { LabName: "Lab 2", SlotID: 18 },
    { LabName: "Lab 2", SlotID: 19 },
    { LabName: "Lab 2", SlotID: 20,},
    { LabName: "Lab 2", SlotID: 21 },
    { LabName: "Lab 2", SlotID: 22,},
    { LabName: "Lab 2", SlotID: 23 },
    { LabName: "Lab 2", SlotID: 24 },
    { LabName: "Lab 2", SlotID: 25 },
  ];

  // Insert sample reservations into the database
  try {
    await Reservations.insertMany(sampleReservations);
    console.log('Sample reservations inserted successfully');
  } catch (error) {
    console.error('Error inserting sample reservations', error);
  }
}

// Export the functions
module.exports = { createSampleUsers, createSampleLabs, createSampleReservations };
