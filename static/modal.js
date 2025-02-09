const clickSound = new Audio('/static/sound2.wav');

function openModal(name, image, members, firstAlbum, creationDate, relations) {
    const modal = document.getElementById("myModal");
    const modalTitle = document.getElementById("modal-title");
    const modalImage = document.getElementById("modal-image");
    
    modalTitle.textContent = name;
    modalImage.src = image;
    modal.style.display = "block";

    // Set members list
    const membersList = document.getElementById("modal-members");
    membersList.innerHTML = members.split(", ").map(member => 
        `<div class="member-item">${member}</div>`
    ).join("");

    // Set album date
    document.getElementById("modal-first-album").textContent = firstAlbum;
    
    // Set creation date
    document.getElementById("modal-creation-date").textContent = creationDate;

    // Parse relations data for both locations and concert dates
    const relationsData = JSON.parse(relations);
    
    // Handle Locations
    const locationsList = Object.keys(relationsData).map(loc => formatLocation(loc));
    locationsList.sort();

    const locationsContainer = document.getElementById('modal-locations');
    locationsContainer.innerHTML = '';
    if (locationsList.length > 0) {
        locationsList.forEach(location => {
            const locationDiv = document.createElement('div');
            locationDiv.className = 'location-item';
            locationDiv.textContent = location;
            locationsContainer.appendChild(locationDiv);
        });
    }

    // Handle Concert Dates
    const tourDatesContainer = document.getElementById('modal-tour-dates');
    tourDatesContainer.innerHTML = '';
    
    if (Object.keys(relationsData).length > 0) {
        Object.entries(relationsData).forEach(([location, dates]) => {
            const formattedLocation = formatLocation(location);
            dates.forEach(date => {
                const dateDiv = document.createElement('div');
                dateDiv.className = 'tour-date';
                dateDiv.textContent = `${formattedLocation}: ${date}`;
                tourDatesContainer.appendChild(dateDiv);
            });
        });
    } else {
        tourDatesContainer.innerHTML = "<div class='tour-date'>No concert dates available</div>";
    }

    // Close all accordions initially
    document.querySelectorAll('.accordion-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add click handlers for accordion headers (right side only)
    document.querySelectorAll('.modal-right .accordion-header').forEach(header => {
        header.onclick = function() {
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');

            // Close all accordions
            document.querySelectorAll('.accordion-content').forEach(item => {
                item.classList.remove('active');
            });

            // Open clicked accordion if it wasn't already open
            if (!isActive) {
                content.classList.add('active');
            }
        };
    });

    // Play sound
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play();

    // Initialize accordion
    setTimeout(() => {
        initializeAccordion();
    }, 0);
}

function formatLocation(location) {
    const [city, country] = location.split('-');
    const formattedCity = city
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const formattedCountry = country
        .split('_')
        .map(word => word.toUpperCase())
        .join(' ');
    return `${formattedCity}, ${formattedCountry}`;
}

function formatCountry(country) {
    const formattedCountry = capitalizeWords(country);
    const countryLower = formattedCountry.toLowerCase();
    
    if (countryLower === "usa" || countryLower === "u_s_a") {
        return "USA";
    } 
    if (countryLower === "uk" || countryLower === "u_k") {
        return "UK";
    }
    
    return formattedCountry;
}

function capitalizeWords(str) {
    // Remove underscores, split into words, and capitalize each word
    return str.replace(/_/g, ' ').split(' ').map(word => capitalize(word)).join(' ');
}

function capitalize(word) {
    // Capitalize the first letter of the word and make the rest lowercase
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Close modal function
function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    
    // Close all accordion sections when modal is closed
    document.querySelectorAll('.accordion-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Stop the sound when the modal is closed
    clickSound.pause();
    clickSound.currentTime = 0;
}

// Event listeners for closing the modal
document.addEventListener("DOMContentLoaded", function() {
    // Close modal when clicking the "X"
    const closeButton = document.getElementById("close-modal");
    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        const modal = document.getElementById("myModal");
        if (event.target === modal) {
            closeModal();
        }
    };
});

// Toggle the display of tour dates when the header is clicked
document.getElementById("toggle-tour-dates").addEventListener("click", function() {
    const tourDatesList = document.getElementById("modal-tour-dates");
    if (tourDatesList.style.display === "none") {
        tourDatesList.style.display = "block";
    } else {
        tourDatesList.style.display = "none";
    }
});

// Add this after your existing openModal function
function initializeAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // First, remove all existing event listeners by cloning and replacing elements
    accordionHeaders.forEach(header => {
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
    });

    // Then add new event listeners
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            // Find the content associated with this header
            const content = this.nextElementSibling;
            
            // Toggle active class
            const isActive = content.classList.contains('active');
            
            // Close all accordion items
            document.querySelectorAll('.accordion-content').forEach(item => {
                item.classList.remove('active');
            });
            
            // If this item wasn't active, open it
            if (!isActive) {
                content.classList.add('active');
            }
        });
    });
}

// Update accordion click handler
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('accordion-header')) {
        const content = e.target.nextElementSibling;
        
        // If it's in the left side (members), toggle normally
        if (e.target.closest('.modal-left')) {
            content.classList.toggle('active');
        }
        // If it's in the right side, keep it open
        else {
            content.classList.add('active');
        }
    }
});
