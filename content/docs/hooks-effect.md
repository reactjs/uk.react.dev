---
id: hooks-state
title: Використовуємо хук ефекту
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-state.html
---

<<<<<<< HEAD
*Хуки* — це новинка в React 16.8. Вони дозволяють вам використовувати стан та інші можливості React без написання класу.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Synchronizing with Effects](https://beta.reactjs.org/learn/synchronizing-with-effects)
> - [You Might Not Need an Effect](https://beta.reactjs.org/learn/you-might-not-need-an-effect)
> - [`useEffect`](https://beta.reactjs.org/reference/react/useEffect)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

*Hooks* are a new addition in React 16.8. They let you use state and other React features without writing a class.
>>>>>>> b0ccb47f33e52315b0ec65edb9a49dc4910dd99c

*Хук ефекту* дозволяє вам виконувати побічні ефекти в функціональному компоненті:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Подібно до componentDidMount та componentDidUpdate:
  useEffect(() => {
    // Оновлюємо заголовок документа, використовуючи API браузера
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>Ви натиснули {count} разів</p>
      <button onClick={() => setCount(count + 1)}>
        Натисни мене
      </button>
    </div>
  );
}
```

Цей фрагмент коду базується на [прикладі лічильника з попередньої сторінки](/docs/hooks-state.html), але ми додали новий функціонал до неї: ми змінюємо заголовок документа на користувацьке повідомлення, яке містить кількість натискань.

Побічними ефектами в React є завантаження даних, оформлення підписки і зміна вручну DOM в React-компонентах. Неважливо, називаєте ви ці операції "побічними ефектами" (або просто "ефектами") чи ні, вам скоріше за всього доводилось використовувати їх в ваших компонентах раніше.

>Порада
>
>Якщо ви знайомі з класовими методами життєвого циклу React, то уявляйте хук `useEffect`, як комбінацію `componentDidMount`, `componentDidUpdate` та `componentWillUnmount`.

Існують два види побічних ефектів в React-компонентах: ті, які потребують і ті, які не потребують скидання. Давайте розглянемо обидва приклади в деталях.

## Ефекти без скидання {#effects-without-cleanup}

Інколи ми хочемо **запустити додатковий код після того, як React оновив DOM.** Мережеві запити, ручні DOM-мутації та логування є прикладами ефектів, які не потребують скидання. Це тому, що ми їх запускаємо і після цього відразу забуваємо про них, оскільки більше ніяких додаткових дій не потрібно. Давайте порівняємо, як класи та хуки дозволяють реалізовувати такі побічні ефекти.

### Приклад з використанням класів {#example-using-classes}

В класових React-компонентах метод `render` не може викликати побічні ефекти сам по собі. Це нам не підходить для наших цілей, оскільки ми в основному хочемо викликати наші ефекти *після того*, як React оновив DOM.

Ось чому в класах React ми викликаємо побічні ефекти в `componentDidMount` та `componentDidUpdate` методах життєвого циклу. Повертаючись до нашого прикладу, тут показаний лічильник, який реалізований з допомогою класового React-компонента, який оновлює заголовок документа якраз після того, як React внесе зміни до DOM:

```js{9-15}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `Ви натиснули ${this.state.count} разів`;
  }

  componentDidUpdate() {
    document.title = `Ви натиснули ${this.state.count} разів`;
  }

  render() {
    return (
      <div>
        <p>Ви натиснули {this.state.count} разів</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Натисни мене
        </button>
      </div>
    );
  }
}
```

Зверніть увагу, що **ми продублювали код між цими двома методами життєвого циклу в класі.**

Це все тому, що в багатьох випадках ми хочемо виконати той самий побічний ефект незалежно від того чи компонент тільки змонтувався, або він оновився. Ми б хотіли, щоб ці побічні ефекти викликались після кожного рендеру, але класові React-компоненти не мають методу, який це може зробити. Ми б могли винести окремий метод, але нам все рівно би потрібно було викликати їх у двох місцях.

Тепер, давайте розглянемо те, як ми можемо реалізувати теж саме, використовуючи хук `useEffect`.

### Приклад з використанням хуків {#example-using-hooks}

Ми уже розглядали даний приклад на початку цієї сторінки, але давайте розберемо його докладніше:

```js{1,6-8}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Ви натиснули ${count} разів`;
  });

  return (
    <div>
      <p>Ви натиснули {count} разів</p>
      <button onClick={() => setCount(count + 1)}>
        Натисни мене
      </button>
    </div>
  );
}
```

**Що ж робить `useEffect`?** Використовуючи цей хук, ви говорите React зробить щось після рендера компонента. React запам'ятає функцію (тобто "ефект"), яку ви передали та викличе її після того, як внесе зміни в DOM. У цьому ефекті, ми встановлюємо заголовок документа, але ми також можемо виконати або викликати який-небудь імперативний API.

**Чому ж ми викликаємо `useEffect` всередині компонента?** Це дає нам доступ до змінної стану `count` (або до будь-яких інших пропсів) прямо з ефекту. Нам не потрібен спеціальний API для доступу до цієї змінної -- вона вже знаходиться в області видимості функції. Хуки використовують JavaScript-замикання, і таким чином, їм не потрібен спеціальний для React API, так як JavaScript має готове рішення для цієї задачі.

**Чи виконується `useEffect` після кожного рендеру?** Так! За замовчуванням він буде виконуватися після кожного рендеру *та* кожного оновлення. (Ми пізніше розглянемо, [як це налаштувати](#tip-optimizing-performance-by-skipping-effects).) Замість того, щоб сприймати це з позиції "монтування" та "оновлення", ми радимо просто мати на увазі, що ефекти виконуються після кожного рендеру. React гарантує, що він запустить ефект тільки після того, як DOM оновився.

### Детальне пояснення {#detailed-explanation}

Тепер, коли ми знаємо більше про принцип роботи ефектів, наступний код вже не здається таким незрозумілим:

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Ви натиснули ${count} разів`;
  });
}
```

Ми оголошуємо змінну стану `count` та говоримо React, що ми хочемо використати ефект. Далі, ми передаємо функцію в хук `useEffect`. Саме ця функція і *буде* нашим ефектом. Усередині цього ефекту ми встановлюємо заголовок документа, використовуючи API браузера `document.title`. Ми можемо отримувати доступ до актуального значення змінної `count` зсередини ефекту, так як він знаходиться в області видимості нашої функції. Коли React рендерить наш комопонент, він запам'ятовує ефект, який ми використали, і запускає його після того, як оновить DOM. Це буде відбуватися при кожному рендері в тому числі й при первісному.

Досвідчені JavaScript-розробники можуть помітити, що функція, яку ми передаємо до `useEffect`, буде змінюватися при кожному рендері. Насправді, це було зроблено навмисно. Це якраз те, що дає нам змогу отримувати актуальну версію змінної `count` зсередини ефекту, не турбуючись про те, що її значення застаріє. Кожен раз при повторному рендері, ми ставимо в чергу _новий_ ефект, який замінює попередній. В певному сенсі, це включає поведінку ефектів до частини результата рендеру, тобто кожен ефект «належить» до певного рендеру. Ми розповімо про переваги цього підходу [далі на цій сторінці](#explanation-why-effects-run-on-each-update).

>Порада
>
>На відміну від `componentDidMount` або `componentDidUpdate`, ефекти, запланові за допомогою `useEffect`, не блокують браузер за спроби оновити екран. Ваш додаток буде швидше реагувати на дії користувача, навіть коли ефект ще не закінчився. Більшості ефектів не потрібно працювати в синхронному режимі. В окремих випадках, коли їм все ж потрібно це робити (наприклад, вимірювання макета), існує спеціальний хук [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) з API ідентичним до `useEffect`.

## Ефекти зі скиданням {#effects-with-cleanup}

Раніше ми розглядали побічні ефекти, які не вимагали скидання. Однак, є випадки, коли скидання все ж таки необхідне. Наприклад, **нам може знадобитися встановити підписку** на яке-небудь зовнішнє джерело даних. У цьому випадку дуже важливо виконувати скидання, щоб не сталося витоків пам'яті! Давайте порівняємо, як ми можемо це реалізувати за допомогою класів та хуків.

### Приклад з використанням класів{#example-using-classes-1}

у React-класі, ви, як правило, налаштували би підписку у `componentDidMount` та скинули би її у `componentWillUnmount`. Наприклад, скажімо, у нас є модуль `ChatAPI`, який дозволяє нам підписатися на статус друга в мережі. Ось як ми би підписалися та відобразили би статус, використовуючи клас:

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Завантаження...';
    }
    return this.state.isOnline ? 'Онлайн' : 'Офлайн';
  }
}
```

Зверніть увагу, що `componentDidMount` та `componentWillUnmount` по суті містять ідентичний код. Методи життєвого циклу змушують нас розділяти цю логіку, хоча й концептуально код обох методів відноситься до одного і того ж ефекту.

>Примітка
>
>Уважний читач міг помітити, що для правильної роботи, нашому компоненту також потрібен `componentDidUpdate`. Ми повернемося до цього моменту [нижче](#explanation-why-effects-run-on-each-update) на цій сторінці.

### Приклад з використанням хуків {#example-using-hooks-1}

Давайте розглянемо, як цей компонент буде виглядати, якщо написати його за допомогою хуків.

Ви можливо подумали, що нам буде потрібен окремий ефект для виконання скидання. Але коди для створення та скидання підписки тісно пов'язані, то ми вирішили об'єднати їх у `useEffect`. Якщо ваш ефект повертає функцію, React виконає її, коли настане час скинути ефект:

```js{6-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Зазначаємо, як скинути цей ефект:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Завантаження...';
  }
  return isOnline ? 'Онлайн' : 'Офлайн';
}
```

**Навіщо ми повернули функцію з нашого ефекту?** Це необов'язковий механізм скидання ефектів. Кожен ефект може повернути функцію, яка скине його. Це дає нам можливість об'єднати разом логіку оформлення та скасування підписки. Вони, все-таки, частина одного й того ж ефекту!

**Коли саме React буде скидати ефект?** React буде скидати ефект перед тим, як компонент розмонтується. Однак, як ми вже знаємо, ефекти виконуються не один раз, а при кожному рендері. Ось чому React *також* скидає ефект з попереднього рендеру, перед тим, як запустити наступний. Ми розглянемо [чому це дозволяє уникнути багів](#explanation-why-effects-run-on-each-update) і [як відмовитися від цієї логіки, якщо це викликає проблеми з продуктивністю](#tip-optimizing-performance-by-skipping-effects) далі.

>Примітка
>
>Нам не потрібно повертати іменовану функцію з ефекту. Ми назвали її `cleanup`, щоб пояснити її призначення. Ви можете за бажанням повернути стрілкову функцію або назвати її якось інакше.

## Підсумок {#recap}

Ми дізналися, що за допомогою `useEffect`, ми можемо викликати різні побічні ефекти після того, як компонент відрендериться. Деякі ефекти потребують скидання, тому вони повертають відповідну функцію:

```js
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

У деяких ефектах немає етапу скидання, тому вони не повертають нічого.

```js
  useEffect(() => {
    document.title = `Ви натиснули ${count} разів`;
  });
```

Хук ефекту покриває обидва сценарії єдиним API.

-------------

**Якщо ви відчуваєте, що ви достатньо розібралися з тим, як працює хук ефекту, ви можете відправитися на [сторінку про правила хуків](/docs/hooks-rules.html) прямо зараз.**

-------------

## Поради щодо використання ефектів {#tips-for-using-effects}

Далі, ми поглибимося у деякі особливості хуку `useEffect`, про які досвідчені користувачі React напевно вже задумалися. Будь ласка, не змушуйте себе заглиблюватися в ці особливості прямо зараз. Ви можете спершу закріпити вище пройдений матеріал і повернутися сюди пізніше в будь-який момент.

### Порада: використовуйте різні хуки для різних задач {#tip-use-multiple-effects-to-separate-concerns}

Одна з ключових проблем, яку ми описали в [мотивації](/docs/hooks-intro.html#complex-components-become-hard-to-understand), наводить аргументи про те, що на відміну від хуків, класові методи життєвого циклу часто містять логіку, яка ніяк між собою не пов'язана, в той час як пов'язана логіка, розбивається на декілька методів. Далі ми наведемо приклад компонента, який об'єднує в собі логіку лічильника та індикатора статусу нашого друга з попередніх прикладів:

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `Ви натиснули ${this.state.count} разів`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `Ви натиснули ${this.state.count} разів`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

Зверніть увагу, що логіка, яка встановлює `document.title` розділена між `componentDidMount` та `componentDidUpdate`. Логіка підписки також розкидана між `componentDidMount` та `componentWillUnmount`. А метод `componentDidMount` містить в собі логіку для обох задач.

Отже, як можна вирішити цю проблему за допомогою хуків? Так само як [ви можете використовувати хук стану більш ніж один раз](/docs/hooks-state.html#tip-using-multiple-state-variables), ви також можете використати декілька ефектів. Це дає нам можливість розділяти різну незв'язану між собою логіку між різними ефектами:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Ви натиснули ${count} разів`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```

**За допомогою хуків, ми можемо розділити наш код виходячи з того, що він робить**, а не за принципами методів життєвого циклу. React буде виконувати *кожен* використаний ефект у компоненті, згідно з порядком їх оголошення.

### Пояснення: чому ефекти виконуються при кожному оновленні {#explanation-why-effects-run-on-each-update}

Якщо ви звикли користуватися класами, вам може бути не дуже зрозуміло, чому етап скидання ефекту відбувається після кожного наступного рендеру, а не один лише раз під час розмонтування. Давайте розглянемо на практиці, чому такий підхід допомагає створювати компоненти з меншою кількістю багів.

[Раніше на цій сторінці](#example-using-classes-1), ми розглядали приклад з компонентом `FriendStatus`, який відображає в мережі наш друг чи ні. Наш клас бере `friend.id` з `this.props`, підписується на статус друга після того, як компонент змонтувався, і відписується під час розмонтування:

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

**Але що ж станеться, якщо проп `friend` зміниться**, поки компонент все ще знаходиться на екрані? Наш компонент буде відображати статус в мережі вже якогось іншого друга. Це якраз і є баг. Це також може привести до витоку пам'яті або взагалі до вильоту нашого додатку при розмонтуванні, так як метод відписки буде використовувати неправильний ID друга, від якого ми хочемо відписатися.

У класовому компоненті нам би довелося додати `componentDidUpdate`, щоб вирішити цю задачу:

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Відписка від попереднього friend.id
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Підписка на наступний friend.id
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

Невикористання `componentDidUpdate` належним чином — це одне з найпоширеніших джерел багів в React-додатках.

Тепер давайте розглянемо версію цього ж самого компонента, але вже написаного з використанням хуків:

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Такого бага в цьому компоненті немає. (Але ми і не змінили там нічого)

Тут немає ніякого особливого коду для вирішення проблем з оновленнями, так як `useEffect` вирішує їх *за замовчуванням*. Він скидає попередні ефекти перш ніж виконати нові. Щоб показати це на практиці, давайте розглянемо послідовність підписок і відписок, які цей компонент може виконати протягом деякого часу.

```js
// Монтуємо з пропсами { friend: { id: 100 } }
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Виконуємо перший ефект

// Оновлюємо з пропсами { friend: { id: 200 } }
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Скидаємо попередній ефект
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Виконуємо наступний ефект

// Оновлюємо з пропсами { friend: { id: 300 } }
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Скидаємо попередній ефект
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Виконуємо наступний ефект

// Розмонтуємо
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Скидаємо останній ефект
```

Ця логіка за замовчуванням гарантує узгодженість виконуваних нами дій і запобігає багам, поширених в класових компонентах через упущену логіку оновлення.

### Порада: оптимізація продуктивності за рахунок пропуску ефектів {#tip-optimizing-performance-by-skipping-effects}

У деяких випадках скидання або виконання ефекту при кожному рендері може спричинити проблеми з продуктивністю. У класових компонентах, ми можемо вирішити це використовуючи додаткове порівняння `prevProps` або `prevState` всередині `componentDidUpdate`:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `Ви натиснули ${this.state.count} разів`;
  }
}
```

Цю логіку доводиться використовувати досить часто, тому ми вирішили вбудувати її в API хука `useEffect`. Ви можете зробити так, щоб React *пропускав* виклик ефекту, якщо певні значення залишилися без змін між наступними рендерами. Щоб зробити це, передайте масив в `useEffect` другим необов'язковим аргументом:

```js{3}
useEffect(() => {
  document.title = `Ви натиснули ${count} разів`;
}, [count]); // Ефект перезапускається тільки якщо count змінився
```

У цьому прикладі, ми передаємо `[count]` другим аргументом. Але що це взагалі означає? Це означає, що якщо `count` дорівнюватиме `5` і наш компонент повторно відрендериться з тим самим значенням `count = 5`, React порівняє `[5]` з попереднього рендеру і `[5]` з наступного рендеру. Так як, всі елементи масиву залишилися без змін (`5 === 5`), React пропустить цей ефект. Це і є оптимізація даного процесу.

Коли при наступному рендері наша змінна `count` оновиться до `6`, React порівняє елементи в масиві `[5]` з попереднього рендеру і елементи масиву`[6]` з наступного рендеру. Цього разу, React виконає наш ефект, так як `5 !== 6`. Якщо у вас буде кілька елементів в масиві, React виконуватиме наш ефект, в тому випадку, коли хоча б один з них буде відрізнятися.

Це також працює для ефектів з етапом скидання:

```js{10}
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Повторно підписатися, тільки якщо props.friend.id змінився
```

У майбутньому, другий аргумент можливо буде додаватися автоматично за допомогою трансформації під час виконання.

>Примітка
>
>Якщо ви хочете використати цю оптимізацію, зверніть увагу на те, щоб масив включав в себе **усі значення з області видимості компонента (такі як пропси і стан), які можуть змінюватися з плином часу, і які будуть використовуватися ефектом**. В іншому випадку, ваш код буде посилатися на застаріле значення з попередніх рендерів. Дізнайтеся більше про те, [як діяти з функціями](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) і [що робити з часто змінюваними масивами](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>Якщо ви хочете запустити ефект і скинути його тільки один раз (при монтуванні і розмонтуванні), ви можете передати порожній масив (`[]`) другим аргументом. React вважатиме, що ваш ефект не залежить від *будь-яких* значень з пропсов або стану і тому не буде виконувати повторних рендерів. Це не обробляється як особливий випадок -- він безпосередньо випливає з логіки роботи масивів залежностей.
>
>Якщо ви передасте порожній масив (`[]`), пропси і стан всередині ефекту завжди матимуть значення, присвоєні їм спочатку. Хоча передача `[]` другим аргументом ближче за моделлю мислення  до знайомих `componentDidMount` та `componentWillUnmount`, зазвичай є [кращі](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [способи](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) уникнути частих повторних рендерів. Не забувайте, що React відкладає виконання `useEffect`, поки браузер не відмалює усі зміни, тому виконання додаткової роботи не є суттєвою проблемою.
>
>Ми радимо використовувати правило [`exhaustive-deps`](https://github.com/facebook/react/issues/14920), що входить в наш пакет правил лінтера [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Воно попереджає, коли залежності описані неправильно і пропонує виправлення.

## Наступні кроки {#next-steps}

Вітаємо! Це була довга сторінка, але ми сподіваємося, що під кінець, у нас вийшло відповісти на всі ваші запитання з приводу роботи ефектів. Ви вже дізналися про хук стану і про хук ефекту, і тепер є *дуже багато* речей, які ви можете робити, об'єднавши їх разом. Вони охоплюють більшість випадків для використання класів. В інших випадках, вам можуть стати в нагоді [додаткові хукі](/docs/hooks-reference.html).

Ми також дізналися, як хукі позбавляють від проблем описаних у [мотивації](/docs/hooks-intro.html#motivation). Ми побачили, як за допомогою скидання ефектів нам вдається уникнути повторення коду в `componentDidUpdate` і `componentWillUnmount`, об'єднати пов'язаний код разом і захистити наш код від багів. Ми також розглянули, як можна розділяти наші ефекти за змістом і призначенням, що раніше було неможливо в класах.

На цьому етапі, ви, можливо, ставите питанням, як хукі працюють в цілому. Як React розуміє, яка змінна стану відповідає якому виклику `useState` між повторними рендерами? Як React «зіставляє» попередні і наступні ефекти при кожному оновленні?  **На наступній сторінці, ми дізнаємося про [правила хуків](/docs/hooks-rules.html), так як вони є запорукою належного функціонування хуків.**
