const db = require("../db");
const destinations = [
  "Rome",
  "Berlin",
  "New York City",
  "Los Angeles",
  "Madrid",
  "London",
  "Athens",
  "Sydney",
  "Tokyo",
  "Barcelona",
];
const typesOfVacation = {
  1: "Culinary",
  2: "Basketball",
  3: "Football",
  4: "Relax",
  5: "Road trip",
};
const typeKeys = Object.keys(typesOfVacation)
  .map((key) => parseInt(key))
  .filter((key) => !isNaN(key));

const destinationValid = (dest) => {
  return destinations.includes(dest);
};

const typesOfVacationValid = (key) => {
  return typeKeys.includes(key);
};