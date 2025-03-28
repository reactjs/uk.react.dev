---
title: Написання розмітки з JSX
---

<Intro>

*JSX* — це синтаксичне розширення для JavaScript, яке дозволяє вам писати HTML-подібну розмітку всередині файлу JavaScript. Хоча існують інші способи написання компонентів, більшість розробників React віддають перевагу лаконічності JSX, і більшість кодових баз використовують його.

</Intro>

<YouWillLearn>

* Чому React змішує розмітку з логікою відображення
* Чим JSX відрізняється від HTML
* Як відображати інформацію за допомогою JSX

</YouWillLearn>

## JSX: Вставка розмітки в JavaScript {/*jsx-putting-markup-into-javascript*/}

Веб був побудований на HTML, CSS та JavaScript. Протягом багатьох років веброзробники розміщали вміст у HTML, дизайн у CSS, а логіку у JavaScript — часто у відокремлених файлах! Вміст розмічався всередині HTML, тоді як логіка сторінки мешкала окремо у JavaScript:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="HTML розмітка з фіолетовим фоном та елементом div з двома дочірніми тегами: p та form.">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Три JavaScript обробники з жовтим фоном: onSubmit, onLogin та onClick.">

JavaScript

</Diagram>

</DiagramGroup>

У міру зростання інтерактивності Вебу, логіка все більше впливала на вміст. JavaScript став відповідальним за HTML! Ось чому **у React, логіка відображення та розмітка знаходяться разом в одному місці — компонентах.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="React-компонент з HTML та JavaScript змішаних з попередніх прикладів. Функція називається Sidebar, яка викликає функцію isLoggedIn, яка виділена жовтим кольором. Вкладений всередині функції, яка виділена фіолетовим кольором, є тег p, який був показаний раніше, і тег Form, який посилається на компонент, показаний на наступній діаграмі.">

`Sidebar.js` React компонент

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="React-компонент з HTML та JavaScript змішаних з попередніх прикладів. Назва функції - Form, яка містить два обробники подій onClick та onSubmit, які позначені жовтим кольором. Після обробників слідує HTML, який позначений фіолетовим кольором. В HTML міститься елемент форми з вкладеним елементом input, кожен з них має властивість onClick.">

`Form.js` React компонент

</Diagram>

</DiagramGroup>

Зберігання логіки відображення кнопки та її розмітки разом гарантує, що вони залишаються синхронізованими одне з одним при кожному редагуванні. Натомість деталі, які не мають відношення одна до одної, як-от розмітка кнопки та розмітка бічної панелі, ізольовані одна від одної, що робить безпечну зміну кожної з них окремо.

Кожен компонент React — це функція JavaScript, яка може містити деяку розмітку, яку React відображає в браузері. Компоненти React використовують розширення синтаксису, яке називається JSX, для представлення цієї розмітки. JSX схожий на HTML, але трохи суворіший і може відображати динамічну інформацію. Найкращий спосіб зрозуміти це — перетворити деяку HTML-розмітку на розмітку JSX.

<Note>

JSX та React — дві різні речі. Їх часто використовують разом, але ви *можете* [використовувати їх незалежно](https://uk.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) одне від одного. JSX є розширенням синтаксису, у той час, як React — бібліотека JavaScript.

</Note>

## Конвертація HTML в JSX {/*converting-html-to-jsx*/}

Припустимо, у вас є деякий (абсолютно правильний) HTML:

```html
<h1>Список завдань Геді Ламари</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Геді Ламар (Hedy Lamarr)" 
  class="photo"
>
<ul>
    <li>Винахід нових світлофорів
    <li>Провести репетицію сцени з фільму
    <li>Вдосконалення технології спектра
</ul>
```

І ви хочете вставити його у свій компонент:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Якщо ви скопіюєте та вставите його як є, він не буде працювати:


<Sandpack>

```js
export default function TodoList() {
  return (
    // Це не зовсім працює!
    <h1>Список завдань Геді Ламари</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Геді Ламар (Hedy Lamarr)" 
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
img { height: 90px }
```

</Sandpack>

Це тому, що JSX строгіший і має декілька більше правил ніж HTML! Якщо ви прочитаєте повідомлення про помилки вище, вони нададуть вам вказівки щодо виправлення розмітки, або ви можете скористатися наступним посібником.

<Note>

Більшість часу, повідомлення про помилки, що відображаються в React, допоможуть вам знайти, де знаходиться проблема. Зверніться до них, якщо ви застрягли!

</Note>

## Правила JSX {/*the-rules-of-jsx*/}

### 1. Повертайте один кореневий елемент {/*1-return-a-single-root-element*/}

Щоб повернути декілька елементів із компонента, **оберніть їх одним батьківським тегом.**

Наприклад, ви можете використовувати `<div>`:

```js {1,11}
<div>
  <h1>Список завдань Геді Ламари</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Геді Ламар (Hedy Lamarr)" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


Якщо ви не хочете додавати додатковий `<div>` до вашої розмітки, ви можете написати `<>` та `</>` замість нього:

```js {1,11}
<>
  <h1>Список завдань Геді Ламари</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Геді Ламар (Hedy Lamarr)" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Цей порожній тег називається *[Фрагмент.](/reference/react/Fragment)* Фрагменти дозволяють вам групувати елементи без додавання додаткових тегів до HTML-структури сторінки.

<DeepDive>

#### Чому декілька тегів JSX потрібно обгортати? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX виглядає схожим на HTML, але "під капотом" він перетворюється на звичайні об'єкти JavaScript. Ви не можете повернути два об'єкти з функції без обгортання їх у масив. Це пояснює, чому ви також не можете повернути два теги JSX без обгортання їх в інший тег або Фрагмент.

</DeepDive>

### 2. Закривайте всі теги {/*2-close-all-the-tags*/}

JSX вимагає явного закриття тегів: теги, які закриваються самі, такі як `<img>`, повинні бути записані як `<img />`, а теги, які обгортають щось, наприклад `<li>oranges`, мають бути написані як `<li>oranges</li>`.

Ось як виглядають закритими зображення та пункти списку Геді Ламари:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Геді Ламар (Hedy Lamarr)" 
    class="photo"
   />
  <ul>
    <li>Винахід нових світлофорів</li>
    <li>Провести репетицію сцени з фільму</li>
    <li>Вдосконалення технології спектра</li>
  </ul>
</>
```

### 3. camelCase для <s>всіх</s> більшості речей! {/*3-camelcase-salls-most-of-the-things*/}

JSX перетворюється в JavaScript, а атрибути, записані в JSX, стають ключами об'єктів JavaScript. У ваших компонентах ви часто будете хотіти зчитувати ці атрибути у змінні. Але у JavaScript є обмеження на імена змінних. Наприклад, їх імена не можуть містити дефіси або бути зарезервованими словами, такими як `class`.

Ось чому в React багато атрибутів HTML та SVG записані у camelCase. Наприклад, замість `stroke-width` ви використовуєте `strokeWidth`. Оскільки `class` є зарезервованим словом, в React ви пишете `className`, названий за [відповідною властивістю DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Геді Ламар (Hedy Lamarr)" 
  className="photo"
/>
```

Ви можете [знайти всі ці атрибути в списку властивостей DOM компонента.](/reference/react-dom/components/common) Якщо ви допустите помилку, не хвилюйтесь - React надрукує повідомлення з можливим виправленням у [консолі браузера.](https://developer.mozilla.org/docs/Tools/Browser_Console)

<Pitfall>

З історичних причин атрибути [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) та [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) записуються з дефісами, як у HTML.

</Pitfall>

### Професійна порада: Використовуйте JSX конвертер {/*pro-tip-use-a-jsx-converter*/}

Конвертація всіх цих атрибутів у наявній розмітці може бути виснажливою! Ми рекомендуємо використовувати [конвертер](https://transform.tools/html-to-jsx) для перекладу вашого наявного HTML та SVG у JSX. Конвертери дуже корисні на практиці, але все ж варто розуміти, що відбувається, щоб ви могли зручно писати JSX самостійно.

Ось ваш кінцевий результат:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Список завдань Геді Ламари</h1>
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
img { height: 90px }
```

</Sandpack>

<Recap>

Тепер ви розумієте, чому існує JSX і як його використовувати в компонентах:

- Компоненти React групують логіку відображення разом з розміткою, оскільки вони пов'язані.
- JSX схожий на HTML, з декількома відмінностями. Якщо потрібно, ви можете скористатися [конвертером](https://transform.tools/html-to-jsx).
- Повідомлення про помилки часто вкажуть вам правильний шлях для виправлення вашої розмітки.

</Recap>



<Challenges>

#### Конвертація деякого HTML в JSX {/*convert-some-html-to-jsx*/}

Цей HTML був вставлений в компонент, але він не є валідним JSX. Виправте його:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Ласкаво просимо на мій сайт!</h1>
    </div>
    <p class="summary">
      Ви можете знайти мої думки тут.
      <br><br>
      <b>Та <i>зображення</b></i> науковців!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

Чи робити це вручну, чи скористатися конвертером - це ваш вибір!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Ласкаво просимо на мій сайт!</h1>
      </div>
      <p className="summary">
        Ви можете знайти мої думки тут.
        <br /><br />
        <b>Та <i>зображення</i></b> науковців!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
