//jshint esversion:6
console.log("scripting page called");
// import { loggedinUser } from "./index.js";
let booked;
// const {loggedinUser} = require('./index.js')


function myFunction(x) {

// console.log("x from server called: " +x);

// console.log("logged in user called from scripting: "+ loggedinUser);
//console.log("func called");
booked = x;
// window.alert(booked);
console.log("booked: "+ booked);

return x;

}

function getVal(book){
    return booked;
}

module.exports = {
    myFunction: myFunction,
    booked:booked,
    getVal: getVal
    
};
