---
id: higher-order-components
title: Компоненти вищого порядку
permalink: docs/higher-order-components.html
---

Компонент вищого порядку (КВП) — це просунута технологія для повторного використання логіки компоненту. Сам по собі КВП не є частиною React API, але через композиційну природу компонентів він є розповсюдженним патерном проектування.

Тобто, **компонент вищого порядку — це функція, яка приймає компонент та повертає новий компонент.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Якщо звичайний компонент трасформує пропси у UI, то компонент вищого порядку трасформує один компонент у інший.

КВП поширені у таких сторонніх бібліотеках, як [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) у Redux, або [`createFragmentContainer`](http://facebook.github.io/relay/docs/en/fragment-container.html) у Relay.

У цьому розділі ми обговоримо чому компоненти вищого порядку корисні та як створювати їх власноруч.

## Використання КВП для перехресної функціональності {#use-hocs-for-cross-cutting-concerns}

> **Примітка**
>
> Раніше ми рекомендували міксини для реалізації перехресної функціональності. Але з часом ми з’ясували, що від них більше клопоту, ніж користі. [Дізнайтеся більше](/blog/2016/07/13/mixins-considered-harmful.html) про те, чому ми відмовилися від міксинів та як ви можете переписати існуючі компоненти.

Зазвичай компоненти є основною одиницею повторного використання коду у React. Однак ви побачите, що вони не є відповідним рішенням низки проблем.

Наприклад, ви маєте компонент `CommentList`, який підписується на зовнішнє джерело даних, щоб відобразити список коментарів:

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" є деяким глобальним джерелом даних
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Підписка на зміни
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Відписка
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Оновлення стану компонента, коли у джерелі даних відбулись зміни
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

Пізніше, ви створите компонент `BlogPost` для підписки на одну публікацію блогу, який реалізується за схожою логікою:

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` та `BlogPost` не є ідентичними — вони викликають різні методи `DataSource` та вони відображають різний UI. Однак значна частина їх реалізації збігається:

- Після монтування вони підписуються на зміни у `DataSource`.
- Викликають `setState`, коли у джерелі даних відбуваються зміни.
- При демонтуванні вони відписуються від `DataSource`.

Чи можете ви уявити, що у великому додатку ця схема підписки буде виникати знову і знову? Нам потрібна абстракція, яка дозволить описати цю логіку в одному місці та звертатися до неї у багатьох компонентах. Саме тут доречно використати компонент вищого порядку.

Ми можемо написати функцію, що створює компоненти, як `CommentList` чи `BlogPost`, які підписуються на `DataSource`. В якості одного з аргументів функція буде приймати дочірній компонент, який отримає дані з підписки у якості власного prop. Назвемо цю функцію `withSubscription`:

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

Перший параметр це обгорнутий компонент, а другий — функція, що отримує `DataSource` та пропси, і вилучає потрібні нам дані.

Коли `CommentListWithSubscription` і `BlogPostWithSubscription` відображаються, у `CommentList` і `BlogPost` буде переданий параметр `data` у якості prop з найактуальнішими даними, отриманими від `DataSource`:

```js
// Ця функція отримує компонент ...
function withSubscription(WrappedComponent, selectData) {
  // ... та повертає інший компонент ...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... тут відбувається підписка ...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... та відображується обгорнутий компонент зі свіжими даними!
      // Зверніть увагу, що ми передаємо усі пропси
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

Зверніть увагу на те, що КВП не модифікує отриманий компонент та не наслідує його поведінку. Швидше, КВП створює *композицію*, *обгортаючи* оригінальний компонент у контейнер. КВП є чистою функцією без побічних ефектів.

От і все! Обгорнутий компонент отримує всі props, що були передані до контейнера, разом з новим prop — `data`, який він використовує для відображення UI. Для компонента вищого порядку не має значення, як саме дані будуть використані, а для обгорнутого компонента не має значення, звідки вони з'явились.

Оскільки `withSubscription` це звичайна функція, ви вільні додати стільки аргументів, скільки забажаєте. Наприклад, ви можете зробити ім’я параметру `data` конфігуруємим, щоб додатково ізолювати КВП від обгорнутого компонента. Або ви можете прийняти аргумент, що налаштує `shouldComponentUpdate` чи джерело даних. Це все можливо тому, що КВП має повний контроль над тим, як компонент буде визначений.

Як і між звичайними компонентами, взаємодія між `withSubscription` і обгорнутим компонентом здійснюється лише за допомогою props. Це дозволяє легко замінити один КВП на інший, якщо вони забезпечують однакові props для обгорнутого компонента. Це може бути корисним, наприклад, якщо ви зміните бібліотеки для отримання даних.

## Не мутуйте обгорнутий компонент. Використовуйте композицію. {#dont-mutate-the-original-component-use-composition}

Втримайтеся від бажання змінити прототип компонента (чи мутувати його) всередині КВП.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps = function(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  };
  // Якщо ми повертаємо лише той самий отриманий компонент - це натяк, що він був мутований
  return InputComponent;
}

// EnhancedComponent буде щоразу друкувати в консоль, коли отримає новий prop
const EnhancedComponent = logProps(InputComponent);
```

З цим пов'язано кілька проблем. Одна полягає у тому, що `InputComponent` не може бути використаний знову окремо від `EnhancedComponent`. Більш важливо, якщо ви застосуєте інший КВП до `EnhancedComponent`, який, наприклад, у свою чергу мутує `componentWillReceiveProps`, функціональність першого КВП буде перезаписана! Цей КВП також не буде працювати з функціональними компонентами, які не мають методів життєвого циклу.

Мутуючий КВП є крихкою абстракцією — споживач повинен знати, як вони реалізуються, щоб уникнути конфліктів з іншими КВП.

Замість мутації, КВП мають реалізовувати композицію, обгортаючи переданий компонент у контейнер:

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // Обгорайте переданий компонент у контейнер, не мутуючи його!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

Цей КВП має таку ж функціональність, як і мутована версія, уникаючи при цьому можливих проблем. Він однаково добре працює з класовими та функціональними компонентами. А тому, що це чиста функція, вона може бути поєднана з іншим КВП, або навіть сама з собою.

Можливо, ви вже помітили схожість між КВП та патерном, що називається компонент-контейнер. Нагадаємо, що **компонент-контейнер** є частиною політики відокремлення відповідальності між високорівневими та низькорівневими задачами. Контейнери керують такими речами, як підписка на зовнішні ресурси та внутрішній стан, та передають props у компоненти, що у свою чергу відповідають за відображення UI. КВП використовують контейнери, як частину власної реалізації. Ви можете вважати КВП параметризованим визначенням компонента-контейнера.

## Угода: передавайте сторонні props обгорненому компоненту {#convention-pass-unrelated-props-through-to-the-wrapped-component}

КВП додає компоненту функціональність. Він не повинен змінювати його початкове призначення. Очікується, що повернений КВП компонент буде мати інтерфейс аналогічний обгорнутому.

КВП повинні передавати ті props, що не пов'язані з їх функціональністю, у незмінному стані. Більшість компонентів вищого порядку мають рендер-метод, схожий на цей:

```js
render() {
  // Відфільтруйте зайві props, що характерні для КВП та не мають потрапити до компонента
  const { extraProp, ...passThroughProps } = this.props;

  // Створіть ін’єкцію для обгорнутого компонента.
  // Зазвичай це значення стану або методи екземпляра
  const injectedProp = someStateOrInstanceMethod;

  // Передайте props до обгорнутого компонента
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

Ця угода допомагає забезпечити максимальну гнучкість та можливість повторного використання КВП.

## Угода: максимізація композиційності {#convention-maximizing-composability}

Не всі КВП виглядають однаково. Іноді вони приймають лише один аргумент — компонент, що буде обгорнений:

```js
const NavbarWithRouter = withRouter(Navbar);
```

Зазвичай КВП приймає додаткові аргументи. У цьому прикладі з Relay об’єкт конфігурації використовується для визначення залежностей даних компонента:

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

Найбільш поширений спосіб виклику КВП виглядає так:

```js
// Функція `connect` у React та Redux
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

*Що?!* Якщо розділити це на частини, то легше буде побачити, що відбувається.

```js
// `connect` це функція, що повертає іншу функцію
const enhance = connect(commentListSelector, commentListActions);
// Повернена функція є КВП, який поверне компонент підключенний до Redux стору
const ConnectedComment = enhance(CommentList);
```

Іншими словами, `connect` - це функція вищого порядку, яка повертає компонент вищого порядку!

Ця форма може здатися заплутаною або непотрібною, але вона має корисну властивість. Одноаргументні КВП, як і той, який повертається функцією `connect`, мають сигнатуру `Component => Component`. Функції, з однаковим типом результату та єдиного аргументу, легко поєднуються у композицію.

```js
// Замість цього ...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... ви можете використати композиційну функцію
// compose(f, g, h) теж саме, що (...args) => f(g(h(...args)))
const enhance = compose(
  // Обидва параметра є КВП та приймають лише один аргумент
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(Саме ця властивість дозволяє використовувати `connect` та інші поширюючи функціональність КВП у якості експериментальних JavaScript декораторів.)

Ви можете знайти допоміжну функцію `compose` у багатьох сторонніх бібліотеках, включаючи lodash (під назвою [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](https://redux.js.org/api/compose) та [Ramda](https://ramdajs.com/docs/#compose).

## Угода: повертайте ім’я обгорнутого компонента для легшого дебагу {#convention-wrap-the-display-name-for-easy-debugging}

Створений КВП компонент-контейнер відображається в [React Developer Tools](https://github.com/facebook/react-devtools), як і будь-який інший компонент. Для того, щоб полегшити процес налагодження, визначте відображуване ім’я, яке повідомляє, що це результат КВП.

Найпоширеніший прийом - обгортати відображуване ім’я загорнутого компонента. Отже, якщо ваш компонент вищого порядку названий `withSubscription`, а відображене ім’я загорнутого компонента - `CommentList`, визначте відображуване ім'я як `WithSubscription(CommentList)`:

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```


## Застереження {#caveats}

Якщо ви лише починаєте використовувати React, то варто зазначити, що компоненти вищого порядку можуть стати причиною неочевидних проблем.

### Не використовуйте КВП у середині рендер-методів {#dont-use-hocs-inside-the-render-method}

Алгоритм порівняння React, що відомий як reconciliation (або узгодження), використовує перевірку на тотожність компонента, щоб визначити, чи слід оновити існуюче піддерево компонентів або слід знищити його та змонтувати нове. Якщо компонент, що був повернений рендер-методом, ідентичний (`===`) попередньому результату, React рекурсивно оновлює піддерева, порівнюючи його з новим. Якщо вони не тотожні, то попереднє піддерево буде повністю розмонтовано.

Зазвичай Вам не потрібно думати про це. Однак, це важливо для компонента вищого порядку, оскільки це означає, що ви не можете застосувати КВП до компонента в рендер-методі іншого компонента:

```js
render() {
  // Під час кожного виклику рендер-методу створюється новий екземпляр EnhancedComponent
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // Це призводить до того, що все піддерево щоразу перераховується!
  return <EnhancedComponent />;
}
```

Проблема тут полягає не лише в продуктивності — повторне перерахування компонента втрачає стан цього компонента та всіх його потомків.

Замість цього застосовуйте КВП за межами визначення компонента, щоб отриманий компонент був створений лише один раз. У цьому випадку React буде порівнювати один і той же компонент при повторному виклику рендер-метода.

У тих рідкісних випадках, коли вам потрібно динамічно застосовувати КВП, ви можете зробити це в методах життєвого циклу компонента або в його конструкторі.


### Копіюйте статичні методи {#static-methods-must-be-copied-over}

Іноді буває корисно визначити статичні методи компонента. Наприклад, статичний метод `getFragment` у бібліотеці Relay дає можливість визначити композицію з фрагментів даних GraphQL.

Якщо ви застосовуєте КВП, то обгортаєте оригінальний компонент контейнером. Це означає, що новий компонент не матиме статичних методів оригінального компонента.

```js
// Визначте статичний метод
WrappedComponent.staticMethod = function() {/*...*/}
// Тепер застосуйте КВП
const EnhancedComponent = enhance(WrappedComponent);

// EnhancedComponent не має статичного методу
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

Вам необхідно скопіювати методи до того, як повернути новий компонент, щоб вирішити цю проблему:

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Потрібно точно знати, який метод(и) скопіювати :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

На жаль для цього необхідно точно знати, які методи потрібно скопіювати. Для автоматичного копіювання всіх статичних методів ви можете використати [`hoist-non-react-statics`](https://github.com/mridgway/hoist-non-react-statics):

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

Ще одне можливе рішення — експортувати статичні методи окремо від компонента.

```js
// Замість цього ...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ... експортуйте метод окремо ...
export { someFunction };

// ... в модулі-споживачі ми можемо імпортувати обидва
import MyComponent, { someFunction } from './MyComponent.js';
```

### Refs не передаються {#refs-arent-passed-through}

Попри те, що попередня конвенція наполягає на тому, щоб передавати всі props до обгорнутого компонента, це не стосується refs. Річ у тому, що `ref` насправді не є prop, як, наприклад, `key`, тому інакше оброблюється React. Якщо ви додасте `ref` до компонента, що був повернений КВП, він буде вказувати на екземпляр зовнішнього контейнера, а не на обгорнутий компонент.

Розв’язання цієї проблеми є використання API `React.forwardRef` (введений з React 16.3). [Дізнайтеся більше про це в розділі Переадресація рефів](/docs/forwarding-refs.html).
