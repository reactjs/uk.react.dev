---
title: Умовний рендеринг
---

<Intro>

Ваши компоненти часто потребують відображати різний контент в залежності від умови. У React ви можете умовно рендерити JSX, використовуючи синтаксис JavaScript: оператори `if`, `&&` та `? :`.

</Intro>

<YouWillLearn>

* Як повертати різний JSX в залежності від умови
* Як умовно включати або виключати частину JSX
* Загальні скорочення умовного синтаксису, з якими ви зустрінетеся в кодових базах React

</YouWillLearn>

## Умовне повернення JSX {/*conditionally-returning-jsx*/}

Припустимо, у вас є компонент `PackingList`, який рендерить кілька компонентів `Item`, які можуть бути запаковані або ні:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Список речей для пакування Саллі Райд(Sally Ride)</h1>
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
          name="Фото Тем О'Шонессі(Tam O'Shaughnessy)" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Зверніть увагу, що деякі компоненти `Item` мають проп `isPacked` встановлений на `true` замість `false`. Ви хочете додати позначку (✔) до запакованих речей, якщо `isPacked={true}`.

Ви можете зробити це за допомогою [оператора `if`/`else`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) ось так:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Якщо проп `isPacked` дорівнює `true`, цей код **повертає інше JSX-дерево.** З цією зміною, деякі елементи отримають позначку в кінці:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Список речей для пакування Саллі Райд(Sally Ride)</h1>
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
          name="Фото Тем О'Шонессі(Tam O'Shaughnessy)" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Спробуйте змінити код цього прикладу та подивіться, як змінюється результат!

Зверніть увагу, як ви створюєте розгалужену логіку використовуючи `if` та `return` із JavaScript. У React керування потоком (наприклад, умовами) обробляється за допомогою JavaScript.

### Умовне повернення пустоти за допомогою `null` {/*conditionally-returning-nothing-with-null*/}

У деяких ситуаціях ви хочете взагалі нічого не відображати. Наприклад, скажімо, ви не хочете показувати запаковані елементи взагалі. Але компонент повинен повертати щось. У цьому випадку ви можете повернути `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Якщо `isPacked` дорівнює true, компонент нічого не поверне, тобто `null`. В іншому випадку, він поверне JSX для рендеру.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Список речей для пакування Саллі Райд(Sally Ride)</h1>
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
          name="Фото Тем О'Шонессі(Tam O'Shaughnessy)" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Практика поверення `null` з компонента не є поширенною, оскільки це може здивувати розробника, який намагається його відобразити. Частіше ви б умовно включали або виключали компонент у JSX батьківського компонента. Ось як це зробити!

## Умовне включення JSX {/*conditionally-including-jsx*/}

У попередньому прикладі ви контролювали, яке JSX-дерево повертатиме компонент, якщо взагалі буде. Ви вже могли помітити деяке дублювання у результаті рендера:

```js
<li className="item">{name} ✔</li>
```

дуже схоже на

```js
<li className="item">{name}</li>
```

Обидві умовні гілки повертають `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Хоча це дублювання не шкідливе, воно може ускладнити підтримку вашого коду. Що, якщо ви хочете змінити `className`? Вам доведеться робити це в двох місцях у вашому коду! У такій ситуації ви могли б умовно включити трохи JSX, щоб зробити ваш код більш [DRY.](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

### Умовний (тернарний) оператор (`? :`) {/*conditional-ternary-operator--*/}

JavaScript має компактний синтаксис для написання умовного виразу -- [умовний оператор](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) або "тернарний оператор".

Замість цього:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Ви можете написати ось так:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

Це можна прочитати як *"якщо `isPacked` -- true, тоді (`?`) відобразити `name + ' ✔'`, в іншому випадку (`:`) відобразити `name`"*.

<DeepDive>

#### Чи ці два приклади повністю еквівалентні? {/*are-these-two-examples-fully-equivalent*/}

Якщо ви прийшли з об'єктно-орієнтованого програмування, ви можете припустити, що два приклади вище є трохи різними, оскільки один з них може створити два різних "екземпляри" `<li>`. Але JSX-елементи не є "екземплярами", оскільки вони не містять жодного внутрішнього стану і не є реальними вузлами DOM. Це легкі описи, подібні до креслень. Таким чином, ці два приклади, насправді, *є* абсолютно еквівалентними. [Збереження та скидання стану](/learn/preserving-and-resetting-state) детально розповідає про те, як це працює.

</DeepDive>

Тепер, скажімо, ви хочете обернути текст елемента в інший HTML-тег, наприклад `<del>`, щоб його перекреслити. Ви можете додати ще більше нових рядків і дужок, щоб було легше використовувати вкладенний JSX в кожному з випадків:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список речей для пакування Саллі Райд(Sally Ride)</h1>
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
          name="Фото Тем О'Шонессі(Tam O'Shaughnessy)" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Цей стиль добре працює для простих умов, але використовуйте його з розумом. Якщо ваші компоненти стають заплутаними через занадто великі вкладені умовні розмітки, розгляньте можливість витягнення дочірніх компонентів, щоб все виглядало охайніше та зрозуміліше. У React розмітка є частиною вашого коду, тому ви можете використовувати такі інструменти, як змінні та функції, щоб спростити складні вирази.

### Логічний оператор AND (`&&`) {/*logical-and-operator-*/}

Інший поширений шорткат, з яким ви зіткнетеся -- [логічний оператор AND (`&&`) JavaScript.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.) Всередині компонентів React він часто з'являється, коли ви хочете відрендерити деякий JSX, коли умова є істинною, **або нічого не рендерити в іншому випадку.** З `&&` ви могли б умовно відрендерити позначку, лише якщо `isPacked` дорівнює `true`:

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

Ви можете читати це як *"якщо `isPacked`, тоді (`&&`) відрендерити позначку, в іншому випадку нічого не рендерити"*.

Ось він в дії:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список речей для пакування Саллі Райд(Sally Ride)</h1>
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
          name="Фото Тем О'Шонессі(Tam O'Shaughnessy)" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

[JavaScript && вираз](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) повертає значення своєї правої сторони (у нашому випадку, позначку) якщо ліва сторона (наша умова) `true`. Але якщо умова `false`, то весь вираз стає `false`. React розглядає `false` як "діру" в JSX дереві, так само як `null` або `undefined`, і не рендерить нічого на його місці.


<Pitfall>

**Не ставте числа зліва від `&&`.**

Щоб перевірити умову, JavaScript автоматично перетворює ліву сторону на булеве значення. Однак, якщо ліва сторона дорівнює `0`, то весь вираз отримує це значення (`0`), і React з задоволенням відрендерить `0` замість нічого.

Наприклад, поширеною помилкою є написання коду типу `messageCount && <p>New messages</p>`. Легко припустити, що він не рендерить нічого, коли `messageCount` дорівнює `0`, але насправді він рендерить сам `0`!

Щоб виправити це, зробіть ліву сторону булевою: `messageCount > 0 && <p>New messages</p>`.

</Pitfall>

### Умовне присвоєння JSX змінній {/*conditionally-assigning-jsx-to-a-variable*/}

Коли скорочення заважають писати звичайний код, спробуйте використати оператор `if` та змінну. Ви можете переприсвоювати змінні, визначені за допомогою [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), тому почніть з задання вмісту за замовчуванням, який ви хочете відобразити, name:

```js
let itemContent = name;
```

Використовуйте оператор `if` для переприсвоєння JSX-виразу `itemContent`, якщо `isPacked` дорівнює `true`:

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[Фігурні дужки відкривають "вікно в JavaScript".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Вбудуйте змінну з фігурними дужками в JSX-дерево, вкладаючи раніше обчислений вираз всередину JSX:

```js
<li className="item">
  {itemContent}
</li>
```

Цей стиль є найбільш багатослівним, але він також найбільш гнучкий. Ось як він працює на практиці:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список речей для пакування Саллі Райд(Sally Ride)</h1>
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
          name="Фото Тем О'Шонессі(Tam O'Shaughnessy)" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Як і раніше, це працює не тільки для тексту, але й для довільного JSX:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список речей для пакування Саллі Райд(Sally Ride)</h1>
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
          name="Фото Тем О'Шонессі(Tam O'Shaughnessy)" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Якщо ви не знайомі з JavaScript, цей різноманітний стиль може здатися вам спочатку приголомшливим. Однак, вивчення різних з них допоможе вам читати та писати будь-який код JavaScript -- і не тільки компоненти React! Виберіть той, який вам більше подобається для початку, а потім зверніться до цього довідника знову, якщо ви забудете, як працюють інші.

<Recap>

* У React ви керуєте розгалуженою логікою за допомогою JavaScript.
* Ви можете повернути JSX-вираз умовно за допомогою оператора `if`.
* Ви можете умовно зберегти деякий JSX у змінну, а потім включити його в інший JSX, використовуючи фігурні дужки.
* У JSX, `{cond ? <A /> : <B />}` означає *"якщо `cond`, відобразити `<A />`, інакше `<B />`"*.
* У JSX, `{cond && <A />}` означає *"якщо `cond`, відобразити `<A />`, інакше нічого"*.
* Ці скорочення є поширеними, але ви не повинні їх використовувати, якщо вам більше подобається простий `if`.

</Recap>



<Challenges>

#### Показати значок для незавершених елементів за допомогою `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Використовуйте умовний оператор (`cond ? a : b`) для відображення ❌, якщо `isPacked` не дорівнює `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список речей для пакування Саллі Райд(Sally Ride)</h1>
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
          name="Фото Тем О'Шонессі(Tam O'Shaughnessy)" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список речей для пакування Саллі Райд(Sally Ride)</h1>
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
          name="Фото Тем О'Шонессі(Tam O'Shaughnessy)" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Показати важливість елемента за допомогою `&&` {/*show-the-item-importance-with-*/}

У цьому прикладі, кожен `Item` отримує числовий проп `importance`. Використовуйте оператор `&&` для відображення "_(Важливість: X)_" курсивом, але лише для елементів, важливість яких не дорівнює нулю. Ваш список елементів повинен виглядати так:

* Космічний костюм _(Важливість: 9)_
* Шолом з золотим листом
* Фото Там _(Важливість: 6)_

Не забудьте додати пробіл між двома мітками!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список речей для пакування Саллі Райд(Sally Ride)</h1>
      <ul>
        <Item 
          importance={9} 
          name="Космічний костюм" 
        />
        <Item 
          importance={0} 
          name="Шолом із золотим листям" 
        />
        <Item 
          importance={6} 
          name="Фото Тем О'Шонессі(Tam O'Shaughnessy)" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Це повинно спрацювати:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список речей для пакування Саллі Райд(Sally Ride)</h1>
      <ul>
        <Item 
          importance={9} 
          name="Космічний костюм" 
        />
        <Item 
          importance={0} 
          name="Шолом із золотим листям" 
        />
        <Item 
          importance={6} 
          name="Фото Тем О'Шонессі(Tam O'Shaughnessy)" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Зверніть увагу, що ви повинні написати `importance > 0 && ...` замість `importance && ...`, щоб якщо `importance` дорівнює `0`, `0` не відображався як результат!

У цьому рішенні використовуються дві окремі умови для вставки пробілу між ім'ям та міткою важливості. Ви також можете використати фрагмент з початковим пробілом: `importance > 0 && <> <i>...</i></>` або додати пробіл безпосередньо всередині `<i>`:  `importance > 0 && <i> ...</i>`.

</Solution>

#### Рефакторінг послідовності `? :` на `if` та змінні {/*refactor-a-series-of---to-if-and-variables*/}

Цей компонент `Drink` використовує послідовність умов `? :` для відображення різної інформації в залежності від того, чи є проп `name` `"tea"` або `"coffee"`. Проблема в тому, що інформація про кожний напій розподілена між кількома умовами. Рефакторінг цього коду, щоб використовувати один `if` замість трьох умов `? :`.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Після того, як ви рефакторили код, щоб використовувати `if`, у вас є ідеї, як його можна спростити?

<Solution>

Існує багато способів, як це можна зробити, але ось одна вихідна точка:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Тут інформація про кожний напій згрупована разом, замість того, щоб розподілятися між кількома умовами. Це спрощує додавання нових напоїв у майбутньому.

Іншим рішенням було б видалити умову взагалі, перемістивши інформацію в об'єкти:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
