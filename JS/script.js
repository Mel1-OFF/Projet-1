//champs formulaire
const form = document.querySelector('#ReservationPlaceCinema');

// Informations client
const prenomClient = document.querySelector('#prenomClient');
let filmChoisiInput = document.querySelector('#FilmChoisi');
const nombrePlaces = document.querySelector('#nombrePlaces');

// Zones de carte (une par film)
const carteJumanji = document.querySelector('#filmJumanji');
const carteAlibi = document.querySelector('#filmAlibi');
const carteConjuring = document.querySelector('#filmConjuring');

// Zone de confirmation / message
const messageReservation = document.querySelector('#messageReservation');

// ----- Tableaux parallèles -----
const titresReserves = [];
const prenomsReserves = [];
const placesReservees = [];
const prixReserves = [];

// Conteneur créé dynamiquement pour afficher les cartes
const recapContainer = document.createElement('section');
recapContainer.id = 'recapReservations';
form.after(recapContainer);



function gererReservationCinema(event) {
    event.preventDefault();

    const prenomSaisi = prenomClient.value.trim();
    const filmSaisi = filmChoisiInput.value;
    const nbPlacesSaisi = Number(nombrePlaces.value);

    // Validation : Truthy/Falsy
    if (!prenomSaisi || !filmSaisi || !nbPlacesSaisi) {
        messageReservation.textContent = "Merci de remplir tous les champs.";
        messageReservation.className = 'ticket__confirmation ticket__confirmation--erreur';
        return;
    }

    // Comparaison stricte
    if (nbPlacesSaisi <= 0 || nbPlacesSaisi > 10) {
        messageReservation.textContent = "Le nombre de places doit être entre 1 et 10.";
        messageReservation.className = 'ticket__confirmation ticket__confirmation--erreur';
        return;
    }

    const carteCorrespondante = document.querySelector(`.film-card[data-titre="${filmSaisi}"]`);
    const prixFilm = carteCorrespondante ? Number(carteCorrespondante.dataset.prix) : 0;

    // Ajout aux tableaux parallèles
    titresReserves.push(filmSaisi);
    prenomsReserves.push(prenomSaisi);
    placesReservees.push(nbPlacesSaisi);
    prixReserves.push(prixFilm);

    messageReservation.textContent = `Réservation confirmée pour ${prenomSaisi} !`;
    messageReservation.className = 'ticket__confirmation ticket__confirmation--succes';

    afficherCartesReservations();
}


// Transformation du champ texte en menu déroulant
const selectFilm = document.createElement('select');
selectFilm.id = 'FilmChoisi';
selectFilm.name = 'NomFilm';
selectFilm.required = true;

document.querySelectorAll('.film-card').forEach(carte => {
    const option = document.createElement('option');
    option.value = carte.dataset.titre;
    option.textContent = carte.dataset.titre;
    selectFilm.appendChild(option);
});

filmChoisiInput.replaceWith(selectFilm);
filmChoisiInput = selectFilm;


const listeFilms = [
    { nom: "Jumanji", carte: carteJumanji },
    { nom: "Alibi", carte: carteAlibi },
    { nom: "Conjuring", carte: carteConjuring }
];


function afficherCartesReservations() {
    let html = '';

    for (let i = 0; i < titresReserves.length; i++) {
        const total = (placesReservees[i] * prixReserves[i]).toFixed(2);

        // Ternaire
        const badgePlaces = placesReservees[i] >= 3 ? 'Groupe' : 'Individuel';

        // Switch
        let categorie;
        switch (titresReserves[i]) {
            case 'Jumanji':
                categorie = 'Aventure';
                break;
            case 'Alibi.com':
                categorie = 'Comédie';
                break;
            case 'Conjuring':
                categorie = 'Horreur';
                break;
            default:
                categorie = 'Film';
        }

        html += `
            <article class="film-card">
                <span class="film-card__genre">${categorie}</span>
                <h2>${titresReserves[i]}</h2>
                <p class="film-card__meta">${badgePlaces} · ${placesReservees[i]} place(s)</p>
                <p class="film-card__synopsis">Réservé par ${prenomsReserves[i]} — Total : ${total} €</p>
            </article>
        `;
    }

    recapContainer.innerHTML = `<h2 class="ticket__title">Réservations enregistrées</h2><div class="films">${html}</div>`;
}

