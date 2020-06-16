
var model = {};

// Tableau contenant des chaines de caractères correspondant aux recherches stockées
model.recherches = [];
// Chaine de caractères correspondant à la recherche courante
model.recherche_courante;
// Tableau d'objets de type resultats (avec titre, date et url)
model.recherche_courante_news = [];
// tableau de tags de type chaine de caractères
model.availableTags = [];


                        /////////////////////////////////

// Création d'une classe RechercheNews afin de remplir le tableau
// de recherche_courante_news
class RechercheNews{
  constructor(titre, date, url){
    this.titre = titre;
    this.date = date;
    this.url = url;
  }
}

                        /////////////////////////////////

// met à jour le contenue de la recherche courante
model.maj_recherche_courante = function(contenue){
  model.recherche_courante = contenue;
}

// Vide le tableau des recherche_courante_news
model.reinit_recherche_courante_news = function(){
  model.recherche_courante_news = [];
}

// Ajoute un élément au tableau recherche_courante_news
model.add_news_rech_cour_news = function(news){
  model.recherche_courante_news.push(news);
}

                        /////////////////////////////////

// Récupère les recherches stockées dans le localStorage
model.getRecherches_storage = function(){
  return JSON.parse(localStorage.getItem("recherches"));
}

// Ajoute le valeur saisie dans le champs de saisie au tableau de Recherches
// ainsi qu'au local storage
model.ajouter_recherche = function(saisie){
  model.recherches.push(saisie);
  localStorage.setItem("recherches",JSON.stringify(model.recherches));
}

// Supprime une recherches du tableau de recherches. Le storage des Recherches
// est ensuite vidé et mis à jour avec les le nouveau tableau de recherches
model.supprimer_recherche = function(){
  model.recherches.splice(model.recherches.indexOf(label),1);
  localStorage.removeItem("recherches");
  localStorage.setItem("recherches", JSON.stringify(model.recherches));
}

                          /////////////////////////////////

// récupère le contenu des recherche_courante_news depuis le local storage
model.storage_to_rech_cour_news = function(){
  model.recherche_courante_news = JSON.parse(localStorage.getItem(model.recherche_courante));
}

// Créé et retourne une nouvelle instance de la classe RechercheNews correspondant
// au informations d'un résultat de la recherche
model.new_rechercheNews = function(titre,date,url){
  let news = new RechercheNews(titre, date, url);
  return news;
}

// Reinitialise le localstorage de recherche_courante_news d'index recherche_courante
// avec le nouveau tableau recherche_courante_news
model.remove_rech_cour_news_storage = function(){
  localStorage.removeItem(model.recherche_courante);
  if(model.recherche_courante_news.length >= 1){
    localStorage.setItem(model.recherche_courante,JSON.stringify(model.recherche_courante_news));

  }
}

// On supprime l'élément d'index équivalent à l'objet news passé en paramètres
// du tableau de recherche_courante_news
model.supprimer_nouvelle = function(news){
  model.recherche_courante_news.splice(indexOfResultat(model.recherche_courante_news, news), 1);

}
                          /////////////////////////////////

// Stockage des tags sur le local storage
model.getTags_storage = function(){
  model.availableTags = JSON.parse(localStorage.getItem("tags"));
}

// Gestion des tags. Les 100 dernières entrées de l'utilisateur sont stockées dans
// le local storage. Ainsi, lorsqu'il commence à entrer une valeur dans le
// champs de saisie, il obtient des propositions correspondant à ces entrées.
model.nouveauTag = function(val){

  if(model.availableTags.length<100 && model.availableTags.indexOf(val) == -1){
    model.availableTags.push(val);
  }
  else if(model.availableTags.indexOf(val) == -1){
    model.availableTags.splice(0,1);
    model.availableTags.push(val);
  }
  else{
    return;
  }

  if(localStorage.getItem("tags")){
    localStorage.removeItem("tags");
  }

  localStorage.setItem("tags",JSON.stringify(model.availableTags));
}
