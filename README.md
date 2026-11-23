# RCT31 — Chauffeur privé

Site GitHub Pages avec blog éditable dans Pages CMS. Les formulaires EmailJS restent indépendants du CMS.

## Gestion éditoriale
Connexion : https://app.pagescms.org — dépôt `Bingo-agency26/rct-31`, branche `main`.
Voir [le guide du blog](GUIDE-BLOG.md).
Configuration de l’éditeur : `.pages.yml`. Articles : `_posts/`. Photos réservées au blog : `assets/blog/`.

## Publication automatique
GitHub Pages doit rester configuré sur **Deploy from a branch**, branche `main`, dossier `/`.
Chaque enregistrement du CMS crée un commit ; GitHub reconstruit et publie le site avec Jekyll.
Ne pas réintroduire `.nojekyll` : les modèles du blog doivent être compilés.
Les anciens articles gardent leur URL. `published: false` masque un article du site, mais pas du dépôt public.
Les dates futures attendent un nouveau build après leur date : aucune programmation automatique n’est fournie.

## Développement
Installer Ruby et Bundler, puis `bundle install` et `bundle exec jekyll serve`.
Ouvrir http://localhost:4000/rct-31/ .
`bundle exec jekyll build` génère `_site/`, qui contient le site statique prêt à héberger.
Pour un futur domaine personnalisé, régler `url` et `baseurl` dans `_config.yml` en plus de la configuration GitHub Pages et du DNS.

## Accès client
Installer l’application GitHub Pages CMS uniquement sur ce dépôt. Inviter le client depuis Pages CMS après confirmation de son adresse e-mail. Ne jamais partager le compte GitHub administrateur. Les collaborateurs éditent le contenu et les médias, pas la configuration.

## EmailJS
Configuration publique : `assets/email-config.js`. Ne jamais ajouter de clé privée. Le destinataire reste configuré dans EmailJS. Vérifier les origines autorisées lors d’un changement de domaine. Le chauffeur confirme la disponibilité et le tarif.

## Ressources
Images, polices et licences incluses. Voir `CREDITS.md`. Conserver les crédits des photos touristiques dans les articles. Les mentions de médiation et la politique de conservation restent à finaliser par l’entreprise.
