document.addEventListener('DOMContentLoaded', function () {
    const calendarElement = document.getElementById('calendar');
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const dayPopup = document.getElementById('dayPopup');
    const addEventPopup = document.getElementById('addEventPopup');
    const eventListItems = document.getElementById('eventListItems');
    const hourSelect = document.getElementById('hourSelect');
    const eventForm = document.getElementById('eventForm');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventLocationInput = document.getElementById('eventLocation');
    const eventDescriptionInput = document.getElementById('eventDescription');
    const deleteEventButton = document.getElementById('deleteEventButton');

    let selectedDate = null;
    let selectedEvent = null;

    // Populate year dropdown (current year to 2030)
    for (let year = currentYear; year <= 2030; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Populate month dropdown
    const monthNames = [
        'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος',
        'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος',
        'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'
    ];
    monthNames.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // Set current year and month as selected
    yearSelect.value = currentYear;
    monthSelect.value = currentMonth;

    // Render initial calendar for the current month and the next two months
    renderCalendar(currentYear, currentMonth);

    // Event listeners for dropdowns
    yearSelect.addEventListener('change', function () {
        const selectedYear = parseInt(yearSelect.value);
        const selectedMonth = parseInt(monthSelect.value);
        updateCalendar(selectedYear, selectedMonth);
    });

    monthSelect.addEventListener('change', function () {
        const selectedYear = parseInt(yearSelect.value);
        const selectedMonth = parseInt(monthSelect.value);
        updateCalendar(selectedYear, selectedMonth);
    });

    // Update the calendar display
    function updateCalendar(year, month) {
        calendarElement.innerHTML = ''; // Clear existing calendar
        renderCalendar(year, month); // Render updated calendar
    }

    // Render calendar for a given year and month
    function renderCalendar(year, month) {
        const monthsToRender = [month, (month + 1) % 12, (month + 2) % 12]; // Current, next, and the month after next

        monthsToRender.forEach(function (m) {
            const currentMonthYear = m < month ? year + 1 : year;
            renderMonth(currentMonthYear, m);
        });
    }

    // Render a single month
    function renderMonth(year, month) {
        const monthContainer = document.createElement('div');
        monthContainer.className = 'month';

        // Add month header
        const monthName = `${monthNames[month]} ${year}`;
        monthContainer.innerHTML = `<h3>${monthName}</h3>`;

        // Create grid for days
        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';

        // Render blank spaces for days of the week alignment
        const firstDayIndex = new Date(year, month, 1).getDay();
        for (let i = 0; i < firstDayIndex; i++) {
            const blankDay = document.createElement('div');
            blankDay.className = 'day blank';
            daysGrid.appendChild(blankDay);
        }

        // Render days of the month
        const totalDays = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= totalDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;

            // Add event dot if the day has events
            if (hasEvents(year, month, day)) {
                const eventDot = document.createElement('div');
                eventDot.className = 'event-dot';
                dayElement.appendChild(eventDot);
            }

            // Add click listener to each day to open the day popup
            dayElement.addEventListener('click', function () {
                selectedDate = `${day}-${month + 1}-${year}`;
                openDayPopup(selectedDate);
            });

            daysGrid.appendChild(dayElement);
        }

        monthContainer.appendChild(daysGrid);
        calendarElement.appendChild(monthContainer);
    }

    // Check if a day has events
    function hasEvents(year, month, day) {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const date = `${day}-${month + 1}-${year}`;
        return events.some(event => event.date === date);
    }

    // Open the day popup and populate it
    function openDayPopup(date) {
        // Populate the hour dropdown
        hourSelect.innerHTML = '';
        for (let hour = 0; hour < 24; hour++) {
            const hourOption = document.createElement('option');
            hourOption.value = hour;
            hourOption.textContent = `${hour < 10 ? '0' : ''}${hour}:00`;
            hourSelect.appendChild(hourOption);
        }

        // Display events for the day
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const eventsForDay = events.filter(event => event.date === date);
        eventListItems.innerHTML = eventsForDay.map((event, index) =>
            `<li>
            ${event.title}
            <button class="delete-event" data-index="${index}">Delete</button>
        </li>`
        ).join('');

        // Add delete event functionality
        document.querySelectorAll('.delete-event').forEach(function (button) {
            button.addEventListener('click', function (e) {
                const eventIndex = e.target.getAttribute('data-index');
                const eventItemElement = e.target.closest('li'); // Get the li element containing the event
                deleteEvent(eventIndex, eventItemElement); // Call the deleteEvent function with the element
            });
        });

        // Show the popup
        dayPopup.style.display = 'flex';
    }

    // Delete the event
    function deleteEvent(eventIndex, eventItemElement) {
        // Get events from localStorage
        const events = JSON.parse(localStorage.getItem('events')) || [];

        // Remove the event from the array
        events.splice(eventIndex, 1);

        // Update the events in localStorage
        localStorage.setItem('events', JSON.stringify(events));

        // Remove the event from the DOM
        eventItemElement.remove();
    }

    // Close the day popup
    document.getElementById('closeDayPopup').addEventListener('click', function () {
        dayPopup.style.display = 'none';
    });

    // Open the add event popup when "Add Event" button is clicked
    document.getElementById('addEventButton').addEventListener('click', function () {
        openAddEventPopup(selectedDate);
    });

    // Open the add event popup and pre-fill the date
    function openAddEventPopup(date) {
        selectedEvent = null; // Clear previous selected event
        eventTitleInput.value = '';
        eventLocationInput.value = '';
        eventDescriptionInput.value = '';

        addEventPopup.style.display = 'flex';
    }

    // Close the add event popup
    document.getElementById('closeAddEventPopup').addEventListener('click', function () {
        addEventPopup.style.display = 'none';
    });

    // Handle form submission for adding/updating an event
    eventForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newEvent = {
            title: eventTitleInput.value,
            location: eventLocationInput.value,
            description: eventDescriptionInput.value,
            time: hourSelect.value,
            date: selectedDate
        };

        const events = JSON.parse(localStorage.getItem('events')) || [];
        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));

        alert('Event saved!');
        addEventPopup.style.display = 'none';

        // Refresh calendar after adding event
        updateCalendar(parseInt(yearSelect.value), parseInt(monthSelect.value));
    });
});
