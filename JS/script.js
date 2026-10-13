// ============================================================
// 1. SÉLECTION DES ÉLÉMENTS DU HTML (DOM)
// ============================================================

//champs formulaire
const form = document.querySelector('#ReservationPlaceCinema');

// Informations client
const prenomClient = document.querySelector('#prenomClient');
let filmChoisiInput = document.querySelector('#FilmChoisi');
const nombrePlaces = document.querySelector('#nombrePlaces');


// Zone de confirmation / message
const messageReservation = document.querySelector('#messageReservation');


// ============================================================
// 2. DONNÉES (l'état de l'application)
// ============================================================

let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
let recherche = '';

// Catalogue des films : un objet par film
const listeFilms = [
    { titre: "Jumanji", genre: "Aventure", prix: 9.50 },
    { titre: "Alibi.com", genre: "Comédie", prix: 8.50 },
    { titre: "Conjuring", genre: "Horreur", prix: 9.00 }
];



// ============================================================
// 3. ÉLÉMENTS CRÉÉS EN JAVASCRIPT (sans toucher au HTML)
// ============================================================

// Conteneur créé dynamiquement pour afficher les cartes
const recapContainer = document.createElement('section');
recapContainer.id = 'recapReservations';
form.after(recapContainer);

// Barre de recherche, zone de statistiques et zone de liste
const champRecherche = document.createElement('input');
champRecherche.type = 'text';
champRecherche.placeholder = 'Rechercher un prénom, un film ou un genre...';
champRecherche.setAttribute('oninput', 'filtrerReservations()');

const statsContainer = document.createElement('div');
const listeContainer = document.createElement('div');

recapContainer.append(champRecherche, statsContainer, listeContainer);

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


// ============================================================
// 4. FONCTIONS UTILITAIRES (petits outils réutilisables)
// ============================================================

// Vérifie que tous les champs passés sont remplis (REST)
const champsValides = (...champs) => champs.every((champ) => Boolean(champ));

// Affiche un message de succès ou d'erreur sous le formulaire
const afficherMessage = (texte, type) => {
    messageReservation.textContent = texte;
    messageReservation.className = `ticket__confirmation ticket__confirmation--${type}`;
};

// Donne le genre d'un film à partir de son titre (SWITCH)
const obtenirCategorie = (titre) => {
    switch (titre) {
        case 'Jumanji': return 'Aventure';
        case 'Alibi.com': return 'Comédie';
        case 'Conjuring': return 'Horreur';
        default: return 'Film';
    }
};

// Calcule le total d'une réservation (réduction de 20% à partir de 5 places)
const calculerTotal = (reservation) => {
    const sousTotal = reservation.places * reservation.prix;
    if (reservation.places >= 5) {
        return sousTotal - (sousTotal * 0.20);
    }
    return sousTotal;
};

// Enregistre le tableau dans le localStorage (JSON.stringify)
const sauvegarder = () => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
};


// ============================================================
// 5. FONCTIONS D'ACTION (appelées par les événements)
// ============================================================

// ----- Ajouter une réservation (onsubmit) -----
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

    const nouvelleReservation = {
        id: Date.now(),
        prenom: prenomSaisi,
        titre: filmSaisi,
        places: nbPlacesSaisi,
        prix: prixFilm,
        dateAjout: new Date().toISOString()
    };

    reservations = [...reservations, nouvelleReservation];
    sauvegarder();

    afficherMessage(`Réservation confirmée pour ${prenomSaisi} !`, "succes");
    afficherReservations();

    afficherMessage(`Réservation confirmée pour ${prenomSaisi} !`, "succes");
    afficherReservations();
};

// ----- Supprimer une réservation (onclick) -----
const supprimerReservation = (id) => {
    reservations = reservations.filter((r) => r.id !== id);
    sauvegarder();
    afficherMessage("Réservation supprimée.", "erreur");
    afficherReservations();
};

// ----- Filtrer par recherche (oninput) -----
const filtrerReservations = () => {
    recherche = champRecherche.value.trim().toLowerCase();
    afficherReservations();
};

// ----- Contrôle de saisie en temps réel (oninput) -----
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


// ============================================================
// 6. AFFICHAGE (filter + map + reduce + Math)
// ============================================================

const afficherReservations = () => {
    // FILTER : on ne garde que ce qui correspond à la recherche
    const visibles = reservations.filter((r) =>
        r.prenom.toLowerCase().includes(recherche) ||
        r.titre.toLowerCase().includes(recherche) ||
        obtenirCategorie(r.titre).toLowerCase().includes(recherche)
    );

    // MAP : chaque objet devient une carte HTML
    listeContainer.innerHTML = '<div class="films">' + visibles.map((r) => `
        <article class="film-card">
            <span class="film-card__genre">${obtenirCategorie(r.titre)}</span>
            <h2>${r.titre}</h2>
            <p class="film-card__meta">${r.places >= 5 ? 'Groupe (-20%)' : 'Individuel'} · ${r.places} place(s)</p>
            <p class="film-card__synopsis">Réservé par ${r.prenom} le ${new Date(r.dateAjout).toLocaleDateString()} — Total : ${calculerTotal(r).toFixed(2)} €</p>
            <button type="button" class="ticket__submit" onclick="supprimerReservation(${r.id})">Supprimer</button>
        </article>
    `).join('') + '</div>';

    // Statistiques
    if (visibles.length === 0) {
        statsContainer.innerHTML = '<p class="ticket__confirmation">Aucune réservation à afficher.</p>';
        return;
    }

    const totaux = visibles.map(calculerTotal);

    // REDUCE : cumuls
    const chiffreAffaires = totaux.reduce((somme, t) => somme + t, 0);
    const totalPlaces = visibles.reduce((somme, r) => somme + r.places, 0);
    const moyenne = chiffreAffaires / visibles.length;

    // MATH : extrêmes
    const plusCher = Math.max(...totaux);
    const moinsCher = Math.min(...totaux);

    statsContainer.innerHTML = `
        <p class="ticket__confirmation ticket__confirmation--succes">
            ${visibles.length} réservation(s) · ${totalPlaces} place(s) · Total : ${chiffreAffaires.toFixed(2)} €<br>
            Moyenne : ${moyenne.toFixed(2)} € · Max : ${plusCher.toFixed(2)} € · Min : ${moinsCher.toFixed(2)} €
        </p>
    `;
};


// ============================================================
// 7. ÉVÉNEMENTS (liaison entre le HTML et les fonctions)
// ============================================================

prenomClient.setAttribute('oninput', 'controlerSaisie()');
nombrePlaces.setAttribute('oninput', 'controlerSaisie()');


// ============================================================
// 8. INITIALISATION (au chargement de la page)
// ============================================================

// Valeurs par défaut pour tester le formulaire
prenomClient.value = "Alice";

afficherReservations();
