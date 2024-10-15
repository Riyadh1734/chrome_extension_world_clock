let clocks = []; // Array to store clock locations

// Function to update time for all clocks
function updateClocks() {
    clocks.forEach(clock => {
        const now = new Date();
        const timeZone = clock.timeZone; // Use the timeZone from the clock object

        try {
            const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone };
            const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', timeZone: timeZone };
            const dayOptions = { weekday: 'long', timeZone: timeZone };

            const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
            const dateString = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
            const dayString = new Intl.DateTimeFormat('en-US', dayOptions).format(now);

            document.getElementById(`time-${clock.id}`).textContent = timeString;
            document.getElementById(`date-${clock.id}`).textContent = dateString;
            document.getElementById(`day-${clock.id}`).textContent = dayString;
        } catch (error) {
            console.error(`Error updating clock for ${clock.location}:`, error);
        }
    });
}

// Function to add a new clock
function addClock() {
    const locationInput = document.getElementById('locationInput').value.trim();
    
    if (locationInput === '') {
        alert('Please enter a valid country or city.');
        return;
    }

    // Fetch the timezone from World Time API
    fetch(`http://worldtimeapi.org/api/timezone`)
        .then(response => response.json())
        .then(data => {
            const timeZone = data.find(tz => tz.includes(locationInput.replace(' ', '_')));

            if (!timeZone) {
                alert('Unknown location. Please enter a valid country or city.');
                return;
            }

            // Create a unique id for the new clock
            const clockId = `clock-${clocks.length}`;
            
            clocks.push({
                id: clockId,
                location: locationInput,
                timeZone: timeZone
            });

            // Add a new row to the table for the clock
            const clockTableBody = document.getElementById('clockTableBody');
            const newRow = document.createElement('tr');
            newRow.setAttribute('id', clockId);
            newRow.innerHTML = `
                <td>${locationInput}</td>
                <td id="time-${clockId}">-</td>
                <td id="date-${clockId}">-</td>
                <td id="day-${clockId}">-</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeClock('${clockId}')">Remove</button></td>
            `;
            clockTableBody.appendChild(newRow);

            document.getElementById('locationInput').value = ''; // Clear input

            // Immediately update clocks
            updateClocks();
        })
        .catch(error => {
            console.error('Error fetching timezone:', error);
            alert('Failed to retrieve time zone information. Please try again.');
        });
}

// Function to remove a clock
function removeClock(clockId) {
    // Remove the clock from the array
    clocks = clocks.filter(clock => clock.id !== clockId);
    
    // Remove the row from the table
    const clockRow = document.getElementById(clockId);
    if (clockRow) {
        clockRow.remove();
    }
}
document.getElementById('locationInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        addClock(); // Call addClock() when Enter is pressed
    }
});


// Update clocks every second
setInterval(() => {
    console.log("Updating clocks...");
    updateClocks();
}, 1000);
