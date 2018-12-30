// Liste des journaux
var journaux = ["http://lemonde.fr", "http://lefigaro.fr", "http://liberation.fr"];

// TODO : ajouter la liste des journaux sur la page, dans la div "contenu"
var ulElt = document.createElement("ul");

for(var i=0;i<journaux.length;i++){
    var liElt = document.createElement("li");
    var linkElt = document.createElement("a");
    linkElt.textContent = journaux[i];
    linkElt.href = journaux[i];
    liElt.appendChild(linkElt);
    ulElt.appendChild(liElt);
}

document.getElementById('contenu').appendChild(ulElt);

// Liste des mots du dictionnaire
var mots = [
    {
        terme: "Procrastination",
        definition: "Tendance pathologique à remettre systématiquement au lendemain"
    },
    {
        terme: "Tautologie",
        definition: "Phrase dont la formulation ne peut être que vraie"
    },
    {
        terme: "Oxymore",
        definition: "Figure de style qui réunit dans un même syntagme deux termes sémantiquement opposés"
    }
];

// TODO : créer le dictionnaire sur la page web, dans la div "contenu"
var dlElt = document.createElement("dl");
for(var i=0;i<mots.length;i++){
    var dtElt = document.createElement("dt");
    var strongElt = document.createElement("strong");
    strongElt.textContent = mots[i].terme;
    var ddElt = document.createElement("dd");
    ddElt.textContent = mots[i].definition;
    dtElt.appendChild(strongElt);
    dlElt.appendChild(dtElt);
    dlElt.appendChild(ddElt);
}
document.getElementById('contenu').appendChild(dlElt);
