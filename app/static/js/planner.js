document.addEventListener("DOMContentLoaded", function () {

    const calendarEl = document.getElementById("calendar");

    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {

        initialView: "dayGridMonth",

        height: "auto",

        selectable: true,

        editable: true,

        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
        },

        buttonText: {
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day"
        },

        views: {
            dayGridMonth: {
                buttonText: "Month"
            },
            timeGridWeek: {
                buttonText: "Week"
            },
            timeGridDay: {
                buttonText: "Day"
            }
        },

        // Load events from FastAPI
        events: "/api/events/feed",

        // Clicking a date
        dateClick(info) {

            console.log("Clicked:", info.dateStr);

            // We'll connect this to the Add Event modal later.

        },

        // Clicking an event
        eventClick(info) {

            console.log("Event:", info.event.title);

            // Later:
            // Open event details modal

        },

        // Drag & Drop
        eventDrop(info) {

            console.log("Moved:", info.event.title);

            // Later:
            // PATCH /api/events/{id}

        },

        // Resize
        eventResize(info) {

            console.log("Resized:", info.event.title);

            // Later:
            // PATCH /api/events/{id}

        }

    });

    calendar.render();


    /* =====================================
       Add Event Button
    ====================================== */

    const addEventBtn = document.getElementById("add-event-btn");

    if (addEventBtn) {

        addEventBtn.addEventListener("click", function () {

            console.log("Open Add Event Modal");

            // Modal will come next.

        });

    }

});