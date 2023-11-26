---
title: Встановлення
---

<Intro>

Від самого початку React був спроєктований для поступового впровадження. Ви можете використовувати стільки React-у, скільки вам потрібно. Бажаєте ознайомитися з React, додати трохи інтерактивності до HTML-сторінки чи створити складний React-застосунок — цей розділ допоможе вам почати роботу.

</Intro>

<YouWillLearn isChapter={true}>

* [Як почати новий React-проєкт](/learn/start-a-new-react-project)
* [Як інтегрувати React в існуючий проєкт](/learn/add-react-to-an-existing-project)
* [Як налаштувати редактор коду](/learn/editor-setup)
* [Як встановити інструменти React розробника](/learn/react-developer-tools)

</YouWillLearn>

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

Більшість сторінок у документації React містять схожі пісочниці. Водночас існує багато інших онлайн-пісочниць з підтримкою React, наприклад: [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react) або [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)

### Спробувати React локально {/*try-react-locally*/}

Щоб спробувати React локально на вашому комп'ютері, [завантажте цю HTML-сторінку.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Відкрийте її у редакторі та браузері!

## Почати новий React-проєкт {/*start-a-new-react-project*/}

Якщо ви хочете створити застосунок або вебсайт за допомогою React, [почніть новий React-проєкт.](/learn/start-a-new-react-project)

## Інтегрувати React в існуючий проєкт {/*add-react-to-an-existing-project*/}

Якщо ви хочете використати React у власному застосунку або вебсайті, [інтегруйте React в існуючий проєкт.](/learn/add-react-to-an-existing-project)

## Подальші кроки {/*next-steps*/}

Відвідайте розділ ["Швидкий старт"](/learn), щоб ознайомитися з найважливішими повсякденними концепціями React.

