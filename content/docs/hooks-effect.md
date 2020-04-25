---
id: hooks-state
title: Використовуємо хук ефекту
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-state.html
---

*Хуки* — це новинка в React 16.8. Вони дозволяють вам використовувати стан та інші можливості React без написання класу.

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

Побічними ефектами в React є завантаження даних, оформлення підписки і зміна вручну DOM в React-компонентах. Неважливо, називаєте чи ви ці операції "побічними ефектами" (або просто "ефектами") чи ні, вам скоріше за всього доводилось використовувати їх в ваших компонентах раніше.

>Порада
>
>Якщо ви знайомі з класовими методами життєвого циклу React, то уявляйте хук `useEffect`, як комбінацію `componentDidMount`, `componentDidUpdate` та `componentWillUnmount`.

Існують два види побічних ефектів в React-компонентах: ті, які потребують і ті, які не потребують скидання. Давайте розглянемо обидва приклади в деталях.

## Ефекти без скидання {#effects-without-cleanup}

Інколи ми хочемо **запустити додатковий код після того, як React оновив DOM.** Мережеві запити, ручні DOM-мутації та логування є прикладами ефектів, які не потребують скидання. Це тому, що ми їх запускаємо і після цього відразу забуваємо про них, оскільки більше ніяких додаткових дій не потрібно. Давайте порівняємо, як класи та хуки дозволяють реалізовувати такі побічні ефекти.

### Приклад з використанням класів {#example-using-classes}

В класових React-компонентах метод `render` не може викликати побічні ефекти сам по собі. Це нам не підходить для наших цілей, оскільки ми в основному хочемо викликати наші ефект *після того*, як React оновив DOM.

Ось чому в класах React ми викликаємо побічні ефекти в `componentDidMount` та `componentDidUpdate` методах життєвого циклу. Повертаючись до нашого прикладу, тут показаний лічильник, який реалізований з допомогою класового React-компонента, який оновлює заголовок документа якраз пілся того, як React внесе зміни до DOM:

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

Це все тому, що в багатьох випадках ми хочемо виконати той самий побічний ефект незалжно від того чи компонент тільки змонтувався, або він оновився. Ми б хотіли, щоб ці побічні ефекти викликались після кожного рендеру, але класові React-компоненти не мають методу, який це може зробити. Ми б могли винести окремий метод, але нам все рівно би потрібно було викликати їх в двох місцях.

Тепер, давайте розглянемо те, як ми можемо реалізувати це саме, використовуючи хук `useEffect`.

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

**Чи виконується `useEffect` після кожного рендеру?** Так! За замовчуванням він буде виконуватися після кожного рендеру *та* кожного оновлення. (Ми пізніше розглянемо, [як це налаштувати](#tip-optimizing-performance-by-skipping-effects).) Замість того, щоб сприймати це з позиції "монтування" та "оновлення", ми радимо просто мати на увазі, що ефекти виконуютьяс після кожного рендеру. React гарантує, що він запустить ефект тільки після того, як DOM оновився.

### Детальне пояснення {#detailed-explanation}

Тепер, коли ми знаємо більше про принцип роботи ефектів, наступний код вже не здається таким незрозумілим:

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Ви натиснули ${count} разів`;
  });
```

Ми оголошуємо змінну стану `count` та говоримо React, що ми хочемо використати ефект. Далі, ми передаємо функцію в хук `useEffect`. Саме ця функція і *буде* нашим ефектом. Усередині цього ефекту ми встановлюємо заголовоку документа, використовуючи API браузера `document.title`. Ми можемо отримувати доступ до актуального значення змінної `count` зсередини ефекту, так як він знаходиться в області видимості нашої функції. Коли React рендерить наш комопонент, він запам'ятовує ефект, який ми використали, і запускає його після того, як оновить DOM. Це буде відбуватися при кожному рендері в тому числі й при первісному.

Досвідчені JavaScript-розробники можуть помітити, що функція, яку ми передаємо до `useEffect`, буде змінюватися при кожному рендері. Насправді, це було зроблено навмисно. Це якраз те, що дає нам змогу отримувати актуальну версію змінної `count` зсередини ефекту, не турбуючись про те, що її значення застаріє. Кожен раз при повторному рендері, ми ставимо в чергу _новий_ ефект, який замінює попередній. В певному сенсі, це включає поведінку ефектів до частини результата рендеру, тобто кожен ефект «належить» до певного рендеру. Ми розповімо про переваги цього підходу [далі на цій сторінці](#explanation-why-effects-run-on-each-update).

>Порада
>
>На відміну від `componentDidMount` або `componentDidUpdate`, ефекти, запланові за допомогою `useEffect`, не блокують браузер за спроби оновити екран. Ваш додаток буде швидше реагувати на дії користувача, навіть коли ефект ще не закінчився. Більшості ефектів не потрібно працювати в синхронному режимі. В окремих випадках, коли їм все ж потрібно це робити (наприклад, вимірювання макета), існує спеціальний хук [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) з API ідентичним до `useEffect`.

## Ефекти зі скиданням {#effects-with-cleanup}

Раніше ми розглядали побічні ефекти, які не вимогали скидання. Однак, є випадки, коли скидання все ж таки необхідне. Наприклад, **нам може знадобитися встановити підписку** на яке-небудь зовнішнє джерело даних. У цьому випадку дуже важливо виконувати скидання, щоб не сталося витоків пам'яті! Давайте порівняємо, як ми можемо це реалізувати за допомогою класів та хуків.

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

**Коли саме React буде скидати ефект?** React буде скидати ефект перед тим, як компонент розмонтується. . Однак, як ми вже знаємо, ефекти виконуються не один раз, а при кожному рендері. Ось чому React *також* скидає ефект з попереднього рендеру, перед тим, як запустити наступний. Ми розглянемо [чому це дозволяє уникнути багів](#explanation-why-effects-run-on-each-update) і [як відмовитися від цієї логіки, якщо це викликає проблеми з продуктивністю](#tip-optimizing-performance-by-skipping-effects) далі.

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

## Tips for Using Effects {#tips-for-using-effects}

We'll continue this page with an in-depth look at some aspects of `useEffect` that experienced React users will likely be curious about. Don't feel obligated to dig into them now. You can always come back to this page to learn more details about the Effect Hook.

### Tip: Use Multiple Effects to Separate Concerns {#tip-use-multiple-effects-to-separate-concerns}

One of the problems we outlined in the [Motivation](/docs/hooks-intro.html#complex-components-become-hard-to-understand) for Hooks is that class lifecycle methods often contain unrelated logic, but related logic gets broken up into several methods. Here is a component that combines the counter and the friend status indicator logic from the previous examples:

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

Note how the logic that sets `document.title` is split between `componentDidMount` and `componentDidUpdate`. The subscription logic is also spread between `componentDidMount` and `componentWillUnmount`. And `componentDidMount` contains code for both tasks.

So, how can Hooks solve this problem? Just like [you can use the *State* Hook more than once](/docs/hooks-state.html#tip-using-multiple-state-variables), you can also use several effects. This lets us separate unrelated logic into different effects:

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

**Hooks let us split the code based on what it is doing** rather than a lifecycle method name. React will apply *every* effect used by the component, in the order they were specified.

### Explanation: Why Effects Run on Each Update {#explanation-why-effects-run-on-each-update}

If you're used to classes, you might be wondering why the effect cleanup phase happens after every re-render, and not just once during unmounting. Let's look at a practical example to see why this design helps us create components with fewer bugs.

[Earlier on this page](#example-using-classes-1), we introduced an example `FriendStatus` component that displays whether a friend is online or not. Our class reads `friend.id` from `this.props`, subscribes to the friend status after the component mounts, and unsubscribes during unmounting:

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

**But what happens if the `friend` prop changes** while the component is on the screen? Our component would continue displaying the online status of a different friend. This is a bug. We would also cause a memory leak or crash when unmounting since the unsubscribe call would use the wrong friend ID.

In a class component, we would need to add `componentDidUpdate` to handle this case:

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Unsubscribe from the previous friend.id
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Subscribe to the next friend.id
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

Forgetting to handle `componentDidUpdate` properly is a common source of bugs in React applications.

Now consider the version of this component that uses Hooks:

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

It doesn't suffer from this bug. (But we also didn't make any changes to it.)

There is no special code for handling updates because `useEffect` handles them *by default*. It cleans up the previous effects before applying the next effects. To illustrate this, here is a sequence of subscribe and unsubscribe calls that this component could produce over time:

```js
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Run first effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Run next effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Run next effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Clean up last effect
```

This behavior ensures consistency by default and prevents bugs that are common in class components due to missing update logic.

### Tip: Optimizing Performance by Skipping Effects {#tip-optimizing-performance-by-skipping-effects}

In some cases, cleaning up or applying the effect after every render might create a performance problem. In class components, we can solve this by writing an extra comparison with `prevProps` or `prevState` inside `componentDidUpdate`:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

This requirement is common enough that it is built into the `useEffect` Hook API. You can tell React to *skip* applying an effect if certain values haven't changed between re-renders. To do so, pass an array as an optional second argument to `useEffect`:

```js{3}
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

In the example above, we pass `[count]` as the second argument. What does this mean? If the `count` is `5`, and then our component re-renders with `count` still equal to `5`, React will compare `[5]` from the previous render and `[5]` from the next render. Because all items in the array are the same (`5 === 5`), React would skip the effect. That's our optimization.

When we render with `count` updated to `6`, React will compare the items in the `[5]` array from the previous render to items in the `[6]` array from the next render. This time, React will re-apply the effect because `5 !== 6`. If there are multiple items in the array, React will re-run the effect even if just one of them is different.

This also works for effects that have a cleanup phase:

```js{10}
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Only re-subscribe if props.friend.id changes
```

In the future, the second argument might get added automatically by a build-time transformation.

>Note
>
>If you use this optimization, make sure the array includes **all values from the component scope (such as props and state) that change over time and that are used by the effect**. Otherwise, your code will reference stale values from previous renders. Learn more about [how to deal with functions](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) and [what to do when the array changes too often](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>If you want to run an effect and clean it up only once (on mount and unmount), you can pass an empty array (`[]`) as a second argument. This tells React that your effect doesn't depend on *any* values from props or state, so it never needs to re-run. This isn't handled as a special case -- it follows directly from how the dependencies array always works.
>
>If you pass an empty array (`[]`), the props and state inside the effect will always have their initial values. While passing `[]` as the second argument is closer to the familiar `componentDidMount` and `componentWillUnmount` mental model, there are usually [better](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [solutions](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) to avoid re-running effects too often. Also, don't forget that React defers running `useEffect` until after the browser has painted, so doing extra work is less of a problem.
>
>We recommend using the [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) rule as part of our [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It warns when dependencies are specified incorrectly and suggests a fix.

## Next Steps {#next-steps}

Congratulations! This was a long page, but hopefully by the end most of your questions about effects were answered. You've learned both the State Hook and the Effect Hook, and there is a *lot* you can do with both of them combined. They cover most of the use cases for classes -- and where they don't, you might find the [additional Hooks](/docs/hooks-reference.html) helpful.

We're also starting to see how Hooks solve problems outlined in [Motivation](/docs/hooks-intro.html#motivation). We've seen how effect cleanup avoids duplication in `componentDidUpdate` and `componentWillUnmount`, brings related code closer together, and helps us avoid bugs. We've also seen how we can separate effects by their purpose, which is something we couldn't do in classes at all.

At this point you might be questioning how Hooks work. How can React know which `useState` call corresponds to which state variable between re-renders? How does React "match up" previous and next effects on every update? **On the next page we will learn about the [Rules of Hooks](/docs/hooks-rules.html) -- they're essential to making Hooks work.**
