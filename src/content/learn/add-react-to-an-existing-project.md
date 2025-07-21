---
title: Інтеграція React у наявний проєкт
---

<Intro>

Якщо ви хочете додати інтерактивності до вашого проєкту, не потрібно переписувати його на React. Додайте React до вашого наявного технологічного стеку і ви зможете рендерити інтерактивні компоненти React будь-де.

</Intro>

<Note>

**Вам потрібно встановити [Node.js](https://nodejs.org/en/) для локальної розробки.** Не дивлячись на те, що ви можете [спробувати React](/learn/installation#try-react) онлайн або на простій HTML-сторінці, насправді більшість JavaScript-інструментів, які ви захочете використовувати для розробки, потребують Node.js.

</Note>

## Використання React для усього підмаршруту наявного вебсайту {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Припустимо, що у вас є вебзастосунок, що існує за адресою `example.com` та створений за допомогою іншої серверної технології (як-от Rails), і ви хочете реалізувати всі маршрути, які починаються з `example.com/some-app/`, використовуючи лише React.

Ось як ми рекомендуємо це налаштувати:

<<<<<<< HEAD
1. **Побудуйте React-частину вашого застосунку**, використовуючи один із [фреймворків на основі React](/learn/start-a-new-react-project).
2. **Позначте `/some-app` як *базовий шлях*** у конфігурації вашого фреймворку (ось як: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Налаштуйте свій сервер або проксі**, щоб всі запити під шляхом `/some-app/` оброблялися вашим React-застосунком.

Це надасть React-частині вашого застосунку всі [переваги від найкращих практик](/learn/start-a-new-react-project#can-i-use-react-without-a-framework), вбудованих у ці фреймворки.
=======
1. **Build the React part of your app** using one of the [React-based frameworks](/learn/creating-a-react-app).
2. **Specify `/some-app` as the *base path*** in your framework's configuration (here's how: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Configure your server or a proxy** so that all requests under `/some-app/` are handled by your React app.

This ensures the React part of your app can [benefit from the best practices](/learn/creating-a-react-app#full-stack-frameworks) baked into those frameworks.
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

Багато фреймворків на основі React є повностековими (full-stack) та дають змогу вашому React-застосунку скористатися можливостями сервера. Однак ви можете використовувати цей же підхід, навіть якщо у вас немає змоги або бажання виконувати JavaScript на сервері. У цьому випадку слід надавати експорт HTML/CSS/JS ([результат `next export`](https://nextjs.org/docs/advanced-features/static-html-export) для Next.js, стандартно для Gatsby) за адресою `/some-app/`.

## Використання React для частини наявної сторінки {/*using-react-for-a-part-of-your-existing-page*/}

Припустимо, що у вас вже є сторінка, побудована за допомогою іншої технології (чи то серверна, як-от Rails, чи клієнтська, як-от Backbone), і ви хочете рендерити інтерактивні React-компоненти десь на цій сторінці. Це поширений спосіб інтегрувати React — так, насправді, здебільшого використовувався React у Meta протягом багатьох років!

Ви можете зробити це у два кроки:

1. **Налаштуйте JavaScript-середовище**, яке б давало змогу вам використовувати [JSX-синтаксис](/learn/writing-markup-with-jsx), розділіть ваш код на модулі із синтаксисом [`import`](https://webdoky.org/uk/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) і користуйтеся пакетами (наприклад, React) з [npm](https://www.npmjs.com/) реєстру пакетів.
2. **Рендеріть ваші React-компоненти** там, де ви б хотіли бачити їх на сторінці.

Конкретний підхід залежить від налаштувань вашої сторінки, тому розглянемо детальніше.

### Крок 1: Налаштуйте модульне JavaScript-середовище {/*step-1-set-up-a-modular-javascript-environment*/}

Модульне середовище JavaScript дає вам змогу писати ваші React-компоненти в окремих файлах замість того, щоб писати весь ваш код у єдиному файлі. Воно також дає змогу використовувати всі дивовижні пакети, опубліковані іншими розробниками у [npm](https://www.npmjs.com/)-реєстрі — включно із React! Те, як ви це зробите, залежить від ваших наявних налаштувань:

* **Якщо ваш застосунок вже розділений на файли, які використовують вираз `import`,** спробуйте використовувати ті налаштування, які у вас вже є. Перевірте, чи написання `<div />` у вашому JS-коді спричиняє синтаксичну помилку. Якщо це так, ймовірно, вам потрібно [трансформувати ваш JavaScript-код, використовуючи Babel](https://babeljs.io/setup), і включити [попереднє налаштування Babel React](https://babeljs.io/docs/babel-preset-react), щоб користуватися JSX.

* **Якщо ваш застосунок не налаштований, щоб компілювати JavaScript-модулі,** налаштуйте його за допомогою [Vite](https://vite.dev/). Спільнота Vite підтримує [багато інтеграцій із фреймворками для сервера](https://github.com/vitejs/awesome-vite#integrations-with-backends), включно з Rails, Django і Laravel. Якщо вашого серверного фреймворку немає у списку, [дотримуйтеся цього посібника](https://vitejs.dev/guide/backend-integration.html), щоб із ним вручну інтегрувати Vite-збірку.

Щоб перевірити, що ваше налаштування працює, виконайте цю команду з директорії проєкту:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Після цього додайте ці рядки коду на початку вашого основного JavaScript-файлу (він може називатися index.js або main.js):

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Контент вашої сторінки (у цьому прикладі він заміняється) -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Очистимо наявний зміст HTML
document.body.innerHTML = '<div id="app"></div>';

// Замість нього відрендеримо ваш React-компонент
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

Якщо весь зміст вашої сторінки був замінений на "Hello, world!", все спрацювало! Продовжуйте читати.

<Note>

Перша інтеграція модульного середовища JavaScript у наявний проєкт може лякати, але це того варте! Якщо ви застрягли, спробуйте скористатися [ресурсами нашої спільноти](/community) або [чатом Vite](https://chat.vite.dev/).

</Note>

### Крок 2: Рендеріть React-компоненти будь-де на сторінці {/*step-2-render-react-components-anywhere-on-the-page*/}

На попередньому кроці ви записали цей код на початку вашого основного файлу:

```js
import { createRoot } from 'react-dom/client';

// Очистимо наявний зміст HTML
document.body.innerHTML = '<div id="app"></div>';

// Замість нього відрендеримо ваш React-компонент
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Звісно, насправді ви не хочете видаляти поточний HTML-вміст!

Видаліть цей код.

Замість цього, мабуть, ви хочете рендерити ваші React-компоненти у специфічних місцях вашого HTML. Відкрийте вашу HTML-сторінку (або серверний шаблон, що генерує її) і додайте унікальний атрибут [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) будь-якому тегові, наприклад:

```html
<!-- ... десь у вашому html ... -->
<nav id="navigation"></nav>
<!-- ... інший html ... -->
```

Це дає вам змогу знайти цей HTML-елемент, використовуючи [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById), і передати його у [`createRoot`](/reference/react-dom/client/createRoot), щоб ви могли рендерити ваші React-компоненти всередині нього:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>Цей параграф є частиною HTML.</p>
    <nav id="navigation"></nav>
    <p>Цей параграф також є частиною HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Дійсно створити навігаційну панель
  return <h1>Привіт від React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Зверніть увагу, як оригінальний зміст HTML з `index.html` зберігся, проте ваш власний `NavigationBar` React-компонент тепер зображуються всередині `<nav id="navigation">` із вашого HTML. Читайте [документацію використання `createRoot`](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react), щоб дізнатися більше про рендеринг компонентів React всередині наявної HTML-сторінки.

<<<<<<< HEAD
Коли ви впроваджуєте React у наявний проєкт, стандартна практика — починати з невеликих інтерактивних компонентів (наприклад, кнопок), а потім поступово "підійматися вгору" до моменту, поки вся ваша сторінка не буде побудована з використанням React. Після цього ми рекомендуємо одразу перейти до [фреймворку React](/learn/start-a-new-react-project), щоб найбільш ефективно його використовувати.
=======
When you adopt React in an existing project, it's common to start with small interactive components (like buttons), and then gradually keep "moving upwards" until eventually your entire page is built with React. If you ever reach that point, we recommend migrating to [a React framework](/learn/creating-a-react-app) right after to get the most out of React.
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

## Використання React Native у наявному нативному застосунку {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) також може бути інтегрований у наявні нативні застосунки поступово. Якщо у вас вже є нативний застосунок для Android (Java або Kotlin) або iOS (Objective-C або Swift), [дотримуйтесь цього посібника](https://reactnative.dev/docs/integration-with-existing-apps), щоб додати екран React Native до нього.
