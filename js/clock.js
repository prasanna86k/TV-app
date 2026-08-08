const clockSize = 365; // same as CSS circle size
const radius = (clockSize / 2) - 8;


function updateClock(){

    const now = new Date();


    let h = String(now.getHours()).padStart(2,'0');
    let m = String(now.getMinutes()).padStart(2,'0');
    let s = String(now.getSeconds()).padStart(2,'0');


    document.getElementById("digitalTime").textContent =
        `${h}:${m}:${s}`;


    // Smooth seconds movement

    const milliseconds = now.getMilliseconds();

    const seconds =
        now.getSeconds() + milliseconds / 1000;


    const angle = seconds * 6 - 90;


    const x =
        Math.cos(angle * Math.PI / 180) * radius;

    const y =
        Math.sin(angle * Math.PI / 180) * radius;


    // document.getElementById("secondDot").style.transform =
    //     `translate(${x}px, ${y}px)`;


    requestAnimationFrame(updateClock);
}


updateClock();