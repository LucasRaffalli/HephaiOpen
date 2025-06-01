# Hephai
Hephai is an open-source invoice creation application that works locally.

[![Static Badge](https://img.shields.io/badge/EVR-Template-blue)](https://github.com/electron-vite/electron-vite-react)
![GitHub stars](https://img.shields.io/github/stars/LucasRaffalli/hephai?color)
![GitHub commit activity](https://img.shields.io/github/commit-activity/t/LucasRaffalli/hephai)
![GitHub License](https://img.shields.io/github/license/LucasRaffalli/hephai)
![Required Node.JS >= 18.0.0](https://img.shields.io/static/v1?label=node&message=>=18.0.0&logo=node.js&color=3f893e)


[French](README.fr.md) | English


## 🚀 Features

- **Invoice Creation**: Generate invoices quickly and easily.

- **Statistics Visualization**: View graphs on the number of invoices generated and other important metrics.

- **Offline mode**: Runs entirely locally, with no need for an Internet connection, except for **updates** via GitHub (handled automatically by `electron-updater`).

- **Local Storage**: All data is securely stored on your machine.


## 🛫 Quick Setup

```sh
# Clone the project
git clone https://github.com/LucasRaffalli/hephai.git

# Enter the project directory
cd hephai

# Install dependencies
npm install

# Launch the application in development mode
npm run dev
```

## 🧰 Technologies Used
This project uses the following technologies and libraries:
- **Electron**  for the desktop application: `electron`,`electron-builder`, `electron-updater`
- **React** for the user interface: `react`, `react-dom`, `react-router-dom`, `react-toastify`, `react-i18next`
- **PDF** Generation with `jsPDF` and `react-pdf` for creating PDF invoices
- **Internationalisation** with  `i18next` and `react-i18next`
- **UI/UX** with Radix UI: `@radix-ui/react-icons`, `@radix-ui/themes`, `lucide-react`

## 🤝 Contributing
If you wish to contribute to Hephai, feel free to open a pull request or report bugs via issues.

## 📄 License
This project is under the MIT license. See the LICENSE file for more details.

⚠️ Attribution appreciated:
If you use or modify HephaiOpen, a mention of Lucas Raffalli is welcome (README, site, application, etc.).

## 🌐 Website

soon

## 🔒 Privacy
Hephai runs entirely locally.  
The **only external interaction** is the **automatic update** system, managed by `electron-updater`, which checks the project's **GitHub-releases**.  
No personal data is sent or stored externally.
