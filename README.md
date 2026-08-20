# GitRepo Manager 

GitRepo Manager est une application SaaS conçue pour les enseignants. Elle permet de simplifier et d'automatiser la création de groupes d'étudiants et la génération de repositories GitHub au sein d'une organisation dédiée pour un cours.

Lien vidéo : https://youtu.be/56gTsmIFw0o

## 📝 Informations Générales

L'application est divisée en deux parties (Frontend et Backend) et permet de :
* Gérer un tableau de bord des cours dispensés par l'enseignant.
* Configurer les règles de création de repositories (organisation GitHub, nombre d'étudiants min/max, format du nom).
* Générer un lien d'inscription public et sécurisé pour les étudiants.
* Automatiser la création des repositories privés sur GitHub et l'ajout des étudiants en tant que collaborateurs via l'API GitHub.
* Bloquer les modifications de configuration une fois le lien d'inscription généré pour garantir la cohérence des données.

### 🛠 Technologies Utilisées
* **Frontend :** React, React Router, Axios, CSS Modules, TypeScript.
* **Backend :** Node.js, Express, MongoDB (Mongoose), TypeScript.
* **Sécurité & API :** JWT (Authentification), Joi (Validation des données), Helmet & CORS (Sécurité HTTP), Bcrypt (Hachage mots de passe), Crypto (Chiffrement AES-256 du token GitHub).

---

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :
1. [Node.js](https://nodejs.org/) (version 16+ recommandée).
2. [MongoDB](https://www.mongodb.com/try/download/community) (instance locale ou cluster cloud).
3. Un compte GitHub avec un **Personal Access Token (PAT)** généré avec les droits `repo` et `admin:org`.

---

## 🚀 Installation et Configuration (Set up depuis 0)

### 1. Récupérer le projet

Clonez le dépôt sur votre machine locale et naviguez dans le dossier du projet :
```bash
git clone <votre-lien-github>
cd GitRepo-Manager
```

### 2. Installer les dépendances
Le projet étant séparé, vous devez installer les dépendances pour le backend et le frontend. Ouvrez deux terminaux distincts :

Terminal 1 (Backend) :
```bash
cd backend
npm install
```

Terminal 2 (Frontend) :
```bash
cd frontend
npm install
```

### 3. Configurer les variables d'environnement
Dans le dossier backend, créez un fichier nommé exactement `.env` et copiez-y le contenu suivant. Remplacez les valeurs par vos propres informations.

⚠️ **Important :** Ne commitez jamais ce fichier `.env` sur GitHub.

```env
# --- Serveur ---
PORT=3000

# --- Base de données ---
MONGODB_URI=mongodb://127.0.0.1:27017/github-manager

# --- Sécurité & Authentification ---
JWT_SECRET=VotreSuperSecretJWTDePlusDe32Caracteres
# La clé de chiffrement DOIT faire exactement 32 caractères
ENCRYPTION_KEY=UneCleSecreteDe32CaracteresExact

# --- Initialisation de l'Administrateur (Professeur) ---
USER_EMAIL=prof@universite.com
USER_PASSWORD=MotDePasseTresSecurise123!

# --- API GitHub ---
# Token avec les droits 'repo' et 'admin:org'
GITHUB_PAT=ghp_VotreVraiTokenGitHubIci
```

### 4. Initialiser la base de données (Seed)
Toujours dans le dossier backend, exécutez le script d'initialisation pour créer le compte administrateur. Ce script hache le mot de passe et chiffre le token GitHub en base de données.

```bash
npm run seed
```
(Un message de succès s'affichera dans la console confirmant la création du compte).

### 5. Lancer l'application
Démarrez les deux serveurs en parallèle dans vos deux terminaux :

Terminal 1 (Backend) :
```bash
# Depuis le dossier /backend
npm run dev
```

Terminal 2 (Frontend) :
```bash
# Depuis le dossier /frontend
npm run dev
```

L'application est maintenant fonctionnelle ! Vous pouvez ouvrir votre navigateur à l'adresse indiquée par le terminal du frontend (généralement http://localhost:5173 ou http://localhost:3000) et vous connecter avec les identifiants définis dans votre `.env`.
