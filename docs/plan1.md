# Plan de réinitialisation — Checklist

Remplace les cases [ ] par [x] pour marquer les tâches terminées.

- [ x] 0. Préparation
	- [ ] Vérifier `.env` (`VITE_API_URL`, `VITE_API_KEY`) et redémarrer Vite.
	- [ ] Travailler sur une base de dev (XAMPP) — ne pas toucher prod.

- [x ] 1. Créer le service
	- [ ] Créer `src/services/resetService.js` (squelette exports : `getIds`, `deleteResource`, `resetImportedData`).

- [x ] 2. Implémenter `getIds(resource)`
	- [ ] GET `/{resource}?display=[id]` (responseType: "text").
	- [ ] Parser XML avec `xmlToList`.
	- [ ] Gérer erreurs → retourner `[]`.

- [ ] 3. Implémenter `deleteResource(resource,id)`
	- [ ] DELETE `/{resource}/{id}`.
	- [ ] Retourner `true`/`false`, log détaillé en cas d’erreur.

- [ ] 4. Tester isolément
	- [ ] Tester `getIds('products')` → valider liste d'IDs.
	- [ ] Tester `deleteResource` sur un ID de test (dev) en `dryRun` si besoin.

- [ ] 5. Écrire l’orchestrateur `resetImportedData(logCb)`
	- [ ] Ordonner suppression : orders → carts → combinations → product_option_values → product_options → products → customers → categories → taxes.
	- [ ] Collecter résumé `{deletedCounts, errors}`.
	- [ ] Ajouter option `dryRun` (liste sans supprimer).

- [ ] 6. Interface Vue
	- [ ] Mettre à jour `src/views/backoffice/ResetDataView.vue` : confirmation, bouton disabled, logs, résumé.
	- [ ] Appeler `resetImportedData((msg)=>logs.push(msg))`.

- [ ] 7. Sécurités
	- [ ] Confirmation explicite.
	- [ ] Autoriser exécution seulement en dev (ou demander mot de passe).
	- [ ] Option `dryRun` par défaut.

- [ ] 8. Pagination & robustesse
	- [ ] Si beaucoup d’IDs, faire pagination dans `getIds`.
	- [ ] Ajouter petits delays si timeout/rate limit.

- [ ] 9. Gestion erreurs & retry
	- [ ] Stocker erreurs par ressource/id.
	- [ ] Permettre réessai sur éléments en échec.

- [ ] 10. Tests finaux
	- [ ] Vérifier après reset que filtres `/products?filter[reference]=[...]` renvoient vide.
	- [ ] Tester scénarios : import partiel, import complet, rerun reset.

- [ ] 11. Amélioration (optionnel mais recommandé)
	- [ ] Implémenter tracking `batch_id` côté backend (tables `ps_myimport_batch`, `ps_myimport_items`).
	- [ ] Modifier import pour enregistrer les IDs créés avec `batch_id`.
	- [ ] Réimplémenter reset pour supprimer par `batch_id` (atomicité, robustesse).

- [ ] 12. Documentation
	- [ ] Documenter le workflow dans `docs/` (comment utiliser, précautions).
	- [ ] Ajouter checklist avant examen (clé API, base dev, sauvegarde).

---

Que veux‑tu que je fasse maintenant ?
- Je peux créer le squelette `src/services/resetService.js` et implémenter `getIds`.
- Ou on implémente ensemble la première tâche après que tu confirmes les cases cochées.


test dans le console
;(async () => {
  const mod = await import('/src/services/resetService.js')
  const ids = await mod.getIds('products')
  console.log('products ids:', ids)
})()
