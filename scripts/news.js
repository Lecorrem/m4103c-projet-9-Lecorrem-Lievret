// Tableau contenant des chaines de caractères correspondant aux recherches stockées
var recherches = [];
// Chaine de caractères correspondant à la recherche courante
var recherche_courante;
// Tableau d'objets de type resultats (avec titre, date et url)
var recherche_courante_news = [];
// tableau de tags de type chaine de caractères
var availableTags = [];



// Ajoute une recherche entrée dans la barre de saisie dans la zone
// "recherches stockées" et dans le tableau "recherches"
function ajouter_recherche() {
  // On récupère la valeur de la zone de saisie
  let dejaPresent = 0;
  var saisie = document.getElementById("zone_saisie").value;

  // On vérifie que la chaine saisie n'est pas déjà présente dans le Tableau
  // de recherches
  for(elem in recherches){
    if(recherches[elem] == saisie){
      dejaPresent = 1;
    }
  }
  // Si elle n'est pas présente on l'ajoute dans la zone "recherches stockées"
  // et le tableau "recherches" ainsi que dans le localStorage
  // sinon on ne fait rien
  if(dejaPresent == 0 ){
    let stock = document.getElementById("recherches-stockees");
    let para = document.createElement('p');
    para.className = "titre-recherche";
    para.innerHTML = '<label onclick=\"selectionner_recherche(this)\">'+saisie+'</label><img src=\"img/croix30.jpg\" class=\"icone-croix\" onclick=\"supprimer_recherche(this)\"/>';
    stock.append(para);
    recherches.push(saisie);
    localStorage.setItem("recherches",recherches);
  }
}

// Supprime de la zone "recherches stockées" du tableau de "recherches"
// et du localStorage la recherche passée en paramètre
function supprimer_recherche(elt) {
  let element = elt.parentNode;
  element.parentNode.removeChild(element);
  label = element.getElementsByTagName("label")[0].innerHTML;
  recherches.splice(recherches.indexOf(label),1);
  localStorage.removeItem("recherches");
  localStorage.setItem("recherches",recherches);
}

// Lorsque l'on clique sur une recherche de la zone "recherches stockées"
// on ajoute la chaine de cette recherche à la zone de saisie
function selectionner_recherche(elt) {
  let contenue = elt.innerHTML;
  document.getElementById("zone_saisie").value = contenue;
  recherche_courante = contenue;
  // On réinitialiser le tableau de recherches courantes
  recherche_courante_news = [];
  let divRes = document.getElementById("resultats");
  if(recherche_courante in localStorage){
    recherche_courante_news = JSON.parse(localStorage.getItem(recherche_courante));
    // on vide la zone "résultats" de la page et pour chaque recherche du tableau
    // de recherches courantes on créé un paragraphe contenant les infos de la
    // recherche
    divRes.innerHTML = "";
    let paragraphe;
    for(r of recherche_courante_news){
      paragraphe = document.createElement('p');
      paragraphe.class = 'titre_result';
      paragraphe.innerHTML = '<a class="titre_news" href="'+decodeHtmlEntities(r.url)+'" target="_blank">'+decodeHtmlEntities(r.titre)+'</a><span class="date_news">'+r.date+'</span><span class="action_news" onclick="supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span>';
      divRes.appendChild(paragraphe);
    }
  }
  // Si la recherche courant n'est pas dans le localStorage, on se contente de
  // supprimer le contenu de la zone "résultats"
  else{
    divRes.innerHTML = "";
  }

}


// Fonction qui initialise la zone des recherches et le tableau de Recherches
// en fonction du contenu du localStorage
function init() {
  if(localStorage.getItem("recherches")){
    let iter = 0;
    let searches = localStorage.getItem("recherches").split(",");
    for(elm of searches){
      recherches.push(elm);
      var stock = document.getElementById("recherches-stockees");
      let para = document.createElement('p');
      para.className = "titre-recherche";
      para.innerHTML = '<label onclick=\"selectionner_recherche(this)\">'+elm+'</label><img src=\"img/croix30.jpg\" class=\"icone-croix\" onclick=\"supprimer_recherche(this)\"/>';
      stock.append(para);
      iter++;
    }
  }
  if(localStorage.getItem("tags")){
    availableTags = JSON.parse(localStorage.getItem("tags"));
  }
}

// Fonction initialisant un appel ajax afin de récupérer les données des offres
// stockées sur un serveur
function rechercher_nouvelles() {
  // la recherche courante a changé donc on réinitialise le tableau
  // recherche_courante_news
  recherche_courante_news = [];
  let waiting = document.getElementById("wait");
  waiting.style.display = "block";
  let elem = document.getElementById("resultats");
  elem.innerHTML = "";
  let valeur = document.getElementById("zone_saisie").value;
  recherche_courante = valeur;

  // Rempli le tableau des tags pour l'utilisateur
  nouveauTag(valeur);

  let retour = ajax_get_request(maj_resultats, "https://carl-vincent.fr/search-internships.php?data="+valeur, true );
  // let result = document.getElementById("resultats");
  if(recherche_courante in localStorage){
    recherche_courante_news = JSON.parse(localStorage.getItem(recherche_courante));
  }

}

// Lors de l'appel ajax, cette fonction est appelée afin de lancer la requête
// le callback est fait sur la fonction maj_resultats qui récupère en paramètre les
// données résultat de la requête si celle-ci s'est déroulée normalement
function ajax_get_request(callback, url , async){
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if( callback && req.readyState == 4 && (req.status == 200 || req.status == 0)){
      callback(req.responseText);
    }
  };
  req.open("GET", url, async);
  req.send();
}

// En fonction des données récupérées grâce à la requète ajax, cette Fonction
// permet d'afficher les résultats dans la zone "résulats" de la page
function maj_resultats(res) {
  let waiting = document.getElementById("wait");
  waiting.style.display = "none";
  let resultats = JSON.parse(res);
  let divRes = document.getElementById("resultats");
  let paragraphe;
  for(r of resultats){
    paragraphe = document.createElement('p');
    paragraphe.class = 'titre_result';
    r.date = formatDate(r.date);
    if(indexOfResultat(recherche_courante_news, r) != -1){
      paragraphe.innerHTML = '<a class="titre_news" href="'+decodeHtmlEntities(r.url)+'" target="_blank">'+decodeHtmlEntities(r.titre)+'</a><span class="date_news">'+r.date+'</span><span class="action_news" onclick="supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span>';
    }
    else{
      paragraphe.innerHTML = '<a class="titre_news" href="'+decodeHtmlEntities(r.url)+'" target="_blank">'+decodeHtmlEntities(r.titre)+'</a><span class="date_news">'+r.date+'</span><span class="action_news" onclick="sauver_nouvelle(this)"><img src="img/horloge15.jpg"/></span>';
    }
    divRes.appendChild(paragraphe);
  }
}

// Création d'une classe RechercheNews afin de remplir le tableau
// de recherche_courante_news
class RechercheNews{
  constructor(titre, date, url){
    this.titre = titre;
    this.date = date;
    this.url = url;
  }
}

// Permet de sauvegarder une recherche en cliquant sur l'icone d'horloge à
// droite d'un résultat. L'icone est changée en disk et la recherche est
// ajoutée au tableau de recherche_courante_news
function sauver_nouvelle(elt) {
	let img = elt.getElementsByTagName('img')[0];
  img.src = "img/disk15.jpg";
  elt.removeAttribute("onclick");
  elt.setAttribute("onclick","supprimer_nouvelle(this)");

  let titre = elt.parentNode.getElementsByTagName('a')[0].innerHTML;
  let date = elt.parentNode.getElementsByTagName('span')[0].innerHTML;
  let url = elt.parentNode.getElementsByTagName('a')[0].href;
  let news = new RechercheNews(titre, date, url);
  console.log(news);
  if(indexOfResultat(recherche_courante_news, news) == -1){

    recherche_courante_news.push(news);
  }
  localStorage.removeItem(recherche_courante);

  localStorage.setItem(recherche_courante,JSON.stringify(recherche_courante_news));
}

// Permet de supprimer une recherche en cliquant sur l'icone de disk à
// droite d'un résultat. L'icone est changée en disk et la recherche est
// ajoutée au tableau de recherche_courante_news
function supprimer_nouvelle(elt) {
  let img = elt.getElementsByTagName('img')[0];
  img.src = "img/horloge15.jpg";
  elt.removeAttribute("onclick");
  elt.setAttribute("onclick","sauver_nouvelle(this)");
  let titre = elt.parentNode.getElementsByTagName('a')[0].innerHTML;
  let date = elt.parentNode.getElementsByTagName('span')[0].innerHTML;
  let url = elt.parentNode.getElementsByTagName('a')[0].href;
  let news = new RechercheNews(titre, date, url);

  recherche_courante_news.splice(indexOfResultat(recherche_courante_news, news), 1);
  localStorage.removeItem(recherche_courante);
  if(recherche_courante_news.length >= 1){
    localStorage.setItem(recherche_courante, JSON.stringify(recherche_courante_news));
  }
}

// Fonction permettant à l'utilisateur de valider le contenue de la zone de
// saisie à l'aide de la touche "entrer" du clavier
document.getElementById('zone_saisie').onkeyup = function(e){
  var e = window.event || e;
  var touche = e.charcode || e.keyCode;
  if(touche == 13){
    rechercher_nouvelles();
  }
}

// Ajoute un tag au tableau de tags dans la limite de 100 tags
function nouveauTag(val){
  if(availableTags.length<100 || indexOf(availableTags,val) == -1){
    availableTags.push(val);
  }
  else if(indexOf(availableTags,val) == -1){
    availableTags.splice(0,1);
    availableTags.push(val);
  }

  if(localStorage.getItem("tags")){
    localStorage.removeItem("tags");
  }

  localStorage.setItem("tags",JSON.stringify(availableTags));
}

// méthode d'autocompletion pour la zone de saisie qui propose les valeurs
// présentes dans le tableau de tags
$(function() {

    $('#zone_saisie').autocomplete({
      source: availableTags
    });
  } );
