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
            // Adjust the year if the month is before the current month
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
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.textContent = day;
            daysGrid.appendChild(dayDiv);
        }

        monthContainer.appendChild(daysGrid);
        calendarElement.appendChild(monthContainer);
    }
});
