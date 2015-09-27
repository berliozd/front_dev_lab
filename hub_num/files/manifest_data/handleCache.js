// Activer le nouveau cache quand il est disponible et recharger la page
window.applicationCache.addEventListener('updateready', function() {
  window.applicationCache.swapCache();
  console.log('Mise a jour du cache');
  //window.location.reload();
}, false);

// Notifier les erreurs
window.applicationCache.addEventListener('error', function(evt) {
  console.log('Erreur du cache : ' + evt);

}, false);

// Vérification de la version du manifest
window.applicationCache.addEventListener('checking', function(evt) {
  console.log('Vérification du cache : ' + evt);
}, false);

// Télécharger le nouveau cache quand le manifest a changé
window.applicationCache.addEventListener('obsolete', function(evt) {
  console.log('Le cache est obsolète : ' + evt);
  window.applicationCache.update();
}, false);

// Le manifest n'a pas changé
window.applicationCache.addEventListener('noupdate', function(evt) {
  console.log('Pas de mise à jour du cache : ' + evt);
}, false);

// Téléchargement d'une ressource modifiée
window.applicationCache.addEventListener('downloading', function(evt) {
  console.log('Téléchargement ressource modifié : ' + evt);
}, false);

// Téléchargement du cache terminé
window.applicationCache.addEventListener('cached', function(evt) {
  console.log('Téléchargement terminé : ' + evt);
}, false);