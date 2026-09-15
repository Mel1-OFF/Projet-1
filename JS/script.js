//champs formulaire
const form = document.querySelector('#ReservationPlaceCinema');

// Informations client
const prenomClient = document.querySelector('#prenomClient');
const filmChoisiInput = document.querySelector('#FilmChoisi');
const nombrePlaces = document.querySelector('#nombrePlaces');

// Zones de carte (une par film)
const carteJumanji = document.querySelector('#filmJumanji');
const carteAlibi = document.querySelector('#filmAlibi');
const carteConjuring = document.querySelector('#filmConjuring');

// Zone de confirmation / message
const messageReservation = document.querySelector('#messageReservation');


function gererReservationCinema(event) {
    event.preventDefault();

    messageReservation.textContent =
        `Film : ${filmChoisiInput.value}
     Prénom : ${prenomClient.value} 
    Places : ${nombrePlaces.value}`;
}

// Valeurs par défaut pour tester le formulaire
filmChoisiInput.value = "Jumanji";
prenomClient.value = "Alice";
nombrePlaces.value = 3;