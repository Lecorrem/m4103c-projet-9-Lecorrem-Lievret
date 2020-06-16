
var view = {};

                          /////////////////////////////////
                          //      Setters et getters     //
                          /////////////////////////////////
// Récupère le contenue de la zone de saisie
view.getItem_zone_saisie = function(){
  return document.getElementById("zone_saisie").value;
}
// Ajoute un contenu à la zone de saisie
view.setItem_zone_saisie = function(contenue){
  document.getElementById("zone_saisie").value = contenue;
}

// Récupère le contenue de la zone de résultats
view.getItem_resultats = function(){
  return document.getElementById("resultats");
}

// récupère le contenue d'un élément html
view.getInnerHtml = function(elt){
  return elt.innerHTML;
}

// vide le contenue d'un élément html
view.voidInnerHtml = function(divRes){
  divRes.innerHTML = "";
}

// récupère un élément de la zone recherches-stockées et le renvoie
view.getItem_recherches_stockees = function(){
  let stock = document.getElementById("recherches-stockees");
  return stock;
}

                          /////////////////////////////////

// ajoute une recherche saisie en paramètre à la zone de recherches stockées
view.ajouter_recherche = function(stock, saisie){
  let para = document.createElement('p');
  para.className = "titre-recherche";
  para.innerHTML = '<label onclick=\"controler.selectionner_recherche(this)\">'+saisie+'</label><img src=\"img/croix30.jpg\" class=\"icone-croix\" onclick=\"controler.supprimer_recherche(this)\"/>';
  stock.append(para);
}

// Supprime une recherche saisie en paramètre à la zone de recherches stockées
view.supprimer_recherche = function(elt){
  let element = elt.parentNode;
  element.parentNode.removeChild(element);
  label = element.getElementsByTagName("label")[0].innerHTML;
  return label;
}

// Lorsqu'une recherche est séléctionnée, on ajoute les recherches enregistrées
// à la partie résultats
view.selectionner_recherche = function(r, divRes){
  let paragraphe = document.createElement('p');
  paragraphe.class = 'titre_result';
  paragraphe.innerHTML = '<a class="titre_news" href="'+decodeHtmlEntities(r.url)+'" target="_blank">'+decodeHtmlEntities(r.titre)+'</a><span class="date_news">'+r.date+'</span><span class="action_news" onclick="controler.supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span>';
  divRes.appendChild(paragraphe);
}

                          /////////////////////////////////

// Affiche un icone de chargement pendant le chargement des résultats
// on vide la page de résultats pour supprimer les anciens
// on renvoie la valeur de la zone de saisie
view.chargement_resultats = function(){
  let waiting = document.getElementById("wait");
  waiting.style.display = "block";
  let elem = document.getElementById("resultats");
  elem.innerHTML = "";
  return document.getElementById("zone_saisie").value;
}

// A la fin du chargement, on supprime l'icone de chargement
// et on retourne les résultats
view.fin_chargement_resultats = function(res){
  let waiting = document.getElementById("wait");
  waiting.style.display = "none";
  return document.getElementById("resultats");
}

                          /////////////////////////////////

// initialisation de la maj des résultats par le formatage de la date
view.maj_resultats_init = function(r){
  r.date = formatDate(r.date);
  return r.date;
}

// Si l'élément est enregistré on l'affiche avec l'icone de disk et avec la
// fonction controler.supprimer_nouvelle en onclick
view.maj_resultats_if = function(r,divRes){
  let paragraphe = document.createElement('p');
  paragraphe.class = 'titre_result';
  paragraphe.innerHTML = '<a class="titre_news" href="'+decodeHtmlEntities(r.url)+'" target="_blank">'+decodeHtmlEntities(r.titre)+'</a><span class="date_news">'+r.date+'</span><span class="action_news" onclick="controler.supprimer_nouvelle(this)"><img src="img/disk15.jpg"/></span>';
  divRes.appendChild(paragraphe);
}

// Si l'élément n'est pas enregistré , on l'affiche avec l'icone d'horloge
// et avec la fonction ajouter_nouvelle en onclick
view.maj_resultats_else = function(r,divRes){
  let paragraphe = document.createElement('p');
  paragraphe.class = 'titre_result';
  paragraphe.innerHTML = '<a class="titre_news" href="'+decodeHtmlEntities(r.url)+'" target="_blank">'+decodeHtmlEntities(r.titre)+'</a><span class="date_news">'+r.date+'</span><span class="action_news" onclick="controler.sauver_nouvelle(this)"><img src="img/horloge15.jpg"/></span>';
  divRes.appendChild(paragraphe);
}

// Lors d'un click sur un icone d'horloge, on change cet icone en disk
// et on modifie la fonction d'appel du onclick
view.get_sauver_nouvelle = function(elt){
  let img = elt.getElementsByTagName('img')[0];
  img.src = "img/disk15.jpg";
  elt.removeAttribute("onclick");
  elt.setAttribute("onclick","controler.supprimer_nouvelle(this)");
  return elt;
}

// Lors d'un click sur un icone de disk, on change cet icone en horloge
// et on modifie la fonction d'appel du onclick
view.get_supprimer_nouvelle = function(elt){
  let img = elt.getElementsByTagName('img')[0];
  img.src = "img/horloge15.jpg";
  elt.removeAttribute("onclick");
  elt.setAttribute("onclick","controler.sauver_nouvelle(this)");
  return elt;
}

                          /////////////////////////////////

// Getters et setters des éléments html pour la classe RechercheNews
view.getTitre = function(elt){
  return elt.parentNode.getElementsByTagName('a')[0].innerHTML;
}

view.getDate = function(elt){
 return elt.parentNode.getElementsByTagName('span')[0].innerHTML;
}

view.getUrl = function(elt){
  return elt.parentNode.getElementsByTagName('a')[0].href;
}
