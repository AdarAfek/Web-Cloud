const db = require("../db");
const destinations = [
  "Rome",
  "Berlin",
  "New York City",
  "Los Angles",
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
const typeKeys= object.keys(typesOfVacation).map(key=> parseInt(key)).filter(key=>!isNaN(key));

const destinationValid = (dest)=>{
    if(destinations.includes(dest)){
        return true;
    }
    else return false;
}

const typesOfVacationValid = (key)=>{
    if(typeKeys.includes(key)){
        return true;
    }
    else return false;
}