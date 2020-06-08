// Tableau contenant des chaines de caractères correspondant aux recherches stockées
var recherches = [];
// Chaine de caractères correspondant à la recherche courante
var recherche_courante;
// Tableau d'objets de type resultats (avec titre, date et url)
var recherche_courante_news = [];



function ajouter_recherche() {
  let dejaPresent = 0;
  let nombre_recherches = recherches.length;
  var saisie = document.getElementById("zone_saisie").value;

  for(elem in recherches){
    if(recherches[elem] == saisie){
      dejaPresent = 1;
    }
  }
  if(dejaPresent == 0 ){
    var stock = document.getElementById("recherches-stockees");
    let para = document.createElement('p');
    para.className = "titre-recherche";
    para.innerHTML = '<label onclick=\"selectionner_recherche(this)\">'+saisie+'</label><img src=\"img/croix30.jpg\" class=\"icone-croix\" onclick=\"supprimer_recherche(this)\"/>';
    stock.append(para);
    recherches.push(saisie);
    localStorage.setItem("recherches",recherches);
    nombre_recherches++;
  }


}


function supprimer_recherche(elt) {
  let element = elt.parentNode;
  element.parentNode.removeChild(element);
  label = element.getElementsByTagName("label")[0].innerHTML;
  recherches.splice(recherches.indexOf(label),1);
  localStorage.removeItem("recherches");
  localStorage.setItem("recherches",recherches);
}


function selectionner_recherche(elt) {
  let contenue = elt.innerHTML;
  document.getElementById("zone_saisie").value = contenue;
  recherche_courante = contenue;
  if(recherche_courante in localStorage){
    recherche_courante_news = JSON.parse(localStorage.getItem(recherche_courante));
    let divRes = document.getElementById("resultats");
    divRes.innerHTML = "";
    let paragraphe;
    for(r of recherche_courante_news){
      paragraphe = document.createElement('p');
      paragraphe.class = 'titre_result';
      paragraphe.innerHTML = '<a class="titre_news" href="'+decodeHtmlEntities(r.url)+'" target="_blank">'+decodeHtmlEntities(r.titre)+'</a><span class="date_news">'+r.date+'</span><span class="action_news" onclick="supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span>';
      divRes.appendChild(paragraphe);
    }

  }

}


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
}


function rechercher_nouvelles() {
  let waiting = document.getElementById("wait");
  waiting.style.display = "block";
  let elem = document.getElementById("resultats");
  elem.innerHTML = "";
  let valeur = document.getElementById("zone_saisie").value;
  recherche_courante = valeur;
  let retour = ajax_get_request(maj_resultats, "https://carl-vincent.fr/search-internships.php?data="+valeur, true );
  let result = document.getElementById("resultats");
  if(recherche_courante in localStorage){
    recherche_courante_news = JSON.parse(localStorage.getItem(recherche_courante));
  }
}

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


function maj_resultats(res) {
  let waiting = document.getElementById("wait");
  waiting.style.display = "none";
  let resultats = JSON.parse(res);
  console.log(resultats);
  let divRes = document.getElementById("resultats");
  let paragraphe;
  for(r of resultats){
    paragraphe = document.createElement('p');
    paragraphe.class = 'titre_result';
    if(indexOfResultat(recherche_courante_news, r) != -1){
      paragraphe.innerHTML = '<a class="titre_news" href="'+decodeHtmlEntities(r.url)+'" target="_blank">'+decodeHtmlEntities(r.titre)+'</a><span class="date_news">'+formatDate(r.date)+'</span><span class="action_news" onclick="supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span>';
    }
    else{
      paragraphe.innerHTML = '<a class="titre_news" href="'+decodeHtmlEntities(r.url)+'" target="_blank">'+decodeHtmlEntities(r.titre)+'</a><span class="date_news">'+formatDate(r.date)+'</span><span class="action_news" onclick="sauver_nouvelle(this)"><img src="img/horloge15.jpg"/></span>';
    }
    divRes.appendChild(paragraphe);
  }
}


class RechercheNews{
  constructor(titre, date, url){
    this.titre = titre;
    this.date = date;
    this.url = url;
  }
}


function sauver_nouvelle(elt) {
	let img = elt.getElementsByTagName('img')[0];
  img.src = "img/disk15.jpg";
  elt.removeAttribute("onclick");
  elt.setAttribute("onclick","supprimer_nouvelle(this)");


  let titre = elt.parentNode.getElementsByTagName('a')[0].innerHTML;
  let date = elt.parentNode.getElementsByTagName('span')[0].innerHTML;
  let url = elt.parentNode.getElementsByTagName('a')[0].href;
  let news = new RechercheNews(titre, date, url);

  if(indexOfResultat(recherche_courante_news, news) == -1){
    recherche_courante_news.push(news);
  }
  localStorage.removeItem(recherche_courante);
  localStorage.setItem(recherche_courante,JSON.stringify(recherche_courante_news));
}


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
