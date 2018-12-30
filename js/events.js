var boutonElt = document.getElementById("bouton");
// Ajout d'un gestionnaire pour l'événement click
boutonElt.addEventListener("click", function (e) {
    console.log("Evènement : " + e.type + 
        ", texte de la cible : " + e.target.textContent);
});

// Suppression du gestionnaire pour l'événement click
// boutonElt.removeEventListener("click", clic);

// Gestion de l'appui sur une touche du clavier produisant un caractère
document.addEventListener("keypress", function (e) {
    console.log("Vous avez appuyé sur la touche " + String.fromCharCode(e.charCode));
});