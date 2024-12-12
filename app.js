document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

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
    yearSelect.addEventListener('change', () => {
        const selectedYear = parseInt(yearSelect.value);
        const selectedMonth = parseInt(monthSelect.value);
        updateCalendar(selectedYear, selectedMonth);
    });

    monthSelect.addEventListener('change', () => {
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
        const yearToRender = monthsToRender[0] <= month ? year : year + 1; // Adjust year if we're in the next year

        monthsToRender.forEach((m, index) => {
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

            // Check if there's an event for this day and add an indicator (dot)
            const eventKey = `${day}-${month + 1}-${year}`;  // Format: DD-MM-YYYY
            const events = JSON.parse(localStorage.getItem('events')) || [];
            const eventForDay = events.find(event => event.date === eventKey);
            if (eventForDay) {
                const eventIndicator = document.createElement('div');
                eventIndicator.className = 'event-indicator';
                dayElement.appendChild(eventIndicator);

                // Add click listener to event indicator to open the event details popup
                eventIndicator.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent day click event from firing
                    showEventDetails(eventForDay);
                });
            }

            // Add click listener to each day to open the event creation popup
            dayElement.addEventListener('click', (e) => {
                const selectedDay = e.target.textContent;
                const selectedMonth = parseInt(monthSelect.value);
                const selectedYear = parseInt(yearSelect.value);
                const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);

                const formattedDate = `${selectedDay}-${selectedMonth + 1}-${selectedYear}`;

                document.getElementById('eventDateDisplay').textContent = `Ημερομηνία: ${formattedDate}`;
                document.getElementById('eventDate').value = formattedDate; // Pre-fill the hidden date field
                document.getElementById('eventTime').value = "12:00"; // Default time (can be adjusted)

                document.getElementById('eventPopup').style.display = 'flex'; // Show pop-up
            });

            daysGrid.appendChild(dayElement);
        }

        monthContainer.appendChild(daysGrid);
        calendarElement.appendChild(monthContainer);
    }

    // Show event details in a pop-up
    function showEventDetails(event) {
        const eventDetailsPopup = document.getElementById('eventPopup');
        const eventTitle = document.getElementById('eventTitle');
        const eventDescription = document.getElementById('eventDescription');
        const eventTime = document.getElementById('eventTime');
        const eventDateDisplay = document.getElementById('eventDateDisplay');

        eventTitle.value = event.title;
        eventDescription.value = event.description;
        eventTime.value = event.time;
        eventDateDisplay.textContent = `Ημερομηνία: ${event.date}`;

        eventDetailsPopup.style.display = 'flex'; // Show event details in the pop-up

        // Change the form for editing the event
        document.getElementById('eventForm').addEventListener('submit', (e) => {
            e.preventDefault();

            event.title = eventTitle.value;
            event.description = eventDescription.value;
            event.time = eventTime.value;

            // Update the event in localStorage
            const events = JSON.parse(localStorage.getItem('events')) || [];
            const updatedEvents = events.map(existingEvent => {
                return existingEvent.date === event.date ? event : existingEvent;
            });

            localStorage.setItem('events', JSON.stringify(updatedEvents));
            alert('Event updated!');

            // Close the event details popup
            eventDetailsPopup.style.display = 'none';

            // Refresh calendar
            updateCalendar(parseInt(yearSelect.value), parseInt(monthSelect.value));
        });
    }

    // Close pop-up when clicking the close button
    document.getElementById('closePopup').addEventListener('click', () => {
        document.getElementById('eventPopup').style.display = 'none';
    });

    // Handle event form submission and store event in localStorage
    document.getElementById('eventForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const eventTitle = document.getElementById('eventTitle').value;
        const eventDescription = document.getElementById('eventDescription').value;
        const eventTime = document.getElementById('eventTime').value;
        const eventDate = document.getElementById('eventDate').value;

        // Retrieve events from localStorage, or initialize an empty array
        const events = JSON.parse(localStorage.getItem('events')) || [];

        // Add the new event to the events array
        events.push({
            title: eventTitle,
            description: eventDescription,
            time: eventTime,
            date: eventDate
        });

        // Save the updated events array back to localStorage
        localStorage.setItem('events', JSON.stringify(events));

        alert('Event saved!');
        document.getElementById('eventPopup').style.display = 'none';

        // Refresh the calendar after saving the event
        updateCalendar(parseInt(yearSelect.value), parseInt(monthSelect.value));
    });
});

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

        // Check if there's an event for this day and add an indicator (dot)
        const eventKey = `${year}-${month + 1}-${day}`;  // Format: YYYY-MM-DD
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const eventForDay = events.find(event => event.date === eventKey);
        if (eventForDay) {
            const eventIndicator = document.createElement('div');
            eventIndicator.className = 'event-indicator'; // Add purple dot indicator
            dayElement.appendChild(eventIndicator);

            // Add click listener to event indicator to open the event details popup
            eventIndicator.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent day click event from firing
                showEventDetails(eventForDay);
            });
        }

        // Add click listener to each day to open the event creation popup
        dayElement.addEventListener('click', (e) => {
            const selectedDay = e.target.textContent;
            const selectedMonth = parseInt(monthSelect.value);
            const selectedYear = parseInt(yearSelect.value);
            const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);

            const formattedDate = `${selectedDay}-${selectedMonth + 1}-${selectedYear}`;

            document.getElementById('eventDateDisplay').textContent = `Ημερομηνία: ${formattedDate}`;
            document.getElementById('eventDate').value = formattedDate; // Pre-fill the hidden date field
            document.getElementById('eventTime').value = "12:00"; // Default time (can be adjusted)

            document.getElementById('eventPopup').style.display = 'flex'; // Show pop-up
        });

        daysGrid.appendChild(dayElement);
    }

    monthContainer.appendChild(daysGrid);
    calendarElement.appendChild(monthContainer);
}

