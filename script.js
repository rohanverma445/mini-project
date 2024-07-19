document.addEventListener('DOMContentLoaded', () => {
    const { jsPDF } = window.jspdf;

    const users = [];

    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('reg-name').value;
        const password = document.getElementById('reg-password').value;
        const dob = document.getElementById('reg-dob').value;
        const email = document.getElementById('reg-email').value;

        users.push({ name, password, dob, email });

        document.getElementById('registration-message').textContent = 'Registration successful! Please login.';
        document.getElementById('registration-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
    });

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('reservation-container').style.display = 'block';
        } else {
            document.getElementById('login-message').textContent = 'Invalid email or password.';
        }
    });

    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const departure = document.getElementById('departure').value;
        const destination = document.getElementById('destination').value;
        const date = document.getElementById('date').value;

        const flights = [
            { id: 1, departure: 'New York', destination: 'Los Angls', date: '2024-07-25', price: 299.99 },
            { id: 2, departure: 'Chicago', destination: 'Miami', date: '2024-07-26', price: 199.99 },
            { id: 3, departure: 'San Francisco', destination: 'Seattle', date: '2024-07-27', price: 149.99 }
        ];

        const filteredFlights = flights.filter(flight =>
            flight.departure.toLowerCase() === departure.toLowerCase() &&
            flight.destination.toLowerCase() === destination.toLowerCase() &&
            flight.date === date
        );

        displayFlights(filteredFlights);
    });

    function displayFlights(flights) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        if (flights.length > 0) {
            flights.forEach(flight => {
                const flightCard = document.createElement('div');
                flightCard.className = 'flight-card';
                flightCard.innerHTML = `
                    <h2>Flight from ${flight.departure} to ${flight.destination}</h2>
                    <p>Date: ${flight.date}</p>
                    <p>Price: $${flight.price.toFixed(2)}</p>
                    <button onclick="bookFlight(${flight.id})">Book</button>
                `;
                resultsContainer.appendChild(flightCard);
            });
        } else {
            resultsContainer.innerHTML = '<p>No flights found</p>';
        }
    }

    window.bookFlight = function(flightId) {
        const flights = [
            { id: 1, departure: 'New York', destination: 'Los Angeles', date: '2024-07-25', price: 299.99 },
            { id: 2, departure: 'Chicago', destination: 'Miami', date: '2024-07-26', price: 199.99 },
            { id: 3, departure: 'San Francisco', destination: 'Seattle', date: '2024-07-27', price: 149.99 }
        ];

        const selectedFlight = flights.find(flight => flight.id === flightId);

        if (selectedFlight) {
            document.getElementById('reservation-container').style.display = 'none';
            document.getElementById('booking-container').style.display = 'block';
            document.getElementById('flightDetails').value = `Flight from ${selectedFlight.departure} to ${selectedFlight.destination} on ${selectedFlight.date} - $${selectedFlight.price.toFixed(2)}`;
        }
    };

    document.getElementById('booking-slots').addEventListener('click', function(event) {
        if (event.target.classList.contains('slot')) {
            document.querySelectorAll('.slot').forEach(slot => slot.classList.remove('selected'));
            event.target.classList.add('selected');
            document.getElementById('selectedSlot').value = event.target.getAttribute('data-slot');
        }
    });

    document.getElementById('bookingForm').addEventListener('submit', function(event) {
        event.preventDefault();

        document.getElementById('booking-container').style.display = 'none';
        document.getElementById('payment-container').style.display = 'block';
    });

    document.getElementById('paymentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (paymentMethod) {
            alert('Payment successful! Your ticket has been booked.');
            downloadTicket();
            document.getElementById('payment-container').style.display = 'none';
            document.getElementById('reservation-container').style.display = 'block';
            document.getElementById('loginForm').reset();
            document.getElementById('searchForm').reset();
            document.getElementById('bookingForm').reset();
            document.getElementById('paymentForm').reset();
        } else {
            alert('Please select a payment method.');
        }
    });

    function downloadTicket() {
        const flightDetails = document.getElementById('flightDetails').value;
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const selectedSlot = document.getElementById('selectedSlot').value;

        const doc = new jsPDF('p', 'mm', 'a4');
        doc.setFillColor(255, 255, 255);
        doc.rect(10, 10, 190, 277, 'F'); // Background color to white

        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text("Flight Ticket", 105, 20, null, null, 'center');

        doc.setFontSize(16);
        doc.text("Flight Details", 10, 40);
        doc.text(`Flight Details: ${flightDetails}`, 10, 50);

        doc.text("Passenger Details", 10, 70);
        doc.text(`Name: ${fullName}`, 10, 80);
        doc.text(`Email: ${email}`, 10, 90);
        doc.text(`Phone: ${phone}`, 10, 100);

        doc.text("Slot Details", 10, 120);
        doc.text(`Selected Slot: ${selectedSlot}`, 10, 130);

        doc.text("Payment Details", 10, 150);
        doc.text(`Payment Method: ${document.querySelector('input[name="paymentMethod"]:checked').value}`, 10, 160);

        doc.setFontSize(12);
        doc.text("Thank you for booking with us!", 105, 250, null, null, 'center');

        doc.save("ticket.pdf");
    }
});
