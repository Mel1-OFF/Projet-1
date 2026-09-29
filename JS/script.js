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
let titresReserves = [];
let prenomsReserves = [];
let placesReservees = [];
let prixReserves = [];

// Conteneur créé dynamiquement pour afficher les cartes
const recapContainer = document.createElement('section');
recapContainer.id = 'recapReservations';
form.after(recapContainer);


// REST : accepte autant de champs qu'on veut
const champsValides = (...champs) => champs.every((champ) => Boolean(champ));

const afficherMessage = (texte, type) => {
    messageReservation.textContent = texte;
    messageReservation.className = `ticket__confirmation ticket__confirmation--${type}`;
};


const gererReservationCinema = (event) => {
    event.preventDefault();

    const prenomSaisi = prenomClient.value.trim();
    const filmSaisi = filmChoisiInput.value;
    const nbPlacesSaisi = Number(nombrePlaces.value);

    if (!champsValides(prenomSaisi, filmSaisi, nbPlacesSaisi)) {
        afficherMessage("Merci de remplir tous les champs.", "erreur");
        return;
    }
    if (nbPlacesSaisi < 1 || nbPlacesSaisi > 10) {
        afficherMessage("Le nombre de places doit être entre 1 et 10.", "erreur");
        return;
    }

    const carte = document.querySelector(`.film-card[data-titre="${filmSaisi}"]`);
    const prixFilm = carte ? Number(carte.dataset.prix) : 0;

    // SPREAD : on crée de nouveaux tableaux au lieu de les modifier
    titresReserves = [...titresReserves, filmSaisi];
    prenomsReserves = [...prenomsReserves, prenomSaisi];
    placesReservees = [...placesReservees, nbPlacesSaisi];
    prixReserves = [...prixReserves, prixFilm];

    afficherMessage(`Réservation confirmée pour ${prenomSaisi} !`, "succes");
    afficherCartesReservations();
};

// oninput : contrôle en temps réel
const controlerSaisie = () => {
    const prenomSaisi = prenomClient.value.trim();
    const nbPlacesSaisi = Number(nombrePlaces.value);

    if (!prenomSaisi) {
        afficherMessage("Le prénom est obligatoire.", "erreur");
    } else if (!Number.isInteger(nbPlacesSaisi) || nbPlacesSaisi < 1 || nbPlacesSaisi > 10) {
        afficherMessage("Le nombre de places doit être un entier entre 1 et 10.", "erreur");
    } else {
        afficherMessage("Saisie valide ✔", "succes");
    }
};

// onclick : suppression directe d'une réservation
const supprimerReservation = (index) => {
    titresReserves = titresReserves.filter((_, i) => i !== index);
    prenomsReserves = prenomsReserves.filter((_, i) => i !== index);
    placesReservees = placesReservees.filter((_, i) => i !== index);
    prixReserves = prixReserves.filter((_, i) => i !== index);

    afficherMessage("Réservation supprimée.", "erreur");
    afficherCartesReservations();
};


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


const afficherCartesReservations = () => {
    let html = '';

    for (let i = 0; i < titresReserves.length; i++) {
        // DESTRUCTURATION : on extrait les 4 infos de la réservation i
        const [titre, prenom, places, prix] = [
            titresReserves[i], prenomsReserves[i], placesReservees[i], prixReserves[i]
        ];

        const sousTotal = places * prix;

        let total;
        if (places >= 5) {
            total = sousTotal - (sousTotal * 0.20);
        } else {
            total = sousTotal;
        }
        total = total.toFixed(2);

        const badgePlaces = places >= 5 ? 'Groupe (-20%)' : 'Individuel';

        let categorie;
        switch (titre) {
            case 'Jumanji': categorie = 'Aventure'; break;
            case 'Alibi.com': categorie = 'Comédie'; break;
            case 'Conjuring': categorie = 'Horreur'; break;
            default: categorie = 'Film';
        }

        html += `
            <article class="film-card">
                <span class="film-card__genre">${categorie}</span>
                <h2>${titre}</h2>
                <p class="film-card__meta">${badgePlaces} · ${places} place(s)</p>
               <p class="film-card__synopsis">Réservé par ${prenom} — Total : ${total} €</p>
                <button type="button" class="ticket__submit" onclick="supprimerReservation(${i})">Supprimer</button>
            </article>
        `;
    }

    recapContainer.innerHTML = `<h2 class="ticket__title">Réservations enregistrées</h2><div class="films">${html}</div>`;
};

prenomClient.setAttribute('oninput', 'controlerSaisie()');
nombrePlaces.setAttribute('oninput', 'controlerSaisie()');


// Valeurs par défaut pour tester le formulaire
prenomClient.value = "Alice";

