// TODO : ajoutez ici la définition de l'objet Chien

var Chien = {
    init: function (nom, race, taille) {
        this.nom = nom;
        this.race = race;
        this.taille = taille;
    },

    aboyer: function () {
        if (this.race === "mâtin de Naples") {
            return "Grrr ! Grrr !";
        }
        if (this.race === "bichon") {
            return "Kaii ! Kaii !";
        }
    }
}

var crokdur = Object.create(Chien);
crokdur.init("Crokdur", "mâtin de Naples", 75);
console.log(crokdur.nom + " est un " + crokdur.race + " mesurant " + crokdur.taille + " cm");
console.log("Tiens, un chat ! " + crokdur.nom + " aboie : " + crokdur.aboyer());
var pupuce = Object.create(Chien);
pupuce.init("Pupuce", "bichon", 22);
console.log(pupuce.nom + " est un " + pupuce.race + " mesurant " + pupuce.taille + " cm");
console.log("Tiens, un chat ! " + pupuce.nom + " aboie : " + pupuce.aboyer());

// TODO : ajoutez ici la définition des objets nécessaires
var CompteBancaire = {
    initCB: function (name, money) {
        this.name = name;
        this.money = money;
    },

    decrire: function () {
        return ("Titulaire : " + this.name + ", solde : " + this.money + " euros");
    },

    debiter: function (montant) {
        this.money = this.money - montant;
    },

    crediter: function (montant) {
        this.money = this.money + montant;
    }

}

var CompteEpargne = Object.create(CompteBancaire);
CompteEpargne.initCE = function (name, money, interest) {
    this.initCB(name, money);
    this.interest = interest;
};
CompteEpargne.ajouterInterets = function () {
    this.money = this.money+(this.money*this.interest);
};

var compte1 = Object.create(CompteBancaire);
compte1.initCB("Alex", 100);
var compte2 = Object.create(CompteEpargne);
compte2.initCE("Marco", 50, 0.05);
console.log("Voici l'état initial des comptes :");
console.log(compte1.decrire());
console.log(compte2.decrire());
var montant = Number(prompt("Entrez le montant à transférer entre les comptes :"));
compte1.debiter(montant);
compte2.crediter(montant);

// Calcule et ajoute les intérêts au solde du compte
compte2.ajouterInterets();
console.log("Voici l'état final des comptes après transfert et calcul des intérêts :");
console.log(compte1.decrire());
console.log(compte2.decrire());
