---
id: conditional-rendering
title: Умовний рендеринг
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

React дозволяє розподілити логіку на окремі компоненти. Ці компоненти можна показувати або ховати в залежності від поточного стану компонента.

Умовний рендеринг у React працює так само, як і умовні вирази працюють в JavaScript. Іноді потрібно пояснити React, як стан впливає на те, які компоненти треба сховати, а які — відрендерити, та як саме. Для цього використовуйте [умовний оператор](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) JavaScript, або вирази подібні до [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else).

Розглянемо два компоненти:

```js
function UserGreeting(props) {
  return <h1>З поверненням!</h1>;
}

function GuestGreeting(props) {
  return <h1>Зареєструйтеся, будь-ласка.</h1>;
}
```

Ми створимо компонент `Greeting`, який відображає один з цих компонентів у залежності від того, чи користувач ввійшов до сайту:

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Спробуйте замінити значення isLoggedIn на true та подивіться на ефект.
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

У цьому прикладі різне вітання відрендериться в залежності від значення пропу `isLoggedIn`.

### Змінні-елементи {#element-variables}

Ви можете використовувати змінні для того, щоб зберігати елементи React. Це допоможе вам умовно рендерити лише частину компонента, в той час, як інша частина компонента залишається незмінною.

Розглянемо ще два компоненти, що представляють кнопки Увійти(Login) та Вийти (Logout)

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Увійти
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Вийти
    </button>
  );
}
```

В наступному прикладі, ми створимо [компонент зі станом](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) під назвою `LoginControl`.

Він відрендерить `<LoginButton />`, або `<LogoutButton />` в залежності від поточного стану. Він також відрендерить `<Greeting />` з минулого прикладу:

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

Незважаючи на те, що оголошення змінної та використання `if`-виразів для умовного рендерування є гарним варіантом, але іноді хочеться коротший синтаксис. Для цього існують декілька інших способів для написання умов прямо в JSX, які ми розглянемо нижче.

### Вбудовані умови if з логічним оператором && {#inline-if-with-logical--operator}

Ви можете [вставляти будь-який вираз у JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) охопивши його у фігурні дужки. Це правило поширюється і на логічний оператор `&&` JavaScript, яким можно зручно вставити елемент в залежності від умови:

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Доброго дня!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          У вас {unreadMessages.length} непрочитаних повідомлень.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

Цей приклад працює коректно, тому що в JavaScript вираз `true && expression` завжди обчислюється як `expression`, а вираз `false && expression` — як `false`.

Тому, якщо умова правдива (`true`), то елемент, який йде безпосередньо після `&&`, з'явиться у виводу. Якщо ж умова помилкова (`false`), React проігнорує та пропустить його.

### Вбудовані умови if-else з тернарним оператором {#inline-if-else-with-conditional-operator}

Іншим методом для умовного рендерингу елементів є використання тернарного оператора [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).

У наступному прикладі, ми використаємо цей метод для того, щоб відрендерити маленький кусочок тексту.

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      Користувач <b>{isLoggedIn ? 'зараз' : 'не'}</b> на сайті.
    </div>
  );
}
```

Цей метод також можна використувати для більших виразів, але це може зробити код менш очевидним:

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

Як у JavaScript, так і в React вибір синтаксису залежить від ваших уподобань і прийнятого у вашій команді стилю. Також пам'ятайте, що якщо якась умова стає занадто складною, можливо прийшов час [вилучити частину коду в окремий компонент](/docs/components-and-props.html#extracting-components).

### Запобігання рендеринга компонента {#preventing-component-from-rendering}

У рідкісних випадках може виникнути потреба в тому, щоб дозволити компоненту сховати себе, навіть якщо він вже був відрендереним іншим компонентом. Для цього поверніть `null` замість того, що зазвичай йде на рендеринг.

У наступному прикладі, `<WarningBanner />` буде відрендерино в залежності від значення пропу `warn`. Якщо значення пропу `false`, тоді компонент нічого не рендерить:

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Попередження!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Сховати' : 'Показати'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

Повертаючи `null` із методу `render` ніяк не впливає на спрацювання методів життєвого циклу компонента. Наприклад, `componentDidUpdate` все одно буде викликаний.
