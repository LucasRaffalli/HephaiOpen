# Hephai
Hephai est une application open-source de création de factures fonctionnant en local.

[![Static Badge](https://img.shields.io/badge/EVR-Template-blue)](https://github.com/electron-vite/electron-vite-react)
![GitHub stars](https://img.shields.io/github/stars/LucasRaffalli/hephai?color)
![GitHub commit activity](https://img.shields.io/github/commit-activity/t/LucasRaffalli/hephai)
![GitHub License](https://img.shields.io/github/license/LucasRaffalli/hephai)
![Required Node.JS >= 18.0.0](https://img.shields.io/static/v1?label=node&message=>=18.0.0&logo=node.js&color=3f893e)


[English](README.md) | Français

## 🚀 Fonctionnalités

- **Création de factures** : Génère des factures de manière simple et rapide.
- **Visualisation de statistiques** : Affichez des graphiques sur le nombre de factures générées et d'autres métriques importantes.
- **Mode hors-ligne** : Fonctionne entièrement en local, sans nécessité de connexion Internet, sauf pour les **mises à jour** via GitHub (gérées automatiquement par `electron-updater`).

- **Stockage local** : Toutes les données sont stockées en toute sécurité sur votre machine.

## 🛫 Installation rapide

```sh
# Cloner le projet
git clone https://github.com/LucasRaffalli/hephai.git

#  Entrer dans le répertoire du projet
cd hephai

# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm run dev
```

## 🧰 Technologies utilisées
Ce projet utilise les technologies et bibliothèques suivantes :
- **Electron** pour l'application de bureau : `electron`,`electron-builder`, `electron-updater`
- **React** pour l'interface utilisateur : `react`, `react-dom`, `react-router-dom`, `react-toastify`, `react-i18next`
- **PDF** Generation avec `jsPDF` et `react-pdf` pour la création de factures PDF
- **Internationalisation** avec `i18next` et `react-i18next`
- **UI/UX** avec Radix UI: `@radix-ui/react-icons`, `@radix-ui/themes`, `lucide-react`

## 🤝 Contribuer
Si tu souhaites contribuer à Hephai, n'hésite pas à ouvrir une pull request ou à signaler des bugs via les issues.

## 📄 Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

⚠️ Attribution appréciée :
Si tu utilises ou modifies HephaiOpen, une mention à Lucas Raffalli est la bienvenue (README, site, application, etc.).

## 🌐 Site Web

bientot

## 🔒 Confidentialité
Hephai fonctionne entièrement en local.  
La **seule interaction extérieure** est le système de **mise à jour automatique**, géré par `electron-updater`, qui vérifie les **releases GitHub** du projet.  
Aucune donnée personnelle n’est envoyée ou stockée à l’extérieur.
