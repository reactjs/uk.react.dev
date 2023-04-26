---
title: Інтеграція React в існуючий проект
---

<Intro>

Якщо ви хочете додати інтерактивності до вашого існуючого проєкту, не потрібно переписувати його на React. Додайте React до вашого наявного технологічного стеку і ви зможете рендерити інтерактивні React компоненти будь-де.

</Intro>

<Note>

**Вам потрібно встановити [Node.js](https://nodejs.org/en/) для локальної розробки.** Не дивлячись на те, що ви можете [спробувати React](/learn/installation#try-react) онлайн або на простій HTML сторінці, в реальності більшість JavaScript інструментів, які ви захочете використовувати для розробки, потребують Node.js.

</Note>

## Використання React для усього саброуту існуючого вебсайту {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Припустимо, що у вас є веб застосунок, що існує за адресою `example.com`, створений за допомогою іншої серверної технології (такої як Rails) і ви хочете реалізувати всі роути, які починаються з `example.com/some-app/` повністю використовуючи React.

Ось як ми рекомендуємо це налаштувати:

1. **Побудуйте React частину вашого додатку**, використовуючи один із [фреймворків на основі React](/learn/start-a-new-react-project).
2. **Позначте `/some-app` як *базовий шлях*** в конфігурації вашого фреймворку (ось як: [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Налаштуйте свій проксі або сервер**, щоб всі запити під шляхом `/some-app/` оброблялися вашим React-додатком.

Це забезпечує React-частині вашого застосунку отримання всіх [переваг найкращих практик](/learn/start-a-new-react-project#can-i-use-react-without-a-framework), вбудованих у ці фреймворки.

Багато фреймворків на основі React є повностековими та дозволяють вашому React-додатку скористатися можливостями сервера. Однак ви можете використовувати цей же підхід, навіть якщо ви не можете або не хочете виконувати JavaScript на сервері. У цьому випадку, слід надавати HTML/CSS/JS експорт ([`next export` вихід](https://nextjs.org/docs/advanced-features/static-html-export) для Next.js, за замовчуванням для Gatsby) за адресою `/some-app/`.

## Використання React для частини існуючої сторінки {/*using-react-for-a-part-of-your-existing-page*/}

Припустимо, що у вас є існуюча сторінка, побудована за допомогою іншої технології (будь то серверна, така як Rails, або клієнтська, така як Backbone), і ви хочете рендерити інтерактивні React компоненти десь на цій сторінці. Це поширений спосіб інтегрувати React--насправді, це те, як більша частина використання React виглядала в Meta протягом багатьох років!

Ви можете зробити це у два кроки:

1. **Налаштуйте JavaScript середовище**, яке б дозволяло вам використовувати [JSX синтаксис](/learn/writing-markup-with-jsx), розділіть ваш код на модулі з [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) синтаксисом і користуйтеся пакетами (наприклад, React) з [npm](https://www.npmjs.com/) реєстру пакетів.
2. **Рендеріть ваші React компоненти** там, де ви б хотіли бачити їх на сторінці.

Конкретний підхід залежить від налаштувань вашої існуючої сторінки, тому розглянемо деякі деталі.

### Крок 1: Налаштуйте модульне JavaScript середовище {/*step-1-set-up-a-modular-javascript-environment*/}

Модульне JavaScript середовище дозволяє вам писати ваші React компоненти в окремих файлах замість того, щоб писати весь ваш код в єдиному файлі. Воно також дозволяє вам використовувати всі дивовижні пакети, опубліковані іншими розробниками до [npm](https://www.npmjs.com/) реєстру--включаючи сам React! Те, як ви це зробите, залежить від ваших наявних налаштувань:

* **Якщо ваш додаток вже розділений на файли, які використовують `import` вираз,** спробуйте використовувати ті налаштування, які в вас вже є. Перевірте, чи написання `<div />` в вашому JS коді спричиняє синтаксичну помилку. Якщо це спричиняє синтаксичну помилку, мабуть, вам потрібно [трансформувати ваш JavaScript код використовуючи Babel](https://babeljs.io/setup) і включити [попереднє налаштування Babel React](https://babeljs.io/docs/babel-preset-react), щоб користуватися JSX.

* **Якщо ваш застосунок не налаштований, щоб компілювати JavaScript модулі,** налаштуйте його використовуючи [Vite](https://vitejs.dev/). Спільнота Vite утримує [багато інтеграцій з бекенд фреймворками](https://github.com/vitejs/awesome-vite#integrations-with-backends), включаючи Rails, Django і Laravel. Якщо вашого бекенд фреймворку немає в списку, [дотримуйтесь цього посібника](https://vitejs.dev/guide/backend-integration.html), щоб вручну інтегрувати Vite білди з вашим бекендом.

Щоб перевірити, що ваше налаштування працює, запустіть цю команду з папки проєкту:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Після цього додайте ці рядки коду на початку вашого основного JavaScript-файлу (він може називатися index.js або main.js):

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Контент вашої існуючої сторінки (у цьому прикладі, він підміняється) -->
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

// Очистимо існуючий зміст HTML
document.body.innerHTML = '<div id="app"></div>';

// Замість нього відрендеримо ваш React компонент
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

Якщо весь зміст вашої сторінки був замінений на "Hello, world!", все спрацювало! Продовжуйте читати.

<Note>

Інтеграція модульного середовища JavaScript в існуючий проєкт вперше може може відчуватись лякаюче, але це того варте! Якщо ви застрягли, спробуйте скористатися [ресурсами нашої спільноти](/community) або [чатом Vite](https://chat.vitejs.dev/).

</Note>

### Крок 2: Рендеріть React компоненти будь-де на сторінці {/*step-2-render-react-components-anywhere-on-the-page*/}

У попередньому кроці, ви записали цей код на початку вашого основного файлу:

```js
import { createRoot } from 'react-dom/client';

// Очистимо існуючий зміст HTML
document.body.innerHTML = '<div id="app"></div>';

// Замість нього відрендеримо ваш React компонент
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Звісно, насправді ви не хочете видаляти поточний HTML вміст!

Видаліть цей код.

Замість цього, мабуть, ви хочете рендерити ваші React компоненти в специфічних місцях вашого HTML. Відкрийте вашу HTML сторінку (або серверний шаблон що генерує її) і додайте унікальний [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) атрибут будь-якому тегові, наприклад:

```html
<!-- ... десь у вашому html ... -->
<nav id="navigation"></nav>
<!-- ... інший html ... -->
```

Це дозволяє вам знайти цей HTML елемент, використовуючи [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) і передати його у [`createRoot`](/reference/react-dom/client/createRoot), щоб ви мали змогу рендерити ваші React компоненти всередині нього:

<Sandpack>

```html index.html
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

```js index.js active
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

Зверніть увагу як оригінальний зміст HTML з `index.html` зберігся, проте ваш власний `NavigationBar` React компонент тепер зображуються всередині `<nav id="navigation">` з вашого HTML. Читайте [документацію використання `createRoot`](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react), щоб дізнатися більше про рендерінг React компонентів всередині наявної HTML сторінки.

Коли ви впроваджуєте React у існуючий проєкт, стандартна практика - починати з невеликих інтерактивних компонентів (наприклад, кнопок), а потім поступово "підійматися вгору" до моменту, поки вся ваша сторінка не буде побудована з використанням React. По досягненню цього, ми рекомендуємо одразу перейти до [фреймворку React](/learn/start-a-new-react-project), щоб найбільш ефективно його використовувати.

## Використання React Native в існуючому нативному додатку {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) також може бути інтегрований в існуючі нативні застосунки поступово. Якщо у вас є наявний нативний додаток для Android (Java або Kotlin) або iOS (Objective-C або Swift), [дотримуйтесь цього посібника](https://reactnative.dev/docs/integration-with-existing-apps), щоб додати React Native екран до нього.
