---
title: Встановлення
---

<Intro>

Від самого початку React був спроєктований для поступового впровадження. Ви можете використовувати стільки React-у, скільки вам потрібно. Бажаєте ознайомитися з React, додати трохи інтерактивності до HTML-сторінки чи створити складний React-застосунок — цей розділ допоможе вам почати роботу.

</Intro>

## Спробувати React {/*try-react*/}

Не потрібно нічого встановлювати, щоб погратися з React. Спробуйте відредагувати код у цій пісочниці!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

Ви можете редагувати його прямо на цій сторінці або відкрити у новій вкладці, натиснувши кнопку "Fork" у верхньому правому куті.

Більшість сторінок у документації React містять схожі пісочниці. Водночас існує багато інших онлайн-пісочниць з підтримкою React, наприклад: [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react) або [CodePen.](https://codepen.io/pen?template=QWYVwWN)

Щоб спробувати React локально на вашому комп'ютері, [завантажте цю HTML-сторінку.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Відкрийте її у редакторі та браузері!

## Початок React-проєкту {/*creating-a-react-app*/}

Якщо ви хочете створити застосунок за допомогою React, [почніть React-проєкт](/learn/creating-a-react-app), використовуючи один із рекомендованих фреймворків.

## Build a React Framework {/*build-a-react-framework*/}

If a framework is not a good fit for your project, or you prefer to start by building your own framework, you can [build your own React framework](/learn/building-a-react-framework).

## Інтегрувати React у наявний проєкт {/*add-react-to-an-existing-project*/}

Якщо ви хочете використати React у власному застосунку або вебсайті, [інтегруйте React у наявний проєкт.](/learn/add-react-to-an-existing-project)

## Deprecated Options {/*deprecated-options*/}

### Create React App (Deprecated) {/*create-react-app-deprecated*/}

Create React App is a deprecated tool, previously recommended for creating new React apps. If you want to start a new React app, you can [create a React app](/learn/creating-a-react-app) using a recommended framework. 

For more information, see [Sunsetting Create React App](/blog/2025/02/14/sunsetting-create-react-app).

## Подальші кроки {/*next-steps*/}

Відвідайте розділ ["Швидкий старт"](/learn), щоб ознайомитися з найважливішими повсякденними концепціями React.

