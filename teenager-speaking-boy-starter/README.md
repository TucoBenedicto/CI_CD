# Teenage Boy Speaking with React + TDD starter kit

## But de ce TP

Recréer le petit projet Teenage Boy Speaking avec React, en mode TDD + CI/CD (Vercel pour le CD).
À l'aide de ViteJS et sa suite de tests Vitest.

[TOC]

## Création du projet

### NPM

```bash
npm create vite@latest teenage-boy-speaking
```

### Yarn

```bash
yarn create vite teenage-boy-speaking
```

Choisir les options suivantes :

- Framework : React
- Variant : JavaScript

## Ajouter les dépendances pour les tests

```bash
yarn add -D vitest @vitest/ui @vitest/coverage-v8
```

Puis ouvrez le fichier package.json, et ajoutez dans la partie scripts les lignes suivantes :

```json
  "scripts": {
    ...
    "test": "vitest",
    "test:ui": "vitest test --ui",
    "test:coverage": "vitest run --coverage",
  }
```

### Installer des extensions qui vont nous aider un peu

- Vitest
- [Vitest Snippets](https://marketplace.visualstudio.com/items?itemName=deinsoftware.vitest-snippets)

### Vérifier que vitest fonctionne correctement

Créez un fichier Main.test.js dans le dossier "tests"

```js
import { it, expect, describe } from "vitest";

describe("Some test", () => {
  it("should be truthy", () => {
    expect(1).toBeTruthy();
  });
});
```

Depuis le terminal lancer la commande `yarn run test`
La sortie devrait vous montrer à présent le résultat positif du test

Depuis le terminal lancer la commande `yarn run test:ui`
Un navigateur s'ouvre et vous affiche le résultat du test qui doit être positif également.

Depuis le terminal lancer la commande `yarn run test:coverage`
Cela génère un dossier coverage dans votre projet, vous pouvez ouvrir le fichier [index.html](./coverage/index.html)

## Installer les librairies des tests

Pour pouvoir tester une application codée en React, nous allons avoir besoin d'un peu d'outillage, notamment des librairies de tests.

### React Testing Library

Cette librairie va nous aider à "render" nos composants et d'interagir avec.

[Documentation React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### Jsdom Testing Library

Par défaut les tests sont exécutés dans un environnement NodeJS, mais NodeJS n'a aucune idée de ce que sont les APIs du web comme le DOM.
Pour pouvoir tester nos composants React, nous allons devoir exécuter nos tests dans un environnement qui émule un navigateur.
[Documentation jsdom](https://github.com/jsdom/jsdom)

### Jest-dom

Pour faire des tests sans s'ennuyer, il nous faut des matchers qui vont nous éviter de répéter sans cesse les mêmes opérations, comme contrôler la présence d'un élément, ses attributs, et son contenu texte…
[Documentation jest-dom](https://github.com/testing-library/jest-dom)

### User-event Testing Library

Pour interagir avec mon application, il nous faut un simulateur d'événements.
[Documentation user-event](https://testing-library.com/docs/user-event/intro)

```bash
yarn add -D @testing-library/react jsdom @testing-library/jest-dom @testing-library/user-event
```

### Un peu de configuration

Créez un fichier setup.js dans le dossier tests avec le contenu suivant :

```js
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

Créez un fichier vitest.config.js

```js
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.js"],
    coverage: {
      enabled: true,
    },
  },
});
```

Comme nous avons modifié le fichier de config, il faut relancer vitest.

## Préparer le dépôt GIT et Gitlab CI/CD

Créer et éditer le fichier .gitignore et ajoutez l'élément suivant :

```bash
coverage
```

### Créer le dépôt Git

Allez sur votre compte Giltab et créez un nouveau projet vide (sans fichier README).
Puis dans le terminal de VScode, saisissez les commandes suivantes :e

```bash
git init --initial-branch=main
git remote add origin git@gitlab.com:<MonUser>/<NomDeMonProjet>.git
git add .
git commit -m "Initial commit"
git push --set-upstream origin main
```

### Mise en place du CI/CD

À la racine du projet, ajouter un fichier .gitlab-ci.yml

```yaml
image: node:latest

before_script:
  - apt update && apt install

stages:
  - build
  - test
  - staging

Build:
  stage: build
  before_script:
    - yarn config set cache-folder .yarn
    - yarn install
  script:
    - yarn build

Test:
  stage: test
  before_script:
    - yarn config set cache-folder .yarn
    - yarn install --frozen-lockfile
  script:
    # Installs Chrome
    - wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub |  apt-key add -
    - echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' |  tee /etc/apt/sources.list.d/google-chrome.list
    - apt-get update
    - apt-get install google-chrome-stable -y
    - yarn test

Deploy to Staging:
  stage: staging
  script:
    - echo "Ready to deploy !"
    - echo "Nice shot !"
```

### On passe au vert !

Commitez et poussez le code dans le dépôt, cela devrait déclencher un pipeline qui devrait réussir !

### Créer un compte Vercel

Utilisez votre compte Gitlab, cela simplifie grandement les choses !

[Vercel](https://vercel.com)

Une fois sur le dashboard, choisissez Add New... => Project
Importez le dépôt Git correspondant.

## Que tester ?

Pour commencer, parlons un instant de ce qu'il faut tester et ce que l'on peut éviter de tester, le plus important !
Concernant les composants React, il y a deux éléments fondamentaux à tester :

### Leurs rendus,

Pour le rendu, on doit vérifier que le composant s'affiche correctement en fonction de certaines conditions ou props, sa présence et son contenu.

### Leurs interactions

Si notre composant gère des événements au clic ou au clavier ou autre, nous devons le simuler et vérifier qu'il réagit comme on le souhaite.

### En résumé

L'idée globale est de tester le comportement et non l'implémentation, on teste ce que fait l'application et non comment elle est fabriquée.
, on code ce qu'il faut pour faire passer le test au vert, rien de plus. Pas d'anticipation, pas de "j'en aurais besoin plus tard !".

Gardez en mémoire les vieux adages :

1. Planning is guessing
2. KISS (Keep it simple and stupid).

## Quelques "User-stories"

Créez ces stories dans votre projet

- As a user I should see the page title Teenage Boy Speaking
- As a user I should see a form input to type text in it
- As a user I should see a button to submit typed text to the teenager
- As a user I should see the brainless message from the Teenager
- As a user I want to receive "Bien sûr" when I type a lowercase question like "Comment allez-vous ?"
- As a user I want to receive "Whoa, calmos !" when I type all words upcase
- As a user I want to receive "Calmez-vous, je sais ce que je fais !" when I type an uppercase question
- As a user I want to receive "Bien, on fait comme ça !" when I type nothing
- As a user I want to receive "Peu importe !" when I type anything else

## Soyons agiles !

### Premier test

Dans Gitlab, prenez la première Issue (As a user I should see the page title Teenage Boy Speaking) et cliquez sur "Create a merge request".
Vous pouvez modifier les options, mais de base cela va fonctionner.
Validez la création.

Retournez dans Vscode et dans le terminal saisissez

```bash
git pull --all
```

Vous devriez avoir une nouvelle branche qui a été tirée.

```bash
* [nouvelle branche] 1-as-a-user-i-should-see-the-page-title-teenage-boy-speaking -> origin/1-as-a-user-i-should-see-the-page-title-teenage-boy-speaking
```

Si tout est OK à ce stade, tapez la commande dans le terminal

```bash
git checkout 1-as-a-user-i-should-see-the-page-title-teenage-boy-speaking
```

### Le test

Créez un fichier UI.test.jsx dans le dossier tests

```js
import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("UI test", () => {
  it("should display the page title", () => {
    // 1. Render App
    render(<App />);

    // 2. Expect that the title is there
    expect(screen.getByRole("heading")).toBeInTheDocument();

    // 3. Expect that the title is : "Teenage Boy Speaking"
    expect(screen.getByRole("heading")).toHaveTextContent(
      "Teenage Boy Speaking"
    );
  });
});
```

Ce test doit échouer lamentablement,

### On passe au vert bis

Un peu d'outils pour se faciliter la vie.

```bash
yarn add -D sass
yarn add bootstrap @popperjs/core
```

Supprimez tous ces fichiers :

- src/assets/react.svg
- src/App.css
- src/index.css
- public/vite.svg

Créez les fichiers suivants :

- src/stylesheets/application.sass

et saisissez

```scss
@import bootstrap/scss/bootstrap;
```

Dans le fichier src/main.jsx, ajouter la ligne :

```js
import * as bootstrap from "bootstrap";
```

et remplacer la ligne :

```js
import "/index.css";
```

par

```js
import "./stylesheets/application.sass";
```

Ouvrez le fichier src/App.jsx et supprimer tout le contenu et le remplacer par :

```js
import { useState, useEffect } from "react";

function App() {
  return (
    <>
      <div className="container">
        <div className="row my-5">
          <div className="col">
            <h1 className="text-center">Teenage Boy Speaking</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
```

### Auto merge et déploiement

1. Commitez le code avec un message explicatif, puis poussez-le sur le dépôt.
2. Rendez-vous sur votre Gitlab, dans la fenêtre "Merge Request".
3. Ouvrez le merge request qui a été créé et cliquez sur le bouton "Auto-merge"
4. Patientez que la suite de test passe, constatez que le code est mergé dans la fenêtre "Pipelines", la suite de test passe à nouveau, si tout va bien, vous pourrez visualiser sur votre compte Vercel la mise à jour déployée.

## À vous de jouer

Je vous propose de réaliser cet exercice dans son intégralité en mode TDD.

Je vous rappelle les consignes de l'exercice :

- Bob est un adolescent nonchalant. Dans la conversation, ses réponses sont très limitées.
- Bob répond "Bien sûr." Si vous lui posez une question, comme "Comment allez-vous ?".
- Il répond "Whoa, calmos !" si vous CRIEZ SUR LUI (tout en capital).
- Il répond "Calmez-vous, je sais ce que je fais !" si vous lui criez une question.
- Il dit "Bien, on fait comme ça !" si vous lui parlez sans rien dire.
- Il répond "Peu importe !" à n’importe quoi d’autre.
- Le partenaire conversationnel de Bob est un puriste quand il s’agit de communication écrite et suit toujours les règles normales concernant la ponctuation des phrases en français.

Vous allez avoir besoin des éléments suivants :

Les styles pour le nuage

```scss
.thought {
  display: flex;
  background-color: pink;
  padding: 20px;
  border-radius: 30px;
  min-width: 40px;
  max-width: 220px;
  min-height: 40px;
  margin: 20px;
  position: relative;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.thought:before,
.thought:after {
  content: "";
  background-color: pink;
  border-radius: 50%;
  display: block;
  position: absolute;
  z-index: -1;
}
.thought:before {
  width: 44px;
  height: 44px;
  top: -12px;
  left: 28px;
  box-shadow: -50px 30px 0 -12px pink;
}
.thought:after {
  bottom: -10px;
  right: 26px;
  width: 30px;
  height: 30px;
  box-shadow: 40px -34px 0 0 pink, -28px -6px 0 -2px pink,
    -24px 17px 0 -6px pink, -5px 25px 0 -10px pink;
}
```

Un site de test d'expressions régulières, par exemple [rubular](https://rubular.com)

Et le fichier image de Marco qui est dans le dépôt.

**Bon courage à tous.**
**Pour chaque User Story, il doit y avoir un merge request, et un déploiement.**
**L'usage des expressions régulières est mandataire.**

**A l'issu du travail, vous devez me fournir l'url de l'app sur Vercel, l'accès au dépot git.**

Pour les sportifs, vous pouvez ajouter une ou plusieurs fonctionnalités supplémentaires de votre choix.
