var pElt = document.querySelector("p");
pElt.style.color = "red";
pElt.style.margin = "50px";
pElt.style.fontFamily = "Arial";
pElt.style.backgroundColor = "black";

var paragraphesElts = document.getElementsByTagName("p");
console.log(paragraphesElts[0].style.color); // Affiche "red"
console.log(paragraphesElts[1].style.color); // Affiche "green"
console.log(paragraphesElts[2].style.color); // N'affiche rien car sans getComputedStyle, on a pas accès à ce qui est écrit dans le css

var stylePara = getComputedStyle(document.getElementById("para"));
console.log(stylePara.fontStyle); // Affiche "italic"
console.log(stylePara.color); // Affiche la couleur bleue en valeurs RGB

var divPara = document.getElementsByClassName("parag");
for(var i = 0;i<divPara.length;i++){
    divPara[i].style.backgroundColor = "red";
    divPara[i].style.color = "white";
}

var content = getComputedStyle(document.getElementById("contenu"));

var infos = document.getElementById("infos");
infos.textContent = "Informations sur l'élément";

var hauteurContenu = content.height;
var longueurContenu = content.width;

var ulElt = document.createElement("ul");
var li1Elt = document.createElement("li");
li1Elt.textContent = "Hauteur : " + hauteurContenu;
var li2Elt = document.createElement("li");
li2Elt.textContent = "Longueur : " + longueurContenu;

ulElt.appendChild(li1Elt);
ulElt.appendChild(li2Elt);

infos.appendChild(ulElt);