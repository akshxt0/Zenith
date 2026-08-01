document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       Calendar
    ====================================== */

    const calendarEl = document.getElementById("calendar");

    if (!calendarEl) return;
    let selectedEvent = null;

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
            dayGridMonth: { buttonText: "Month" },
            timeGridWeek: { buttonText: "Week" },
            timeGridDay: { buttonText: "Day" }
        },

        events: "/api/events/feed",

        dateClick(info) {
            console.log("Clicked:", info.dateStr);
        },

        eventClick(info) {

    selectedEvent = info.event;

    openModal();

    document
        .getElementById("delete-event-btn")
        .classList.remove("hidden");

},

        eventDrop(info) {
            console.log("Moved:", info.event.title);
        },

        eventResize(info) {
            console.log("Resized:", info.event.title);
        }

    });

    calendar.render();

    /* =====================================
       Modal
    ====================================== */

    const modal = document.getElementById("event-modal");

    const openBtn = document.getElementById("add-event-btn");

    const closeBtn = document.getElementById("close-modal");

    const cancelBtn = document.getElementById("cancel-modal");

    const deleteBtn = document.getElementById("delete-event-btn");
    console.log(deleteBtn);

    function openModal() {

        document
    .getElementById("delete-event-btn")
    .classList.add("hidden");
        modal.classList.remove("hidden");
        modal.classList.add("flex");

        document.getElementById("event-title").focus();

    }

    function closeModal() {

        modal.classList.add("hidden");
        modal.classList.remove("flex");

    }

    openBtn?.addEventListener("click", openModal);

    closeBtn?.addEventListener("click", closeModal);

    cancelBtn?.addEventListener("click", closeModal);

    modal?.addEventListener("click", function (e) {

        if (e.target === modal) {

            closeModal();

        }

    });

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            closeModal();

        }

    });

    /* =====================================
       Save Event
    ====================================== */

    const form = document.getElementById("event-form");

    form?.addEventListener("submit", async function (e) {

        e.preventDefault();

        const payload = {
            title: document.getElementById("event-title").value.trim(),
            category: document.getElementById("event-category").value,
            date: document.getElementById("event-date").value,
            time: document.getElementById("event-time").value
        };

        if (!payload.title) {

            alert("Please enter a title.");

            return;

        }

        try {

            const response = await fetch("/api/events", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });

            if (!response.ok) {

                throw new Error("Failed to save event.");

            }

            await response.json();

            closeModal();

            form.reset();

            calendar.refetchEvents();
            window.location.reload(); // Reload the page to reflect the new event

        }

        catch (err) {

            console.error(err);

            alert("Couldn't save event.");

        }

    });


/* =====================================
   Delete Event
===================================== */

deleteBtn?.addEventListener("click", async function () {

    console.log("Delete button clicked");

    if (!selectedEvent) return;

    const confirmed = confirm(
        `Delete "${selectedEvent.title}"?`
    );

    if (!confirmed) return;

    try {

        const response = await fetch(
            `/api/events/${selectedEvent.id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Delete failed.");
        }

        closeModal();

        calendar.refetchEvents();

        window.location.reload();

    }

    catch (err) {

        console.error(err);

        alert("Couldn't delete event.");

    }

});
});