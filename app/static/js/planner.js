document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       Calendar
    ====================================== */

    const calendarEl = document.getElementById("calendar");

    if (!calendarEl) return;
    let selectedEvent = null;
    let editing = false;


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
    editing = true;

    openModal();

    document.getElementById("event-title").value = selectedEvent.title;
    document.getElementById("event-date").value =
        selectedEvent.startStr.slice(0, 10);

    document.getElementById("event-time").value =
        selectedEvent.start
            .toTimeString()
            .slice(0, 5);

    document.getElementById("event-category").value =
        selectedEvent.extendedProps.category;

    document.getElementById("save-event-btn").textContent =
        "Save Changes";

    

    deleteBtn.classList.remove("hidden");

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

    editing = true;

    form.reset();

    deleteBtn?.classList.add("hidden");

    document.getElementById("save-event-btn").textContent = "Create Event";

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

            const url = editing
    ? `/api/events/${selectedEvent.id}`
    : "/api/events";

const method = editing
    ? "PATCH"
    : "POST";

const response = await fetch(url, {
    method,
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