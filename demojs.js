
function paragraph() {
    document.getElementById("paragraph").innerHTML = "Paragraph changed.";
}

function myfunction() {
    var price1 = 5;
    var price2 = 6;
    var total = price1 + price2;
    console.log(total);

    // You can create a const object:
    const car = { type: "Fiat", model: "500", color: "white" };

    // You can change a property:
    car.color = "red";

    // You can create a constant array:
    const cars = ["Saab", "Volvo", "BMW"];

    // You can change an element:
    cars[0] = "Toyota";

    var x = 5;
    var z = Math.pow(x, 2);   // result is 25
    console.log(z);
    var x = 16 + 4 + "Volvo";
    console.log("16 + 4 + Volvo = "+x);
    var x = "Volvo" + 16 + 4;
    console.log("Volvo + 16 + 4 = " + x);

    typeof "John"              // Returns "string"
    typeof 3.14                // Returns "number"
    typeof true                // Returns "boolean"
    typeof false               // Returns "boolean"
    typeof x                   // Returns "undefined" (if x has no value)

    typeof { name: 'John', age: 34 } // Returns "object"
    typeof [1, 2, 3, 4]             // Returns "object" (not "array", see note below)
    typeof null                  // Returns "object"
    typeof function myFunc() { }   // Returns "function"
}

function mult(p1, p2) {
    return p1 * p2;
}

function myfunction2() {
    var person = {
        firstName: "John",
        lastName: "Doe",
        id: 5566,
        fullName: function () {
            return this.firstName + " " + this.lastName;
        }
    };
    var txt = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var sln = txt.length;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude);
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    console.log(checkCookie);
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 30);
        }
    }
}
