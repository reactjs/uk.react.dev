---
id: composition-vs-inheritance
title: Композиція проти наслідування
permalink: docs/composition-vs-inheritance.html
redirect_from:
  - "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React має потужну модель композиції і ми рекомендуємо використовувати композицію замість наслідування для повторного використання коду між компонентами.

В цьому розділі ми розглянемо кілька проблем, котрі нові React-розробники вирішують за допомогою наслідування і покажемо, як вони вирішуються за допомогою композиції.

## Запобіжні заходи {#containment}

Деякі компоненти не знають заздалегідь про свої дочірні елементи. Це особливо характерно для таких компонентів як `Sidebar` чи `Dialog`, котрі представляють собою загальні контейнери.

Ми рекомендуємо, щоб такі компоненти використовували особливий проп `children` для передачі дочірніх елементів напряму до свого виводу:

```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

Це дозволяє іншим компонентам передавати їм довільні дочірні елементи шляхом вкладення JSX:

```js{4-9}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Дякуємо, що завітали на борт нашого космічного корабля!
      </p>
    </FancyBorder>
  );
}
```

**[Спробувати на CodePen](https://codepen.io/gaearon/pen/ozqNOV?editors=0010)**

Усе, що знаходиться між JSX тегом `<FancyBorder>` буде передане в `FancyBorder` компонент як `children` проп. Оскільки `FancyBorder` рендерить `{props.children}` всередині `<div>`, передані елементи з'являться у фінальному виводі.

Іноді, хоч і не так часто, вам може знадобитись кілька подібних "слотів" у компоненті. У таких випадках ви можети придумати власне рішення замість використання `children`:

```js{5,8,18,21}
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/gwZOJp?editors=0010)

Такі React-елементи як `<Contacts />` і `<Chat />` є звичайними об'єктами, а отже ви можете передати їх в ролі пропсів, як і будь-які інші дані. Такий підхід може нагадати вам "слоти" в інших бібліотеках, але React не обмежує вас у тому, що ви можете передати як пропси.

## Спеціалізація {#specialization}

Іноді ми розглядаємо компоненти як "особливий випадок" інших компонентів. Наприклад, ми можемо сказати, що `WelcomeDialog` є особливим випадком `Dialog`.

У React подібне також досягається композицією, коли більш "конкретний" компонент рендерить більш "загальний" і налаштовує його за допомогою пропсів:

```js{5,8,16-18}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Дякуємо, що завітали на борт нашого космічного корабля!" />
  );
}
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

Композиція працює так само добре для компонентів визначених як класи:

```js{10,27-31}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Програма дослідження Марсу"
              message="Як ми можемо звертатися до вас?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Зареєструйте мене!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Ласкаво просимо на борт, ${this.state.login}!`);
  }
}
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## То що з приводу наслідування? {#so-what-about-inheritance}

У Facebook ми використовуємо React у тисячах компонентів і ми не знайшли жодного випадку використання в якому б ми могли порадити створення ієрархій наслідування компонентів.

Пропси і композиція дають вам всю необхідну гнучкість, щоб налаштувати вигляд і поведінку компонента в явний і безпечний спосіб. Пам'ятайте, що компоненти можуть приймати довільні пропси, включно з примітивами, React-елементами чи функціями.

Якщо ви хочете повторно використати функціональність, котра не відноситься до інтерфейсу користувача, ми рекомендуємо витягнути її в окремий JavaScript модуль. Компоненти можуть імпортувати його і використувати функцію, об'єкт чи клас без наслідування.
