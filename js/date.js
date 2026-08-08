function updateDate() {

    const now = new Date();

    document.getElementById("day").textContent =
        now.toLocaleDateString("en-US", {
            weekday: "long"
        });

    document.getElementById("date").textContent =
        now.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

updateDate();