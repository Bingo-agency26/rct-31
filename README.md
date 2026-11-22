# RCT31 — Chauffeur privé

Site statique autonome : accueil, services, véhicule, cinq articles, demande de trajet et rappel.

## Publication
GitHub Pages : branche `main`, dossier racine `/`. Aucun build nécessaire. Les liens relatifs fonctionnent sous `/rct-31/`. Aucun domaine personnalisé n’est configuré avant l’achat du domaine.

## Formulaires EmailJS
Configuration publique dans `assets/email-config.js`. Le code transmet les demandes à EmailJS et n’affiche le succès qu’après une réponse positive. En cas d’erreur, les données restent dans le formulaire. La disponibilité et le tarif doivent être confirmés par le chauffeur.

Variables communes envoyées : `request_type`, `customer_name`, `customer_phone`, `customer_email`, `service`, `departure`, `destination`, `date`, `time`, `passengers`, `luggage`, `notes`, `message`, `title`, `name`, `from_name`, `email`, `reply_to`, `phone`. Le rappel ajoute `preferred_time`. Le champ `message` contient le récapitulatif complet.

Ne jamais ajouter de clé privée EmailJS au dépôt. Le destinataire doit rester défini dans le modèle EmailJS, pas dans les champs visiteurs. Pour un nouveau domaine, vérifier les origines autorisées dans EmailJS.

## Aperçu local
`python3 -m http.server 8000`, puis ouvrir `http://localhost:8000`.

## Ressources
Les images, polices et licences sont incluses. Voir `CREDITS.md`. Les mentions de médiation et la politique de conservation sont à finaliser par l’entreprise.
