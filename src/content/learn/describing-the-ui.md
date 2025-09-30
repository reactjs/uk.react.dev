---
title: Написання UI
---

<Intro>

React — це JavaScript-бібліотека для рендерингу інтерфейсів користувача (_далі_ — UI). UI складається з невеликих елементів, як кнопки, текст і зображення. React дозволяє об'єднувати їх у повторно використовувані *компоненти* з можливістю вкладення. Від вебсайтів до застосунків для телефону — незалежно від платформи все на екрані можна розбити на компоненти. У цьому розділі ви навчитеся створювати, налаштовувати та відображати залежно від умов компоненти React.

</Intro>

<YouWillLearn isChapter={true}>

* [Як написати ваш перший React-компонент](/learn/your-first-component)
* [Коли і як створювати файли з багатьма компонентами](/learn/importing-and-exporting-components)
* [Як додати розмітку до JavaScript за допомогою JSX](/learn/writing-markup-with-jsx)
* [Як використовувати фігурні дужки у JSX, щоб отримати доступ до функціональності JavaScript із ваших компонентів](/learn/javascript-in-jsx-with-curly-braces)
* [Як налаштовувати компоненти за допомогою пропсів](/learn/passing-props-to-a-component)
* [Як умовно рендерити компоненти](/learn/conditional-rendering)
* [Як рендерити безліч компонентів одночасно](/learn/rendering-lists)
* [Як уникнути заплутаних помилок за допомогою "чистих" компонентів](/learn/keeping-components-pure)
* [Чому корисно розуміти ваш UI як дерево](/learn/understanding-your-ui-as-a-tree)

</YouWillLearn>

## Ваш перший компонент {/*your-first-component*/}

React-застосунки створені з ізольованих частин UI, які називаються *компонентами*. Компонент React — це функція JavaScript, до якої можна додати розмітку. Компоненти можуть бути маленькими, як кнопка, або великими, як ціла сторінка. Ось компонент `Gallery`, який рендерить три компоненти `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Кетрін Джонсон (Katherine Johnson)"
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

<LearnMore path="/learn/your-first-component">

Прочитайте розділ **["Ваш перший компонент"](/learn/your-first-component)**, щоб дізнатися, як оголошувати та використовувати компоненти React.

</LearnMore>

## Імпорт та експорт компонентів {/*importing-and-exporting-components*/}

Ви можете оголосити багато компонентів в одному файлі, але великі файли можуть бути заскладними для навігації. Щоб вирішити цю проблему, ви можете *експортувати* компонент у його власний файл, а потім *імпортувати* цей компонент з іншого файлу:


<Sandpack>

```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js active
import Profile from './Profile.js';

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

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Гарт (Alan L. Hart)"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Прочитайте розділ **["Імпорт та експорт компонентів"](/learn/importing-and-exporting-components)**, щоб дізнатися, як розділити компоненти на декілька файлів.

</LearnMore>

## Написання розмітки з JSX {/*writing-markup-with-jsx*/}

Кожен компонент React — це функція JavaScript, яка може містити певну розмітку, яку React рендерить у браузері. Компоненти React використовують розширення синтаксису під назвою JSX для представлення цієї розмітки. JSX дуже схожий на HTML, але з трохи більшою кількістю обмежень і з можливістю відображати інформацію, що динамічно змінюється.

Якщо ми вставимо наявну розмітку HTML у компонент React, це не завжди працюватиме:

<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Список завдань Геді Ламар</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Винахід нових світлофорів
      <li>Провести репетицію сцени з фільму
      <li>Вдосконалення технології спектра
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

Якщо у вас вже є схожий HTML, ви можете виправити його за допомогою [конвертера](https://transform.tools/html-to-jsx):

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Список завдань Геді Ламар</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Геді Ламар (Hedy Lamarr)"
        className="photo"
      />
      <ul>
        <li>Винахід нових світлофорів</li>
        <li>Провести репетицію сцени з фільму</li>
        <li>Вдосконалення технології спектра</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

Прочитайте розділ **["Написання розмітки з JSX"](/learn/writing-markup-with-jsx)**, щоб дізнатися, як писати правильний JSX.

</LearnMore>

## JavaScript у JSX із фігурними дужками {/*javascript-in-jsx-with-curly-braces*/}

JSX дозволяє писати HTML-подібну розмітку всередині файлу JavaScript, зберігаючи логіку рендерингу та вміст в одному місці. Іноді вам потрібно додати трохи логіки JavaScript або посилатися на динамічну властивість у цій розмітці. Тоді ви можете використовувати фігурні дужки у своєму JSX, щоб "відкрити вікно" у JavaScript:

<Sandpack>

```js
const person = {
  name: 'Грегоріо І. Зара (Gregorio Y. Zara)',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Список завдань {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Покращити відеотелефон</li>
        <li>Підготувати лекції з авіаційних технологій</li>
        <li>Працювати над двигуном на спиртовому паливі</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

Прочитайте розділ **["JavaScript у JSX із фігурними дужками"](/learn/javascript-in-jsx-with-curly-braces)**, щоб дізнатися, як отримувати доступ до JavaScript-елементів зсередини JSX.

</LearnMore>

## Передача пропсів до компонента {/*passing-props-to-a-component*/}

Компоненти React використовують *пропси* для спілкування один з одним. Кожен батьківський компонент може передавати деяку інформацію своїм дочірнім компонентам, задаючи їхні пропси. Пропси можуть нагадувати вам атрибути HTML, але ви можете передати через них будь-яке значення JavaScript, включно з об'єктами, масивами, функціями та навіть JSX!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Кацуко Сарухаші (Katsuko Saruhashi)',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

Прочитайте розділ **["Передача пропсів до компонента"](/learn/passing-props-to-a-component)**, щоб дізнатися, як передавати та читати пропси.

</LearnMore>

## Умовний рендеринг {/*conditional-rendering*/}

Ваші компоненти часто повинні відображати різні елементи залежно від різних умов. У React ви можете умовно рендерити JSX за допомогою синтаксису JavaScript, використовуючи вираз `if` та оператори `&&` і `? :`.

У цьому прикладі оператор JavaScript `&&` використовується для умовного рендерингу прапорця:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список речей для пакування Саллі Райд (Sally Ride)</h1>
      <ul>
        <Item
          isPacked={true}
          name="Космічний костюм"
        />
        <Item
          isPacked={true}
          name="Шолом із золотим листям"
        />
        <Item
          isPacked={false}
          name="Фото Тем О'Шонессі (Tam O'Shaughnessy)"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

Прочитайте розділ **["Умовний рендеринг"](/learn/conditional-rendering)**, щоб дізнатися про різні способи рендерингу вмісту залежно від умов.

</LearnMore>

## Рендеринг списків {/*rendering-lists*/}

Часто потрібно відобразити кілька подібних компонентів із колекції даних. Ви можете використовувати `filter()` і `map()` із JavaScript у React, щоб фільтрувати та перетворювати свій масив даних у масив компонентів.

Для кожного елемента масиву вам потрібно буде вказати `key`. Зазвичай ви хочете використовувати ідентифікатор із бази даних як `key`. Ключі дозволяють React відстежувати місце кожного елемента у списку, навіть якщо список змінюється.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ', '}
        чиєю працею є {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Вчені</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Кетрін Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'розрахунки для космічних польотів',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Маріо Моліна (Mario José Molina-Pasquel Henríquez)',
  profession: 'хімік',
  accomplishment: 'відкриття озонової діри в Арктиці',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Абдус Салам (Moшинкаmad Abdus Salam)',
  profession: 'фізик',
  accomplishment: 'теорія електромагнетизму',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Персі Джуліан (Percy Lavon Julian)',
  profession: 'хімік',
  accomplishment: 'новаторські кортизоновмісні препарати, стероїди та протизаплідні таблетки',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Субрахманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофізик',
  accomplishment: 'розрахунок мас зір категорії "білий карлик"',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

Прочитайте розділ **["Рендеринг списків"](/learn/rendering-lists)**, щоб дізнатися, як рендерити список компонентів і вибирати ключ.

</LearnMore>

## Утримання компонентів "чистими" {/*keeping-components-pure*/}

Деякі функції JavaScript є *чистими*. Чиста функція (pure function):

* **Займається лише своєю справою.** Вона не змінює жодних об'єктів чи змінних, які існували до її виклику.
* **Однакові вхідні дані — той самий результат.** З урахуванням однакових вхідних даних чиста функція має завжди повертати той самий результат.

Пишучи компоненти виключно як чисті функції, ви можете уникнути цілого класу незрозумілих помилок і непередбачуваної поведінки відповідно до того, як ваша кодова база зростатиме. Ось приклад "нечистого" компонента:

<Sandpack>

```js {expectedErrors: {'react-compiler': [5]}}
let guest = 0;

function Cup() {
  // Погано: зміна значення змінної, що вже існувала!
  guest = guest + 1;
  return <h2>Чашка для гостя #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Ви можете зробити цей компонент чистим, передавши проп замість модифікації змінної, що вже існувала:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Чашка для гостя #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

Прочитайте розділ **["Утримання компонентів "чистими""](/learn/keeping-components-pure)**, щоб дізнатися, як писати компоненти у вигляді чистих, передбачуваних функцій.

</LearnMore>

## Ваш UI як дерево {/*your-ui-as-a-tree*/}

React використовує дерева для моделювання зв'язків між компонентами та модулями.

Дерево рендерингу React — це представлення батьківського та дочірнього зв'язку між компонентами.

<Diagram name="generic_render_tree" height={250} width={500} alt="Граф дерева із п'ятьма вузлами, де кожен вузол відповідає компоненту. Кореневий вузол розташований у верхній частині графа дерева та позначений як 'Root Component'. Він має дві стрілки, що тягнуться до двох вузлів, позначених як 'Component A' і 'Component C'. Кожна зі стрілок позначена як 'renders'. 'Component A' має одну стрілку з поміткою 'renders' до вузла, позначеного як 'Component B'. 'Component C' має одну стрілку з поміткою 'renders' до вузла, позначеного як 'Component D'.">

Приклад дерева рендерингу React.

</Diagram>

Компоненти, розташовані біля вершини дерева, поблизу кореневого компонента, вважаються верхніми або найвищого рівня (top-level). Компоненти без дочірніх компонентів є листовими компонентами. Ця категоризація компонентів корисна для розуміння потоку даних і продуктивності рендерингу.

Моделювання зв'язків між модулями JavaScript — ще один корисний спосіб зрозуміти вашу програму. Ми називаємо це деревом залежностей модулів.

<Diagram name="generic_dependency_tree" height={250} width={500} alt="Граф дерева із п'ятьма вузлами. Кожен вузол відповідає модулю JavaScript. Вузол у верхній частині позначено 'RootModule.js'. Він має три стрілки, що тягнуться до вузлів: 'ModuleA.js', 'ModuleB.js' і 'ModuleC.js'. Кожна стрілка позначена як 'imports'. Вузол 'ModuleC.js' має одну стрілку 'imports', яка напрямлена до вузла із міткою 'ModuleD.js'.">

Приклад дерева залежностей модулів.

</Diagram>

Дерево залежностей часто використовується бандлерами, щоб запакувати весь актуальний код JavaScript для завантаження та рендерингу клієнтом. Великий розмір бандла погіршує досвід користування React-застосунками. Розуміння дерева залежностей модулів корисно для усунення таких проблем.

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Прочитайте розділ **["Ваш UI як дерево"](/learn/understanding-your-ui-as-a-tree)**, щоб дізнатися, як створюється дерево рендерингу і залежностей модулів у React-застосунках та наскільки вони є корисними абстрактними моделями для покращення досвіду користування і продуктивності.

</LearnMore>


## Що далі? {/*whats-next*/}

Перейдіть до розділу ["Ваш перший компонент"](/learn/your-first-component), щоб почати читати цю секцію посторінково!

Або, якщо ви вже знайомі з цими темами, чому б не переглянути ["Додавання інтерактивності"](/learn/adding-interactivity)?
