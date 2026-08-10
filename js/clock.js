/*
 * Dynamic greeting
 */

const currentHour = new Date().getHours();

let greeting;

if (currentHour >= 5 && currentHour < 12) {

    greeting = "Good Morning";

} else if (currentHour >= 12 && currentHour < 17) {

    greeting = "Good Afternoon";

} else if (currentHour >= 17 && currentHour < 21) {

    greeting = "Good Evening";

} else {

    greeting = "Good Night";
}


if (greetingText) {

    greetingText.textContent = greeting;

}

//Local clock
function updateLocalClock() {
    const now = new Date();

    // Time — HH:MM
    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    // Day — Sunday
    const day = now.toLocaleDateString("en-US", {
        weekday: "long"
    });

    // Date — 09 August 2026
    const date = now.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    // Update HTML
    document.getElementById("localTime").textContent = time;
    document.getElementById("localDay").textContent = day;
    document.getElementById("localDate").textContent = date;
}

// Run immediately
updateLocalClock();

// Update every minute
setInterval(updateLocalClock, 60000);

//-----------------------------------

//Sri Lanka Time
function updateSLClock() {
    const now = new Date();

    // Sri Lanka time — 12-hour format with AM/PM
    const slTime = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Colombo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    // Sri Lanka day and date
    const slDate = now.toLocaleDateString("en-US", {
        timeZone: "Asia/Colombo",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    // Update HTML
    document.getElementById("slTime").textContent = slTime;
    document.getElementById("slDate").textContent = slDate.replace(",", " ·");
}

// Run immediately
updateSLClock();

// Update every minute
setInterval(updateSLClock, 60000);