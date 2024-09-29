const tipButtons = document.querySelectorAll('.amount');

const billInput = document.getElementById('bill-input'); // Now used for displaying bill result only
const tipAmountInput = document.getElementById('custom-input');
const peopleNumberInput = document.getElementById('people-number-input');

const tipPerPerson = document.getElementById('tip-amount-text');
const totalPerPerson = document.getElementById('total-text');

const percIcon = document.getElementById('percentage-icon');
const selectedTipAmountText = document.getElementById('selectedTipAmount');

const resetBtn = document.getElementById('reset-btn');

const rateInput = document.getElementById('rate-input'); // Cost per hour input

var selectedTipAmount = 0;
var bill = 0;
var tipAmountPerPerson = 0;
var totalMoneyPerPerson = 0;
var distanceInKm = 0; // Distance in kilometers

// Disable scroll on number inputs to prevent values from changing
rateInput.addEventListener('wheel', function (e) {
    if (document.activeElement === rateInput) {
        e.preventDefault(); // Prevent the default scroll behavior if focused
    }
}, { passive: false });

peopleNumberInput.addEventListener('wheel', function (e) {
    if (document.activeElement === peopleNumberInput) {
        e.preventDefault(); // Prevent the default scroll behavior if focused
    }
}, { passive: false });


// Calculate when number of people or tip changes
peopleNumberInput.addEventListener('input', calculateTotalPerPerson);
tipAmountInput.addEventListener('input', handleCustomTip);
rateInput.addEventListener('input', calculateBill);

tipButtons.forEach(btn => {
    btn.addEventListener('click', handleTipSelection);
});

// Bill calculation based on cost per hour and distance
function calculateBill() {
    if (distanceInKm > 0 && rateInput.value !== "") {
        bill = distanceInKm * parseFloat(rateInput.value); // Bill is calculated as cost/hour * distance
        billInput.value = bill.toFixed(2); // Display the bill in the input field (for display only, not editable)
        calculateTotalPerPerson(); // Recalculate total per person when bill changes
    }
}

// Tip calculation based on selected button or custom input
function handleTipSelection(event) {
    tipAmountInput.value = ""; // Clear custom input when a predefined tip button is clicked
    checkInput(tipAmountInput.value);

    removeAllSelections();
    const btn = event.currentTarget;
    btn.classList.add('selected');
    selectedTipAmount = parseInt(btn.getAttribute('data-amount')); // Get the selected tip percentage
    selectedTipAmountText.innerText = selectedTipAmount + "%";

    calculateTotalPerPerson(); // Recalculate total per person
}

// Custom tip input handler
function handleCustomTip() {
    if (tipAmountInput.value !== "") {
        selectedTipAmount = parseFloat(tipAmountInput.value); // Custom tip amount
        selectedTipAmountText.innerText = selectedTipAmount + "%";
        calculateTotalPerPerson();
    }
}

// Recalculate the total per person
function calculateTotalPerPerson() {
    if (peopleNumberInput.value !== "" && peopleNumberInput.valueAsNumber > 0) {
        const numberOfPeople = peopleNumberInput.valueAsNumber;

        // Calculate tip per person and total per person
        const tipAmount = (bill * selectedTipAmount) / 100;
        const totalWithTip = bill + tipAmount;

        tipAmountPerPerson = tipAmount / numberOfPeople;
        totalMoneyPerPerson = totalWithTip / numberOfPeople;

        // Update UI
        tipPerPerson.innerText = tipAmountPerPerson.toFixed(2) + "$";
        totalPerPerson.innerText = totalMoneyPerPerson.toFixed(2) + "$";
    }
}

// Helper functions
function removeAllSelections() {
    tipButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
}

function checkInput(value) {
    if (value !== "") {
        percIcon.style.display = 'inline';
        tipAmountInput.style.outline = '2px solid #26c2ad';
    } else {
        percIcon.style.display = 'none';
        tipAmountInput.style.outline = 'none';
    }
}

// Reset button
resetBtn.addEventListener('click', () => {
    selectedTipAmount = 0;
    bill = 0;
    tipAmountPerPerson = 0;
    totalMoneyPerPerson = 0;
    distanceInKm = 0;

    billInput.value = "";
    peopleNumberInput.value = "";
    tipAmountInput.value = "";
    rateInput.value = "";
    tipAmountInput.setAttribute('data-amount', 0);
    
    tipPerPerson.innerText = "0$";
    totalPerPerson.innerText = "0$";
    selectedTipAmountText.innerText = "0%";
    
    checkInput(tipAmountInput.value);
    removeAllSelections();
});

// Modify Distance & Time Calculator to trigger bill calculation
let autocompleteOrigin, autocompleteDestination;

function initMap() {
    const mapOptions = {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 6
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');

    autocompleteOrigin = new google.maps.places.Autocomplete(originInput);
    autocompleteDestination = new google.maps.places.Autocomplete(destinationInput);

    document.getElementById('submit').addEventListener('click', () => {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
    });

    document.getElementById('clear').addEventListener('click', clearFields);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;

    if (!origin || !destination) {
        alert("Please enter both origin and destination!");
        return;
    }

    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);

            const route = response.routes[0].legs[0];
            distanceInKm = route.distance.value / 1000; // Convert distance to kilometers
            const duration = route.duration.text;

            document.getElementById('output').innerHTML = `Distance: ${distanceInKm.toFixed(2)} km <br> Duration: ${duration}`;

            calculateBill(); // Trigger bill calculation based on distance
        } else {
            alert('Directions request failed due to ' + status);
        }
    });
}

function clearFields() {
    document.getElementById('origin').value = '';
    document.getElementById('destination').value = '';
    document.getElementById('output').innerHTML = '';
    distanceInKm = 0;
    billInput.value = "";
    initMap();
}

window.onload = initMap;



// Go to Account Page
document.querySelector('.account').addEventListener('click', function() {
    window.location.href = 'login.html';
  })
  
