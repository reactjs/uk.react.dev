---
title: Створення React-застосунку
---

<Intro>

Якщо ви вирішили розробити новий застосунок або вебсайт за допомогою React, ми радимо вибрати один із фреймворків.

</Intro>

Якщо ваш застосунок містить обмеження, які не спрацюють із наявними фреймворками, або ви бажаєте побудувати власний фреймворк чи розібратися в основах, [побудуйте React-застосунок з нуля](/learn/build-a-react-app-from-scratch).

## Фреймворки повного стеку {/*full-stack-frameworks*/}

Ці фреймворки підтримують усі функції, що знадобляться для розгортання та масштабування застосунку в публічному середовищі (in production). Вони інтегрували останні React-функції й послуговуються перевагами архітектури React.

<Note>

#### Фреймворки повного стеку не потребують сервера. {/*react-frameworks-do-not-require-a-server*/}

Усі фреймворки на цій сторінці підтримують рендеринг із боку клієнта ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)), односторінкові застосунки ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)) і генерацію статичних сайтів ([SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG)). Їх можна розгортати через [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) або сервіс статичного хостингу та вони не потребують сервера. Додатково ці фреймворки дають вам змогу додавати рендеринг із боку сервера (SSR) для певних маршрутів, якщо вам це необхідно.

Це дає вам змогу почати із суто клієнтського застосунку і за необхідності пізніше використати серверні функції для окремих маршрутів без переписування застосунку. Щоб налаштувати стратегію рендерингу, перегляньте документацію вашого фреймворку.

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[App Router від Next.js's](https://nextjs.org/docs) — це React-фреймворк, який повністю використовує переваги архітектури React, щоб уможливлювати React-застосунки повного стеку.**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

<<<<<<< HEAD
Next.js підтримується командою [Vercel](https://vercel.com/). [Розгорнути застосунок Next.js](https://nextjs.org/docs/app/building-your-application/deploying) можна на будь-якому Node.js- або безсерверному хостингу, а також на власному сервері. Також Next.js підтримує [статичне експортування](https://nextjs.org/docs/app/building-your-application/deploying/static-exports), якому не потрібен сервер. На додачу Vercel пропонує необов'язкові платні хмарні послуги.
=======
Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any hosting provider that supports Node.js or Docker containers, or to your own server. Next.js also supports [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) which doesn't require a server.
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) — це найпопулярніша бібліотека маршрутизації для React, яку можна поєднати з Vite для створення повноцінного React-фреймворку**. Він зосереджується на стандартних вебінтерфейсах і має кілька [готових до розгортання шаблонів](https://github.com/remix-run/react-router-templates) для різних середовищ і платформ JavaScript.

Щоб створити новий проєкт з допомогою фреймворку React Router, виконайте:

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

React Router підтримується [компанією Shopify](https://www.shopify.com).

### Expo (для нативних застосунків) {/*expo*/}

**[Expo](https://expo.dev/) — це React-фреймворк, що дає змогу створювати універсальні застосунки для Android, iOS і вебу з по-справжньому нативним UI.** Він пропонує набір інструментів для [React Native](https://reactnative.dev/), завдяки якому цими нативними частинами легше користуватися. Щоб створити новий проєкт Expo, виконайте:

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

Якщо Expo — це для вас щось нове, перегляньте [підручник Expo](https://docs.expo.dev/tutorial/introduction/).

Expo підтримується [компанією Expo](https://expo.dev/about). Розробляти застосунки за допомогою Expo можна безкоштовно, і їх можна подавати до каталогів застосунків Google і Apple без жодних обмежень. На додачу Expo пропонує необов'язкові платні хмарні послуги.


## Інші фреймворки {/*other-frameworks*/}

Є й інші перспективні фреймворки, які працюють над нашим баченням повного стеку з React:

- [TanStack Start (бета-версія)](https://tanstack.com/): TanStack Start — це React-фреймворк повного стеку на основі TanStack Router. Він надає повнодокументний SSR, потокове передавання, серверні функції, збирання тощо за допомогою інструментів як Nitro та Vite.
- [RedwoodJS](https://redwoodjs.com/): Redwood — це React-фреймворк повного стеку із великою кількістю попередньо встановлених пакетів і налаштувань, що дає змогу легко створювати вебзастосунки повного стеку.

<DeepDive>

#### З яких функцій складається бачення архітектури повного стеку від команди React? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Бандлер App Router від Next.js повністю реалізує офіційну [специфікацію серверних компонентів React](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Це дає змогу поєднувати компоненти, що виконуються під час збирання, ті, що працюють суто на сервері, та інтерактивні компоненти в єдине дерево React.

Наприклад, можна написати суто серверний компонент React як `async` функцію, що зчитує дані з бази даних або з файлу. Потім можна передати дані до інтерактивних компонентів:

```js
// Цей компонент виконується *лише* на сервері (або під час збирання).
async function Talks({ confId }) {
  // 1. Ви на сервері, тож можете спілкуватися зі своїм шаром даних. Наявність API — необов'язкова.
  const talks = await db.Talks.findAll({ confId });

  // 2. Додавайте будь-яку кількість логіки рендерингу. Це не збільшить ваш бандл із JavaScript.
  const videos = talks.map(talk => talk.video);

  // 3. Передайте дані до компонентів, що виконаються в браузері.
  return <SearchableVideoList videos={videos} />;
}
```

App Router від Next.js також інтегрує [отримання даних із Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Це дає змогу задати стан завантаження (наприклад, каркасний елемент для заповнення (skeleton placeholder)) для різних частин інтерфейсу безпосередньо в дереві React:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Серверні компоненти та Suspense — це радше функції React, аніж Next.js. Проте їхнє залучення на рівні фреймворку вимагає нетривіальних зусиль для реалізації та підтримування. Наразі App Router від Next.js — це найповніша імплементація. Команда React працює разом із розробниками бандлерів, щоб було легше реалізувати ці функції в наступному поколінні фреймворків.

</DeepDive>

## Початок із нуля {/*start-from-scratch*/}

Якщо ваш застосунок містить обмеження, які не спрацюють із наявними фреймворками, або ви бажаєте побудувати власний фреймворк чи розібратися в основах React-застосунку, є інші доступні варіанти для початку React-проєкту з нуля.

Початок роботи з нуля надає вам більше гнучкості, але потребує від вас вибору інструментів для маршрутизації, отримання даних та інших типових патернів використання. Це дуже схоже на створення власного фреймворку замість використання наявного. [Фреймворки, які ми рекомендуємо](#full-stack-frameworks), мають готові вбудовані рішення для цих проблем.

<<<<<<< HEAD
Якби ви хочете власне рішення, перегляньте наш посібник із [побудови React-застосунку з нуля](/learn/build-a-react-app-from-scratch), щоб отримати інструкції з налаштування нового React-проєкту, починаючи з інструментів збирання, як-от [Vite](https://vite.dev/), [Parcel](https://parceljs.org/) чи [RSbuild](https://rsbuild.dev/).
=======
If you want to build your own solutions, see our guide to [build a React app from Scratch](/learn/build-a-react-app-from-scratch) for instructions on how to set up a new React project starting with a build tool like [Vite](https://vite.dev/), [Parcel](https://parceljs.org/), or [RSbuild](https://rsbuild.dev/).
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

-----

_Якщо ви автор фреймворку та бажаєте додати його на цю сторінку, [будь ласка, напишіть нам](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)._
