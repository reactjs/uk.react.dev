---
title: Передача пропсів до компонента
---

<Intro>

Компоненти React використовують *пропси* для взаємодії між собою. Кожен батьківський компонент може передати деяку інформацію своїм дочірнім компонентам, передаючи їм пропси. Пропси можуть нагадувати вам HTML-атрибути, але ви можете передавати через них будь-яке значення JavaScript, включаючи об'єкти, масиви та функції.

</Intro>

<YouWillLearn>

* Як передавати пропси до компонента
* Як читати пропси з компонента
* Як встановлювати значення за замовчуванням для пропсів
* Як передавати JSX до компонента
* Як пропси змінюються з часом

</YouWillLearn>

## Знайомі пропси {/*familiar-props*/}

Пропси — це інформація, яку ви передаєте до тегу JSX. Наприклад, `className`, `src`, `alt`, `width` та `height` — деякі з пропсів, які ви можете передати до тегу `<img>`:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Лін Ланьїн (Lin Lanying)"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Пропси, які ви можете передати до тегу `<img>`, визначені заздалегідь (ReactDOM відповідає [стандарту HTML](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). Але ви можете передати будь-які пропси до *власних* компонентів, таких як `<Avatar>`, щоб налаштувати їх. Ось як це зробити!

## Передача пропсів до компонента {/*passing-props-to-a-component*/}

У цьому коді компонент `Profile` не передає жодних пропсів до свого дочірнього компонента `Avatar`:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

Ви можете передати деякі пропси до компонента `Avatar` у два кроки.

### Крок 1: Передайте пропси до дочірнього компонента {/*step-1-pass-props-to-the-child-component*/}

Спочатку передайте деякі пропси до `Avatar`. Наприклад, давайте передамо два пропси: `person` (об'єкт) і `size` (число):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Лін Ланьїн (Lin Lanying)', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

Якщо подвійні фігурні дужки після `person=` вас збивають з пантелику, згадайте, що [вони просто об'єкт](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) всередині фігурних дужок JSX.

</Note>

Тепер ви можете читати ці пропси всередині компонента `Avatar`.

### Крок 2: Читайте пропси всередині дочірнього компонента {/*step-2-read-props-inside-the-child-component*/}

Ви можете прочитати ці пропси, перераховуючи їх назви `person, size`, розділені комами всередині `({` та `})` безпосередньо після `function Avatar`. Це дозволяє використовувати їх всередині коду `Avatar` як змінні.

```js
function Avatar({ person, size }) {
  // person та size доступні тут
}
```

Додайте трохи логіки до `Avatar`, яка використовує пропси `person` та `size` для рендеру, і готово.

Тепер ви можете налаштувати `Avatar` для рендеру багатьма різними способами з різними пропсами. Спробуйте змінити значення!

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

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

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Кацуко Сарухаші (Katsuko Saruhashi)', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Аклілу Лемма (Aklilu Lemma)', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Лін Ланьїн (Lin Lanying)',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js utils.js
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Пропси дозволяють вам думати про батьківські та дочірні компоненти незалежно. Наприклад, ви можете змінити проп `person` або `size` всередині `Profile`, не думаючи про те, як `Avatar` використовує їх. Аналогічно, ви можете змінити спосіб використання `Avatar` цих пропсів, не звертаючи уваги на `Profile`.

Уявіть пропси як «ручки регулювання», які ви можете налаштовувати. Вони виконують ту саму роль, що і аргументи для функцій — насправді, пропси _є_ єдиним аргументом вашого компонента! Функції компонентів React приймають один аргумент — об'єкт `props`:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

Зазвичай вам не потрібен весь об'єкт `props` сам по собі, тому ви розкладаєте його на окремі пропси.

<Pitfall>

**Не пропустіть пару фігурних дужок `{` та `}` всередині `(` та `)` при оголошенні пропсів:

```js
function Avatar({ person, size }) {
  // ...
}
```

Цей синтаксис називається ["деструктуризація"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) і еквівалентний читанню пропів з параметра функції:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Вказання значення за замовчуванням для пропа {/*specifying-a-default-value-for-a-prop*/}

Якщо ви хочете задати пропу значення за замовчуванням, на яке він посилатиметься, якщо не вказано іншого, ви можете зробити це з деструктуризацією, поставивши `=` та значення за замовчуванням відразу після параметра:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Тепер, якщо `<Avatar person={...} />` рендериться без пропу `size`, `size` буде встановлено на `100`.

Значення за замовчуванням використовується тільки у випадку, якщо проп `size` відсутній або якщо ви передаєте `size={undefined}`. Але якщо ви передаєте `size={null}` або `size={0}`, значення за замовчуванням **не буде** використовуватись.

## Передача пропсів за допомогою spread синтаксису JSX {/*forwarding-props-with-the-jsx-spread-syntax*/}

Іноді передача пропсів стає дуже повторюваною:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

Немає нічого поганого в повторюваному коді — це може бути більш зрозумілим. Але іноді ви можете цінувати лаконічність. Деякі компоненти передають всі свої пропси своїм дочірнім компонентам, як це робить `Profile` з `Avatar`. Оскільки вони не використовують жоден зі своїх пропсів безпосередньо, може бути розумним використовувати більш лаконічний синтаксис "spread":

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Це передає всі пропси `Profile` до `Avatar` без перерахування кожної назви окремо.

**Використовуйте синтаксис spread з обережністю.** Якщо ви використовуєте його в кожному наступному компоненті, то щось пішло не так. Часто це свідчить про те, що вам слід розбити ваші компоненти та передати дочірні елементи як JSX. Детальніше про це далі!

## Передача JSX як children {/*passing-jsx-as-children*/}

Вкладення вбудованих тегів браузера є звичайною справою:

```js
<div>
  <img />
</div>
```

Іноді ви захочете вкладати свої власні компоненти так само:

```js
<Card>
  <Avatar />
</Card>
```

Коли ви вкладаєте вміст всередині тегу JSX, батьківський компонент отримує цей вміст у пропі з назвою `children`. Наприклад, компонент `Card` нижче отримає проп `children` зі значенням `<Avatar />` і відображатиме його в обгортковому div:

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

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
```

```js Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
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
```

```js utils.js
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

Спробуйте замінити `<Avatar>` всередині `<Card>` на деякий текст, щоб побачити, як компонент `Card` може обгорнути будь-який вкладений вміст. Він не потребує "знати", що саме рендериться всередині нього. Ви ще побачите цей гнучкий шаблон у багатьох місцях.

Ви можете уявляти компонент з пропом `children` як компонент з "отвіром", який може бути "заповнений" батьківськими компонентами з довільним JSX. Ви часто будете використовувати проп `children` для візуальних обгорток: панелей, сіток і т.д.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='Подібна до головоломки плитка Card зі слотами для "дочірніх" шматочків, наприклад текст або Avatar' />

## Як пропси змінюються з часом {/*how-props-change-over-time*/}

Компонент `Clock`, наведений нижче, отримує два пропи від батьківського компонента: `color` та `time`. (Код батьківського компонента опущено, оскільки він використовує [стан](/learn/state-a-components-memory), про який ми ще не говорили.)

Спробуйте змінити колір у випадаючому списку нижче:

<Sandpack>

```js Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Виберіть колір:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Цей приклад показує, що **компонент може отримувати різні пропси з часом**. Пропси не завжди є статичними! Тут проп `time` змінюється кожну секунду, а проп `color` змінюється, коли ви вибираєте інший колір. Пропси відображають дані компонента в будь-який момент часу, а не лише на початку.

Однак, пропси є [незмінними (immutable)](https://uk.wikipedia.org/wiki/%D0%9D%D0%B5%D0%B7%D0%BC%D1%96%D0%BD%D0%BD%D0%B8%D0%B9_%D0%BE%D0%B1%27%D1%94%D0%BA%D1%82). Коли компоненту потрібно змінити свої пропси (наприклад, відповідно до взаємодії користувача або нових даних), він повинен «попросити» свій батьківський компонент передати йому _інші пропси_ — новий об'єкт! Його старі пропси будуть відкинуті, і, врешті-решт, рушій JavaScript звільнить пам'ять, яку вони займали.

**Не намагайтеся «змінювати пропси»**. Щоб реагувати на введення користувача (наприклад, змінювати вибраний колір), вам потрібно «встановити стан», про що ви можете дізнатися у розділі [Стан: Пам'ять компонента.](/learn/state-a-components-memory)

<Recap>

* Щоб передати пропси, додайте їх до JSX подібно до атрибутів HTML.
* Щоб прочитати пропси, використовуйте синтаксис деструктуризації `function Avatar({ person, size })`.
* Ви можете вказати значення за замовчуванням, наприклад, `size = 100`, яке використовується для відсутніх та `undefined` пропсів.
* Ви можете передати всі пропси JSX за допомогою синтаксису розширення `<Avatar {...props} />`, але не зловживайте цим!
* Вкладений JSX, наприклад `<Card><Avatar /></Card>`, буде виглядати як проп `children` компонента `Card`.
* Пропси в момент часу можуть бути використані тільки для читання: кожен рендер отримує нову версію пропсів.
* Ви не можете змінювати пропси. Для інтерактивності використовуйте стан.

</Recap>



<Challenges>

#### Винесіть компонент {/*extract-a-component*/}

Цей компонент `Gallery` містить дуже схожу розмітку для двох профілів. Винесіть компонент `Profile` з нього, щоб зменшити дублювання. Вам потрібно буде вибрати, які пропси передати йому.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Визначні вчені</h1>
      <section className="profile">
        <h2>Марія Склодовська-Кюрі (Maria Skłodowska-Curie)</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Марія Склодовська-Кюрі (Maria Skłodowska-Curie)"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Професія: </b> 
            фізик та хімік
          </li>
          <li>
            <b>Нагороди: 4 </b> 
            (Нобелівська премія з фізики, Нобелівська премія з хімії, Медаль Дейві, Медаль Маттеуччі)
          </li>
          <li>
            <b>Відкрито: </b>
            полоній (хімічний елемент)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Кацуко Сарухаші (Katsuko Saruhashi)</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Кацуко Сарухаші (Katsuko Saruhashi)"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Професія: </b> 
            геохімік
          </li>
          <li>
            <b>Нагороди: 2 </b> 
            (Премія Міяке з геохімії, Премія Танака)
          </li>
          <li>
            <b>Відкрито: </b>
            метод вимірювання вмісту діоксиду карбону в морській воді
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

Почніть з винесення розмітки для одного з вчених. Потім знайдіть частини, які не відповідають їй у другому прикладі, і зробіть їх налаштовуваними за допомогою пропсів.

</Hint>

<Solution>

У цьому рішенні компонент `Profile` приймає кілька пропсів: `imageId` (рядок), `name` (рядок), `profession` (рядок), `awards` (масив рядків), `discovery` (рядок) і `imageSize` (число).

Зверніть увагу, що проп `imageSize` має значення за замовчуванням, тому ми не передаємо його до компонента.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Професія:</b> {profession}</li>
        <li>
          <b>Нагороди: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Відкрито: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Визначні вчені</h1>
      <Profile
        imageId="szV5sdG"
        name="Марія Склодовська-Кюрі (Maria Skłodowska-Curie)"
        profession="фізик та хімік"
        discovery="полоній (хімічний елемент)"
        awards={[
          'Нобелівська премія з фізики',
          'Нобелівська премія з хімії',
          'Медаль Дейві',
          'Медаль Маттеуччі'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Кацуко Сарухаші (Katsuko Saruhashi)'
        profession='геохімік'
        discovery="метод вимірювання вмісту діоксиду карбону в морській воді"
        awards={[
          'Премія Міяке з геохімії',
          'Премія Танака'
        ]}
      />
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Зверніть увагу: якщо `awards` є масивом, вам не потрібний окремий проп `awardCount`. У цьому випадку ви можете використовувати `awards.length`, щоб підрахувати кількість нагород. Пам'ятайте, що пропси можуть приймати будь-які значення, включаючи масиви!

Ще одне рішення, яке більш схоже на попередні приклади на цій сторінці, полягає в тому, щоб групувати всю інформацію про людину в один об'єкт і передавати цей об'єкт як один проп:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Професія:</b> {person.profession}
        </li>
        <li>
          <b>Нагороди: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Відкрито: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Визначні вчені</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Марія Склодовська-Кюрі (Maria Skłodowska-Curie)',
        profession: 'фізик та хімік',
        discovery: 'полоній (хімічний елемент)',
        awards: [
          'Нобелівська премія з фізики',
          'Нобелівська премія з хімії',
          'Медаль Дейві',
          'Медаль Маттеуччі'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Кацуко Сарухаші (Katsuko Saruhashi)',
        profession: 'геохімік',
        discovery: 'метод вимірювання вмісту діоксиду карбону в морській воді',
        awards: [
          'Премія Міяке з геохімії',
          'Премія Танака'
        ],
      }} />
    </div>
  );
}
```

```js utils.js
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Хоча синтаксис виглядає трохи інакше, оскільки ви описуєте властивості об'єкта JavaScript, а не колекцію атрибутів JSX, ці приклади в основному еквівалентні, і ви можете вибрати будь-який підхід.

</Solution>

#### Налаштування розміру зображення на основі пропу {/*adjust-the-image-size-based-on-a-prop*/}

У цьому прикладі компонент `Avatar` отримує числовий проп `size`, який визначає ширину та висоту елемента `<img>`. Для пропу `size` задано значення `40`. Однак, якщо ви відкриєте зображення в новій вкладці, ви помітите, що саме зображення є більшим (`160` пікселів). Справжній розмір зображення визначається розміром ескізу, який ви запитуєте.

Змініть компонент `Avatar`, щоб він запитував найближчий розмір зображення на основі пропу `size`. Зокрема, якщо `size` менше `90`, передайте `'s'` (від англ. «small» — малий) замість `'b'` (від англ. «big» — великий) у функцію `getImageUrl`. Переконайтеся, що ваші зміни працюють, виконуючи рендер аватарів з різними значеннями пропу `size` та відкриваючи зображення в новій вкладці.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Грегоріо І. Зара (Gregorio Y. Zara)', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Ось як ви можете з цим упоратися:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Грегоріо І. Зара (Gregorio Y. Zara)', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Грегоріо І. Зара (Gregorio Y. Zara)', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Ви також можете показати більш чітке зображення для екранів з високою щільністю пікселів, ураховуючи [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio):

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Грегоріо І. Зара (Gregorio Y. Zara)', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Грегоріо І. Зара (Gregorio Y. Zara)', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Грегоріо І. Зара (Gregorio Y. Zara)', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Пропси дозволяють інкапсулювати таку логіку всередині компонента `Avatar` (і змінювати її пізніше, якщо потрібно), щоб кожен міг використовувати компонент `<Avatar>` без думок про те, як запитувати та змінювати розмір зображень.

</Solution>

#### Передача JSX у проп `children` {/*passing-jsx-in-a-children-prop*/}

Винесіть компонент `Card` з розмітки нижче та використайте проп `children`, щоб передати йому різний JSX:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Фото</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Аклілу Лемма (Aklilu Lemma)"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>Про</h1>
          <p>Аклілу Лемма (Aklilu Lemma) був видатним ефіопським вченим, який відкрив природний спосіб лікування шистосомозу.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

Будь-який JSX, який ви поміщаєте всередину тегу компонента, буде переданий як проп `children` цьому компоненту.

</Hint>

<Solution>

Ось як ви можете використовувати компонент `Card` в обох місцях:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Фото</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Аклілу Лемма (Aklilu Lemma)"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>Про</h1>
        <p>Аклілу Лемма (Aklilu Lemma) був видатним ефіопським вченим, який відкрив природний спосіб лікування шистосомозу.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

Ви також можете зробити `title` окремим пропом, якщо ви хочете, щоб у кожного `Card` завжди був заголовок:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Фото">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Аклілу Лемма (Aklilu Lemma)"
          width={100}
          height={100}
        />
      </Card>
      <Card title="Про">
        <p>Аклілу Лемма (Aklilu Lemma) був видатним ефіопським вченим, який відкрив природний спосіб лікування шистосомозу.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
