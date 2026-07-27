document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: ""
        },
        buttonText: {
            today: "Today"
        },
        height: "auto",
        dateClick: function (info) {
            const date = new Date(info.dateStr);
            const formattedDate = date.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });

            document.getElementById("events-title").textContent = "Events";
            document.getElementById("events-date").textContent = `📅 ${formattedDate}`;
            document.getElementById("events-list").textContent = "No events for this day.";
        }
    });

    calendar.render();
});
