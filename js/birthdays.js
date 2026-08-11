document.addEventListener("DOMContentLoaded", () => {

    const birthdayList =
        document.getElementById("birthdayList");

    if (!birthdayList) return;


    /* ============================================================
       MODAL ELEMENTS
    ============================================================ */

    const birthdayModal =
        document.getElementById("birthdayModal");

    const birthdayModalClose =
        document.getElementById("birthdayModalClose");

    const birthdayModalPhoto =
        document.getElementById("birthdayModalPhoto");

    const birthdayModalName =
        document.getElementById("birthdayModalName");

    const birthdayModalDate =
        document.getElementById("birthdayModalDate");

    const birthdayModalAge =
        document.getElementById("birthdayModalAge");

    const birthdayModalCountdown =
        document.getElementById("birthdayModalCountdown");


    /* ============================================================
       LOAD BIRTHDAYS
    ============================================================ */

    fetch("./data/birthdays.json")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Could not load birthdays.json"
                );
            }

            return response.json();
        })


        /* ========================================================
           PROCESS BIRTHDAYS
        ======================================================== */

        .then(birthdays => {

            const today = new Date();


            /*
             * Create today's date at midnight.
             * This prevents the current time from affecting
             * the birthday calculation.
             */

            const todayDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );


            /* ====================================================
               PREPARE BIRTHDAYS
            ==================================================== */

            const upcomingBirthdays = birthdays

                .map(person => {

                    const [
                        year,
                        month,
                        day
                    ] = person.date
                        .split("-")
                        .map(Number);


                    /*
                     * Create this year's birthday.
                     */

                    let nextBirthday = new Date(
                        today.getFullYear(),
                        month - 1,
                        day
                    );


                    /*
                     * If birthday has already passed,
                     * move it to next year.
                     *
                     * If birthday is TODAY,
                     * it remains TODAY.
                     */

                    if (nextBirthday < todayDate) {

                        nextBirthday = new Date(
                            today.getFullYear() + 1,
                            month - 1,
                            day
                        );
                    }


                    /*
                     * Calculate days until birthday.
                     */

                    const daysUntil = Math.round(
                        (
                            nextBirthday - todayDate
                        ) /
                        (1000 * 60 * 60 * 24)
                    );


                    return {

                        ...person,

                        birthYear: year,
                        birthMonth: month,
                        birthDay: day,

                        nextBirthday,
                        daysUntil

                    };

                })


                /* =================================================
                   ONLY SHOW BIRTHDAYS WITHIN 7 DAYS
                ================================================= */

                .filter(person => {

                    return (
                        person.daysUntil >= 0 &&
                        person.daysUntil <= 7
                    );

                })


                /* =================================================
                   SORT BY UPCOMING DATE
                ================================================= */

                .sort((a, b) => {

                    return (
                        a.nextBirthday -
                        b.nextBirthday
                    );

                });


            /* ====================================================
               CLEAR LIST
            ==================================================== */

            birthdayList.innerHTML = "";


            /* ====================================================
               NO BIRTHDAYS
            ==================================================== */

            if (upcomingBirthdays.length === 0) {

                birthdayList.innerHTML = `
                    <div class="birthday-empty">
                        No birthdays in the next 7 days
                    </div>
                `;

                return;
            }


            /* ====================================================
               CREATE BIRTHDAY ITEMS
            ==================================================== */

            upcomingBirthdays.forEach(person => {

                const item =
                    document.createElement("div");


                item.className =
                    "birthday-item";


                /* =================================================
                   TODAY'S BIRTHDAY
                ================================================= */

                if (person.daysUntil === 0) {

                    item.classList.add(
                        "today-birthday"
                    );
                }


                /* =================================================
                   FORMAT DATE
                ================================================= */

                const formattedDate =
                    person.nextBirthday.toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "long"
                        }
                    );


                /* =================================================
                   COUNTDOWN
                ================================================= */

                let daysText;


                if (person.daysUntil === 0) {

                    daysText = "Today";

                }

                else if (person.daysUntil === 1) {

                    daysText = "Tomorrow";

                }

                else {

                    daysText =
                        `${person.daysUntil} days`;

                }


                /* =================================================
                   ITEM HTML
                ================================================= */

                item.innerHTML = `

                    <div class="birthday-person">

                        <img
                            class="birthday-photo"
                            src="${person.photo}"
                            alt="${person.name}"
                            loading="lazy"
                        >

                        <div class="birthday-info">

                            <strong>
                                ${person.name}
                            </strong>

                            <small>
                                ${formattedDate}
                            </small>

                        </div>

                    </div>

                    <span>
                        ${daysText}
                    </span>

                `;


                /* =================================================
                   CLICK → OPEN MODAL
                ================================================= */

                item.addEventListener(
                    "click",
                    () => {
                        openBirthdayModal(person);
                    }
                );


                birthdayList.appendChild(item);

            });

        })


        /* ========================================================
           ERROR HANDLING
        ======================================================== */

        .catch(error => {

            console.error(
                "Birthday list error:",
                error
            );


            birthdayList.innerHTML = `

                <div class="birthday-empty">
                    Unable to load birthdays
                </div>

            `;

        });


    /* ============================================================
       OPEN BIRTHDAY MODAL
    ============================================================ */

    function openBirthdayModal(person) {

        const today = new Date();


        /* ========================================================
           ORIGINAL BIRTH DATE
        ======================================================== */

        const birthDate = new Date(
            person.birthYear,
            person.birthMonth - 1,
            person.birthDay
        );


        /* ========================================================
           FULL BIRTHDAY
        ======================================================== */

        const fullBirthday =
            birthDate.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );


        /* ========================================================
           CALCULATE AGE
        ======================================================== */

        let age =
            today.getFullYear() -
            person.birthYear;


        const birthdayThisYear =
            new Date(
                today.getFullYear(),
                person.birthMonth - 1,
                person.birthDay
            );


        /*
         * If birthday hasn't happened yet this year,
         * subtract one year.
         */

        if (today < birthdayThisYear) {

            age--;

        }


        /* ========================================================
           COUNTDOWN TEXT
        ======================================================== */

        let countdownText;


        if (person.daysUntil === 0) {

            countdownText =
                "Birthday is today!";

        }

        else if (person.daysUntil === 1) {

            countdownText =
                "Birthday is tomorrow!";

        }

        else {

            countdownText =
                `${person.daysUntil} days until next birthday`;

        }


        /* ========================================================
           FILL MODAL
        ======================================================== */

        birthdayModalPhoto.src =
            person.photo;

        birthdayModalPhoto.alt =
            person.name;


        birthdayModalName.textContent =
            person.name;


        birthdayModalDate.textContent =
            fullBirthday;


        birthdayModalAge.textContent =
            `${age} years old`;


        birthdayModalCountdown.textContent =
            countdownText;


        /* ========================================================
           SHOW MODAL
        ======================================================== */

        birthdayModal.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* ============================================================
       CLOSE MODAL
    ============================================================ */

    function closeBirthdayModal() {

        birthdayModal.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";

    }


    /* ============================================================
       CLOSE BUTTON
    ============================================================ */

    if (birthdayModalClose) {

        birthdayModalClose.addEventListener(
            "click",
            closeBirthdayModal
        );

    }


    /* ============================================================
       CLICK OUTSIDE MODAL
    ============================================================ */

    if (birthdayModal) {

        birthdayModal.addEventListener(
            "click",
            event => {

                if (
                    event.target === birthdayModal
                ) {

                    closeBirthdayModal();

                }

            }
        );

    }


    /* ============================================================
       ESC KEY
    ============================================================ */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                birthdayModal &&
                birthdayModal.classList.contains("active")
            ) {

                closeBirthdayModal();

            }

        }
    );

});