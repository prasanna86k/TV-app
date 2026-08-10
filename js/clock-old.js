function updateClock() {

    const now = new Date();


    // =============================
    // LOCAL TIME - AM/PM
    // =============================

    const localTime = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    document.getElementById("digitalTime").textContent =
        localTime;


    // =============================
    // SRI LANKA TIME - AM/PM
    // =============================

    const sriLankaTime = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Colombo",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });

    document.getElementById("slTime").textContent =
        `${sriLankaTime}`;


    // Update every second
    setTimeout(updateClock, 1000);
}


updateClock();S