---
title: Ваш перший компонент
---

<Intro>

*Компоненти* є одним з основних понять React. Вони є основою, на якій ви будуєте інтерфейси користувача (UI), що робить їх ідеальним місцем для початку вашого шляху з React!

</Intro>

<YouWillLearn>

* Що таке компонент
* Яку роль відіграють компоненти в застосунку React
* Як написати свій перший компонент React

</YouWillLearn>

## Компоненти: Будівельні блоки UI {/*components-ui-building-blocks*/}

У Вебі, HTML дозволяє нам створювати багатоструктурні документи за допомогою вбудованих наборів тегів, таких як `<h1>` та `<li>`:

```html
<article>
  <h1>Мій перший компонент</h1>
  <ol>
    <li>Компоненти: Будівельні блоки UI</li>
    <li>Визначення компонента</li>
    <li>Використання компонента</li>
  </ol>
</article>
```

Ця розмітка представляє статтю `<article>`, її заголовок `<h1>`, та (скорочений) зміст у вигляді впорядкованого списку `<ol>`. Розмітка подібна до цієї, в поєднанні з CSS для стилізації та JavaScript для інтерактивності, лежить в основі кожної бічної панелі, аватара, модального вікна, випадного меню — кожного елемента UI, який ви бачите в Вебі.

React дозволяє вам поєднувати вашу розмітку, CSS та JavaScript у власні "компоненти", **повторно використовувані елементи UI для вашого застосунку.** Код змісту, який ви бачили вище, можна перетворити на компонент `<TableOfContents />`, який ви можете відобразити на кожній сторінці. Під капотом він все ще використовує ті ж самі HTML-теги, такі як `<article>`, `<h1>`, тощо.

Так само, як і з HTML-тегами, ви можете компонувати, впорядковувати та вкладати компоненти для створення цілих сторінок. Наприклад, сторінка документації, яку ви читаєте, складається з компонентів React:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Документація</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

Зі зростанням вашого проєкту ви помітите, що багато з ваших дизайнів можна створити шляхом повторного використання компонентів, які ви вже написали, що пришвидшує вашу розробку. Наш зміст вище може бути доданий до будь-якого екрану за допомогою `<TableOfContents />`! Ви навіть можете розпочати свій проєкт з тисячами компонентів, які поділяє спільнота відкритого коду React, як-от [Chakra UI](https://chakra-ui.com/) та [Material UI.](https://material-ui.com/)

## Визначення компонента {/*defining-a-component*/}

Традиційно, створюючи веб-сторінки, веб-розробники спершу писали розмітку їхнього контенту, а потім додавали інтерактив, трохи посипаючи JavaScript'ом. Це чудово працювало, коли інтерактив була приємним доповненням до вебу. Тепер це очікується на багатьох сайтах і в усіх застосунках. React ставить взаємодію на перше місце, використовуючи при цьому ту ж технологію: **компонент React - це функція JavaScript, яку можна _посипати розміткою_.** Ось як це виглядає (ви можете відредагувати приклад нижче):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
<<<<<<< HEAD
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Кетерін Джонсон (Katherine Johnson)"
=======
      src="https://react.dev/images/docs/scientists/MK3eW3Am.jpg"
      alt="Katherine Johnson"
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

А ось як створити компонент:

### Крок 1: Експортування компонента {/*step-1-export-the-component*/}

Префікс `export default` це [стандартний синтаксис JavaScript](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (не специфічний для React). Він дозволяє вам позначити головну функцію у файлі, щоб ви могли потім імпортувати її з інших файлів. (Детальніше про імпортування у розділі [Імпортування та експортування компонентів](/learn/importing-and-exporting-components)!)

### Крок 2: Визначення функції {/*step-2-define-the-function*/}

За допомогою `function Profile() { }` ви визначаєте функцію JavaScript з іменем `Profile`.

<Pitfall>

React компоненти є звичайними JavaScript функціями, але **їхні назви мають починатися з великої літери** інакше вони не будуть працювати!
</Pitfall>

### Крок 3: Додавання розмітки {/*step-3-add-markup*/}

Компонент повертає тег `<img />` з атрибутами `src` та `alt`. `<img />` записаний як HTML, але насправді це JavaScript під капотом! Цей синтаксис називається [JSX](/learn/writing-markup-with-jsx), і він дозволяє вам вбудовувати розмітку всередину JavaScript.

Оператори повернення можуть бути записані в одному рядку, як у цьому компоненті:

```js
<<<<<<< HEAD
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Кетерін Джонсон (Katherine Johnson)" />;
=======
return <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />;
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
```

Але якщо ваша розмітка не розташована в тому ж рядку, що й ключове слово `return` ви повинні обгорнути її в пару дужок:

```js
return (
  <div>
<<<<<<< HEAD
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Кетерін Джонсон (Katherine Johnson)" />
=======
    <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
  </div>
);
```

<Pitfall>

Без дужок, будь-який код в рядках після `return` [буде проігноровано](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## Застосування компонента {/*using-a-component*/}

Тепер, коли ви створили свій компонент `Profile`, ви можете вкладати його всередину інших компонентів. Наприклад, ви можете експортувати компонент `Gallery`, який використовує кілька компонентів `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
<<<<<<< HEAD
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Кетерін Джонсон (Katherine Johnson)"
=======
      src="https://react.dev/images/docs/scientists/MK3eW3As.jpg"
      alt="Katherine Johnson"
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Видатні вчені</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### Що бачить браузер {/*what-the-browser-sees*/}

Зверніть увагу на відмінність у регістрі літер:

* `<section>` написано у нижньому регістрі, тому React знає, що ми звертаємось до HTML-тегу.
* `<Profile />` починається з великої літери `P`, тому React знає, що ми хочемо використовувати наш компонент з назвою `Profile`.

І `Profile` містить ще більше HTML: `<img />`. В кінцевому результаті це те, що бачить браузер:

```html
<section>
<<<<<<< HEAD
  <h1>Видатні вчені</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Кетерін Джонсон (Katherine Johnson)" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Кетерін Джонсон (Katherine Johnson)" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Кетерін Джонсон (Katherine Johnson)" />
=======
  <h1>Amazing scientists</h1>
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
</section>
```

### Вкладення та організація компонентів {/*nesting-and-organizing-components*/}

Компоненти є звичайними JavaScript функціями, тому ви можете зберігати кілька компонентів у одному файлі. Це зручно, коли компоненти є досить малими або тісно пов'язаними між собою. Якщо цей файл стає переповненим, ви завжди можете перемістити компонент `Profile` до окремого файлу. Незабаром ви навчитеся це робити на [сторінці про імпорт.](/learn/importing-and-exporting-components)

Тому що компоненти `Profile` рендеряться всередині `Gallery`—навіть кілька разів!—ми можемо сказати, що `Gallery` є **батьківським компонентом,** який рендерить кожний `Profile` як "дочірній". Це частина магії React: ви можете визначити компонент один раз і потім використовувати його в будь-яких місцях та скільки завгодно разів.

<Pitfall>

Компоненти можуть рендерити інші компоненти, але **ви не повинні вкладати їх створення одне в інше:**

```js {2-5}
export default function Gallery() {
  // 🔴 Ніколи не створюйте компонент всередині іншого компонента!
  function Profile() {
    // ...
  }
  // ...
}
```

Код вище [дуже повільний і може призводити до помилок.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) Натомість, створюйте кожен компонент на верхньому рівні:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Оголошуйте компоненти на верхньому рівні
function Profile() {
  // ...
}
```

Якщо дочірній компонент потребує деяких даних від батьківського компонента, [передавайте їх за допомогою пропсів](/learn/passing-props-to-a-component) замість вкладення створень.

</Pitfall>

<DeepDive>

#### Компоненти на всій глибині {/*components-all-the-way-down*/}

Ваш React-застосунок починається з "кореневого" компонента. Зазвичай він створюється автоматично, коли ви створюєте новий проєкт. Наприклад, якщо ви використовуєте [CodeSandbox](https://codesandbox.io/) або якщо ви використовуєте фреймворк [Next.js](https://nextjs.org/), кореневий компонент визначений в `pages/index.js`. У цих прикладах ви експортуєте кореневі компоненти.

Більшість застосунків React використовують компоненти на всій глибині. Це означає, що ви будете використовувати компоненти не тільки для повторно використовуваних елементів, таких як кнопки, але й для більших елементів, таких як бічні панелі, списки та, врешті-решт, цілі сторінки! Компоненти - зручний спосіб організації коду UI та розмітки, навіть якщо деякі з них використовуються лише один раз.

[Фреймворки на основі React](/learn/creating-a-react-app) в цьому плані йдуть ще далі. Замість використання порожнього HTML-файлу і дозволу React "перейняти" керування сторінкою за допомогою JavaScript, вони також автоматично генерують HTML з ваших React компонентів. Це дозволяє вашому застосунку показувати деякий контент до завантаження JavaScript коду.

Проте, багато сайтів використовують React лише для [додавання інтерактивності до наявних HTML-сторінок.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) Вони мають кілька кореневих компонентів замість одного для всієї сторінки. Ви можете використовувати стільки React, скільки вам потрібно.

</DeepDive>

<Recap>

Ви щойно спробували React вперше! Давайте повторимо деякі ключові моменти.

* React дозволяє створювати компоненти, **елементи UI для повторного використання у вашому застосунку.**
* У застосунку React кожен елемент UI є компонентом.
* React компоненти є звичайними JavaScript функціями, за винятком:

  1. Їхні назви завжди починаються з великої літери.
  2. Вони повертають JSX-розмітку.

</Recap>



<Challenges>

#### Експорт компонента {/*export-the-component*/}

Код в цій пісочниці не працює, тому що основний компонент не експортований:

<Sandpack>

```js
function Profile() {
  return (
    <img
<<<<<<< HEAD
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Аклілу Лемма (Aklilu Lemma)"
=======
      src="https://react.dev/images/docs/scientists/lICfvbD.jpg"
      alt="Aklilu Lemma"
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Спробуйте виправити це самостійно, перш ніж дивитись на рішення!

<Solution>

Додайте `export default` перед визначенням функції таким чином:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
<<<<<<< HEAD
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Аклілу Лемма (Aklilu Lemma)"
=======
      src="https://react.dev/images/docs/scientists/lICfvbD.jpg"
      alt="Aklilu Lemma"
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Вам може бути цікаво чому запис `export` сам по собі недостатній для виправлення цього прикладу. Ви можете дізнатися різницю між `export` та `export default` у розділі [Імпортування та експортування компонентів.](/learn/importing-and-exporting-components)

</Solution>

#### Виправте оператор return {/*fix-the-return-statement*/}

З цим оператором `return` щось не так. Чи можете ви виправити його?

<Hint>

Під час спроби виправити це, можливо, ви отримаєте помилку "Unexpected token". У такому випадку, перевірте, чи крапка з комою знаходиться після закриваючої дужки. Якщо ви залишите крапку з комою всередині `return ( )` - це призведе до помилки.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
<<<<<<< HEAD
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Кацуко Сарухаші (Katsuko Saruhashi)" />;
=======
    <img src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

Цей компонент можна виправити, якщо перенести оператор return на одну лінію таким чином:

<Sandpack>

```js
export default function Profile() {
<<<<<<< HEAD
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Кацуко Сарухаші (Katsuko Saruhashi)" />;
=======
  return <img src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
}
```

```css
img { height: 180px; }
```

</Sandpack>

Або обгорніть повернену JSX розмітку у дужки, які відкриваються одразу після `return`:

<Sandpack>

```js
export default function Profile() {
  return (
<<<<<<< HEAD
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Кацуко Сарухаші (Katsuko Saruhashi)"
=======
    <img
      src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg"
      alt="Katsuko Saruhashi"
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### Виявіть помилку {/*spot-the-mistake*/}

Щось не так з оголошенням та використанням компонента `Profile`. Чи можете ви знайти помилку? (Спробуйте пригадати, як React відрізняє компоненти від звичайних HTML-тегів!)

<Sandpack>

```js
function profile() {
  return (
    <img
<<<<<<< HEAD
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Гарт (Alan L. Hart)"
=======
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Видатні вчені</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

Назви компонентів React повинні починатися з великої літери.

Змініть `function profile()` на `function Profile()`,  а потім змініть кожен `<profile />` на `<Profile />`:

<Sandpack>

```js
function Profile() {
  return (
    <img
<<<<<<< HEAD
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Гарт (Alan L. Hart)"
=======
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Видатні вчені</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### Ваш власний компонент {/*your-own-component*/}

Напишіть компонент з нуля. Ви можете дати йому будь-яку валідну назву та повернути будь-яку розмітку. Якщо у вас закінчилися ідеї, ви можете написати компонент `Congratulations`, який показує `<h1>Гарна робота!</h1>`. Не забудьте експортувати його!

<Sandpack>

```js
// Напишіть свій компонент нижче!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Гарна робота!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
