---
id: create-a-new-react-app
title: Створюємо новий React-додаток
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

Для більш комфортної роботи використовуйте вбудований набір інструментів.

Ця сторінка описує декілька  популярних наборів інструментів для роботи з React, що допоможуть вам з такими задачами як:

* Масштабування великої кількості компонентів та файлів.
* Використання сторонніх бібліотек з npm.
* Раннє виявлення розповсюджених помилок.
* Миттєве відстеження змін у CSS та JS файлах.
* Оптимізація коду для продакшну.

Набори інструментів описані на цій сторінці **не потребують додаткового налаштування для початку роботи з ними**.

## Чи додаткові інструменти необхідні для вас? {#you-might-not-need-a-toolchain}

Якщо у вас не виникає проблем з вище описаними ситуаціями, або ж якщо ви ще не відчуваєте себе достатньо впевнено для використання інструменів для роботи з JavaScript, розгляньте можливість [додання React за допомогою тегу `<script>` на HTML-сторінку](/docs/add-react-to-a-website.html), при необхідності [за допомогою JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

Також це **найпростіший спосіб додати бібліотеку React до існуючого сайту.** Ви завжди можете розширити набір інструментів, за потребою!

## Рекомендований набір інструментів {#recommended-toolchains}

В першу чергу команда React рекомендує наступні рішення:

- Якщо ви **вивчаєте React** або **створюєте новий [односторінковий](/docs/glossary.html#single-page-application) додаток,** використовуйте [Create React App](#create-react-app).
- Якщо ви створюєте **серверний сайт з допомогою Node.js,** спробуйте [Next.js](#nextjs).
- Якщо ви створюєте **статичний контент-орієнтований вебсайт,** спробуйте [Gatsby](#gatsby).
- Якщо ви створюєте **бібліотеку компонентів** або **інтегруєте існуючий код**, спробуйте [більш гнучкий набір інструментів](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) -- це комфортний осередок для **вивчення React**, а також це найкращий шлях щоб почати будувати **нові [односторінкові](/docs/glossary.html#single-page-application) додатки** за допомогою React.

Він встановлює осередок для разробки таким чином, щоб ви могли використовувати найновіші можливості JavaScript, робить розробку комфортнішою, а також оптимізує ваш додаток для продакшну. Вам знадобиться Node версії >= 6 та npm версії >= 5.2 на вашому комп'ютері. Для створення проекту виконайте:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>Примітка
>
>`npx` на першому рядку це не одрук. Це [інструмент для запуску пакетів, з'явившийся в npm версії 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App не опрацьовує бекенд логіку чи логіку баз данних, а лише надає команди для побудови фронтенду, тому ви можете використовувати його з будь-яким бекендом. Під капотом він використовує [Babel](https://babeljs.io/) та [webpack](https://webpack.js.org/), але вам не треба нічого знати про них.

Коли ваш додаток буде готовий для розгортання на продакшн, запустіть команду `npm run build`, це створить оптимізовану версію вашого додатку у папці `build`. Ви можете дізнатись більше про Create React App [з його README](https://github.com/facebookincubator/create-react-app#create-react-app--) та [його керівництва користувача](https://facebook.github.io/create-react-app/).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) це популярний й легкий фреймворк для **статичних та серверних додатків**, створений з допомогою React. Він включає **готові рішення для стилізації та маршрутизації** й передбачає, що ви використовуєте [Node.js](https://nodejs.org/) як серверний осередок.

Дізнайтесь більше про Next.js з [його офіційного керівництва](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) це найкращий спосіб створити **статичний вебсайт** з React. Він дозволяє використовувати React-компоненти, але виводить попередньо відрендеренний HTML та CSS, щоб гарантувати найшвидший час завантаження.

Дізнайтесь більше про Gatsby з [його офіційного керівництва](https://www.gatsbyjs.org/docs/) та [галереї стартових наборів](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Більш гнучкі набори інструментів {#more-flexible-toolchains}

Наступні набори пропонують більше гнучкості та вибору. Ми рекомендуємо їх для більш досвідчених розробників:

- **[Neutrino](https://neutrinojs.org/)** поєднує у собі [webpack](https://webpack.js.org/) з простотою його пресетів та включає в себе пресети для [React-додатків](https://neutrinojs.org/packages/react/) й [React-компонентів](https://neutrinojs.org/packages/react-components/).

- **[nwb](https://github.com/insin/nwb)** чудово використовувати для [публікації React-компонентів у npm](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb). Він [також може використовуватись для](https://github.com/insin/nwb/blob/master/docs/guides/ReactApps.md#developing-react-apps-with-nwb) для створення React-додатків. 

- **[Parcel](https://parceljs.org/)** -- швидкий бандлер веб-додатків з нульовою конфігурацією, [який працює з React](https://parceljs.org/recipes.html#react).

- **[Razzle](https://github.com/jaredpalmer/razzle)** -- це фреймворк для серверного рендерингу, що не потребує ніякої конфігурації, але більш гнучкий ніж Next.js.

## Створення набору інструментів з нуля {#creating-a-toolchain-from-scratch}

Набір інструментів JavaScript зазвичай включає:

* **Менеджер пакетів**, такий як [Yarn](https://yarnpkg.com/) або [npm](https://www.npmjs.com/). Він дозволяє отримати переваги великої екосистеми сторонніх пакетів, а також легкість їх встановлення чи оновлення.

* **Бандлер**, такий як [webpack](https://webpack.js.org/) або [Parcel](https://parceljs.org/). Він надає можливість писати модульний код та збирати його у невеликі пакети з метою оптимізації часу завантаження.

* **Компілятор**, такий як [Babel](https://babeljs.io/). Він дозволяє писати сучасний JavaScript код, що буде працювати у старіших браузерах.

Якщо ви віддаєте перевагу написанню власного набору JavaScript-інструментів з нуля, [ознайомтесь з цим керівництвом](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658), в якому відтворюється деяка функціональність Create React App.

Не забудьте переконатись, що ваш власний набір інструментів [правильно налаштований для продакшну](/docs/optimizing-performance.html#use-the-production-build).
