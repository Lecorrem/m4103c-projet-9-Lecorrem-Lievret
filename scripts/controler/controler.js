
var controler = {};



                          /////////////////////////////////

// Ajoute une recherche entrée dans la barre de saisie dans la zone
// "recherches stockées" et dans le tableau "recherches"
controler.ajouter_recherche = function(){
  // On récupère la valeur de la zone de saisie
  let dejaPresent = 0;
  var saisie = view.getItem_zone_saisie();

  // On vérifie que la chaine saisie n'est pas déjà présente dans le Tableau
  // de recherches
  for(elem in model.recherches){
    if(model.recherches[elem] == saisie){
      dejaPresent = 1;
    }
  }
  // Si elle n'est pas présente on l'ajoute dans la zone "recherches stockées"
  // et le tableau "recherches" ainsi que dans le localStorage
  // sinon on ne fait rien
  if(dejaPresent == 0 ){
    let stock = view.getItem_recherches_stockees();
    let para = view.ajouter_recherche(stock, saisie);
    model.ajouter_recherche(saisie);
  }
}

                          /////////////////////////////////

// Supprime de la zone "recherches stockées" du tableau de "recherches"
// et du localStorage la recherche passée en paramètre
controler.supprimer_recherche = function(elt) {
  label = view.supprimer_recherche(elt);
  model.supprimer_recherche(label);
}

                          /////////////////////////////////

// Lorsque l'on clique sur une recherche de la zone "recherches stockées"
// on ajoute la chaine de cette recherche à la zone de saisie
controler.selectionner_recherche = function(elt){
  let contenue = view.getInnerHtml(elt);
  view.setItem_zone_saisie(contenue);
  model.maj_recherche_courante(contenue);
  model.reinit_recherche_courante_news();
  let divRes = view.getItem_resultats();
  if(model.recherche_courante in localStorage){
    model.storage_to_rech_cour_news();
    // on vide la zone "résultats" de la page et pour chaque recherche du tableau
    // de recherches courantes on créé un paragraphe contenant les infos de la
    // recherche
    view.voidInnerHtml(divRes);
    for(r of model.recherche_courante_news){
      view.selectionner_recherche(r, divRes);
    }
  }
  // Si la recherche courant n'est pas dans le localStorage, on se contente de
  // supprimer le contenu de la zone "résultats"
  else{
    view.voidInnerHtml(divRes);
  }

}

                          /////////////////////////////////

// Fonction qui initialise la zone des recherches et le tableau de Recherches
// en fonction du contenu du localStorage
controler.init = function() {
  if(localStorage.getItem("recherches")){
    let searches = model.getRecherches_storage();
    for(elm of searches){
      model.ajouter_recherche(elm);

      let stock = view.getItem_recherches_stockees();
      let para = view.ajouter_recherche(stock, elm);
    }
  }
  if(localStorage.getItem("tags")){
    model.getTags_storage();
  }
}

                          /////////////////////////////////

// Fonction initialisant un appel ajax afin de récupérer les données des offres
// stockées sur un serveur
controler.rechercher_nouvelles = function() {
  // la recherche courante a changé donc on réinitialise le tableau
  // recherche_courante_news
  model.reinit_recherche_courante_news();

  recherche_courante = view.chargement_resultats();

  // Rempli le tableau des tags pour l'utilisateur
  model.nouveauTag(recherche_courante);

  let retour = controler.ajax_get_request(controler.maj_resultats, "https://carl-vincent.fr/search-internships.php?data="+recherche_courante, true );
  model.maj_recherche_courante(recherche_courante);
  if(recherche_courante in localStorage){

    model.storage_to_rech_cour_news();
  }

}

                          /////////////////////////////////

// Lors de l'appel ajax, cette fonction est appelée afin de lancer la requête
// le callback est fait sur la fonction maj_resultats qui récupère en paramètre les
// données résultat de la requête si celle-ci s'est déroulée normalement
controler.ajax_get_request = function(callback, url , async){
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if( callback && req.readyState == 4 && (req.status == 200 || req.status == 0)){
      callback(req.responseText);
    }
  };
  req.open("GET", url, async);
  req.send();
}

                          /////////////////////////////////

// En fonction des données récupérées grâce à la requète ajax, cette Fonction
// permet d'afficher les résultats dans la zone "résulats" de la page
controler.maj_resultats = function(res) {
  let divRes = view.fin_chargement_resultats(res);
  let resultats = JSON.parse(res);
  for(r of resultats){
    r.date = view.maj_resultats_init(r);
    if(indexOfResultat(model.recherche_courante_news, r) != -1){
      view.maj_resultats_if(r,divRes);
    }
    else{
      view.maj_resultats_else(r,divRes);
    }

  }
}



                          /////////////////////////////////

// Permet de sauvegarder une recherche en cliquant sur l'icone d'horloge à
// droite d'un résultat. L'icone est changée en disk et la recherche est
// ajoutée au tableau de recherche_courante_news
controler.sauver_nouvelle = function(elt) {

  elt = view.get_sauver_nouvelle(elt);

  let titre = view.getTitre(elt);
  let date = view.getDate(elt);
  let url = view.getUrl(elt);
  let news = model.new_rechercheNews(titre, date, url);

  if(indexOfResultat(model.recherche_courante_news, news) == -1){

    model.add_news_rech_cour_news(news);
  }
  let contenue = view.getItem_zone_saisie();
  model.remove_rech_cour_news_storage();
}

                          /////////////////////////////////

// Permet de supprimer une recherche en cliquant sur l'icone de disk à
// droite d'un résultat. L'icone est changée en disk et la recherche est
// ajoutée au tableau de recherche_courante_news
controler.supprimer_nouvelle = function(elt) {
  view.get_supprimer_nouvelle(elt);

  let titre = view.getTitre(elt);
  let date = view.getDate(elt);
  let url = view.getUrl(elt);
  let news = model.new_rechercheNews(titre, date, url);
  model.supprimer_nouvelle(news);
  model.remove_rech_cour_news_storage();
}

                          /////////////////////////////////

// Fonction permettant à l'utilisateur de valider le contenue de la zone de
// saisie à l'aide de la touche "entrer" du clavier
document.getElementById('zone_saisie').onkeyup = function(e){
  var e = window.event || e;
  var touche = e.charcode || e.keyCode;
  if(touche == 13){
    controler.rechercher_nouvelles();
  }
}


                          /////////////////////////////////
// Fonction d'autocompletion. Qui propose une autocompletion en fonction des
// éléments déjà entrés et gérés par la fonction nouveauTag du model
$( function() {

    $('#zone_saisie').autocomplete({
      source: model.availableTags
    });
} );
