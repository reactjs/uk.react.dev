---
id: uncontrolled-components
title: Неконтрольовані компоненти
permalink: docs/uncontrolled-components.html
---

У більшості ситуацій, ми рекомендуємо використовувати [контрольовані компоненти](/docs/forms.html#controlled-components) для реалізації форм. У контрольованому компоненті, дані форми котролюються React-компонентом. Альтернативним підходом є використання неконтрольованих компонентів, де дані форми контрольюються самим DOM.

Замість того, щоб писати обробник подій для кожного оновлення стану, ви можете використати некотрольований компонент та отримувати значення з DOM через [реф](/docs/refs-and-the-dom.html).

Наприклад, код нижче отримує ім'я з неконтрольованого компонента:

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert("Ім'я, що було надіслано: " + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Ім'я:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Надіслати" />
      </form>
    );
  }
}
```

[**Спробувати на CodePen**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

Оскільки неконтрольовані компоненти спираються на DOM як на джерело даних, часом використання неконтрольованих компонентів дозволяє простіше інтегрувати React з кодом, що пов'язаний з React. Даний підхід може потребувати менше коду, якщо ви хочете отримати швидкий результати за рахунок "брудного" коду. Тому зазвичай ми наполягаємо на використанні контрольованих компонентів.

Якщо досі не зрозуміло, який тип компонентів використовувати в тій чи іншій ситуацій, можливо [стаття про порівняння контрольованих та неконтрольованих полів введення](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) буде для вас корисною.

### Значення за замовчуванням {#default-values}

<<<<<<< HEAD
Під час рендерингу значення атрибуту `value` на елементі форми буде переписувати значення, що визначено в DOM. При використанні неконтрольованих компонентів часом необхідно, щоб React встановив початкове значення, але надалі не контролював оновлення значення. У даному випадку необхідно встановити атрибут `defaultValue` замість `value`.
=======
In the React rendering lifecycle, the `value` attribute on form elements will override the value in the DOM. With an uncontrolled component, you often want React to specify the initial value, but leave subsequent updates uncontrolled. To handle this case, you can specify a `defaultValue` attribute instead of `value`. Changing the value of `defaultValue` attribute after a component has mounted will not cause any update of the value in the DOM.
>>>>>>> 4fab3d31469ab7a53dbf8b50cab5d57880a0c035

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Ім'я:
        <input
          defaultValue="Іван"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Надіслати" />
    </form>
  );
}
```

Аналогічно, `<input type="checkbox">` та `<input type="radio">` підтримують `defaultChecked`, `<select>` та `<textarea>` — `defaultValue`.

## Тег поля завантаження файла {#the-file-input-tag}

HTML-тег `<input type="file">` дає можливість користувачу вибрати один чи декілька файлів зі свого дискового сховища, щоб завантажити їх на сервер, або керувати ними за допомогою JavaScript через [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

У React `<input type="file" />` завжди є неконтрольованим компонентом тому, що його значення може бути встановлено тільки користувачем, а не програмним шляхом.

Для взаємодії з файлами ви маєте використувати File API. Наступний приклад демонструє як додати [реф до DOM-вузла](/docs/refs-and-the-dom.html), щоб отримати доступ до файла під час обробки відправлення форми:

`embed:uncontrolled-components/input-type-file.js`

[](codepen://uncontrolled-components/input-type-file)

