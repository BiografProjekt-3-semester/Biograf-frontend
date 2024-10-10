function goToCustomerForm() {
    // Skjul Showtime-sektionen
    document.getElementById("Showtime-details").style.display = "none";

    // Vis kundens formular
    document.getElementById("customerForm").style.display = "block";

    // Scroll til toppen af siden for at vise formularen tydeligt
    window.scrollTo(0, 0);
}

// Event listener til at håndtere formularindsendelse
document.getElementById("customerForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Forhindre sidegenindlæsning ved formularindsendelse

    // Indsamler kundeoplysninger fra formularfelterne
    const customerData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        age: parseInt(document.getElementById("age").value, 10)
    };

    // Simpel validering for at sikre, at felterne er udfyldt korrekt
    if (!customerData.firstName || !customerData.lastName || !customerData.email || isNaN(customerData.age)) {
        alert("Udfyld venligst alle felter korrekt.");
        return;
    }

    // Sender data til backend (API-endpoint skal opdateres med din rigtige URL)
    fetch('http://localhost:8080/api/customers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fejl ved oprettelse af reservation.');
            }
            return response.json();
        })
        .then(data => {
            alert('Reservation bekræftet! Du vil modtage en email.');
            // Omdiriger til en bekræftelsesside
            window.location.href = '/confirmation';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Der opstod en fejl. Prøv venligst igen.');
        });

});