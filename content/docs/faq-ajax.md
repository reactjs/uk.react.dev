---
id: faq-ajax
title: AJAX та запити до API
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### Як виконати AJAX-запит до сервера? {#how-can-i-make-an-ajax-call}

Ви можете використовувати вбудований в браузер метод [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), або будь-яку AJAX-бібліотеку, наприклад [Axios](https://github.com/axios/axios) чи [jQuery AJAX](https://api.jquery.com/jQuery.ajax/).

### Де в життєвому циклі компонента краще робити запит? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

Ви можете зробити AJAX-запит в [`componentDidMount`](/docs/react-component.html#mounting). Коли ви отримаєте дані, викличте `setState`, щоб передати їх компоненту.

### Приклад: Встановлюємо стан з AJAX-запиту {#example-using-ajax-results-to-set-local-state}

Компонент нижче показує, як в `componentDidMount` задати внутрішній стан з результату AJAX-запиту. 

Припустимо, наш API повертає наступний JSON-об'єкт:

```
{
  "items": [
    { "id": 1, "name": "Яблука",  "price": "$2" },
    { "id": 2, "name": "Персики", "price": "$5" }
  ] 
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Примітка: важливо обробляти помилки саме тут,
        // а не в блоці catch (), щоб не перехоплювати
        // виключення з помилок в самих компонентах.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Помилка: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Завантаження...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```
