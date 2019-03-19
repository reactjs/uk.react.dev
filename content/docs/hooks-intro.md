---
id: hooks-intro
title: Ознайомлення з Хуками
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Хуки* - це нововведення у React 16.8. Вони дають можливість використовувати стан та інші особливості React без створення класу.

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Створюємо нову змінну стану, яку назвемо "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Ви натиснули {count} разів</p>
      <button onClick={() => setCount(count + 1)}>
        Нитисни мене
      </button>
    </div>
  );
}
```

Нова функція `useState` є першим "Хуком", про який ми дізнаємося більше. Але цкй приклад є лише тизером. Не хвилюйтеся якщо вам поки-що нічого не зрозуміло!

**You can start learning Hooks [on the next page](/docs/hooks-overview.html).** On this page, we'll continue by explaining why we're adding Hooks to React and how they can help you write great applications.
**Почати вивчати хуки можна [на наступній сторінці](/docs/hooks-overview.html).** А на цій ми продовжимо пояснювати чому саме ми додаємо Хуки до React та як вони можуть допомогти у написанні класних застосунків.

>Примітка
>
>React 16.8.0 є першим релізом, який підтримує Хуки. При оновленні не забудьте оновити всі пакунки, включаючи React DOM. React Native підтримуватиме Хуки в наступній стабільній версії.

## Відео ознайомлення {#video-introduction}

На React Conf 2018, Sophie Alpert та Dan Abramov презентували Хуки разом з Ryan Florence, який показував як можна переписати застосунок, використавши Хуки. Дивіться відео тут:

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## Без змін існуючого коду {#no-breaking-changes}

Перед тим як ми продовжимо, зверніть увагу що Хуки:

* **Повністю опційні.** Можна спробувати Хуки в декількох компонентах без переписування будь-якого існуючого коду. Немає нагальної потреби у вивченні чи використанні Хуків якщо вам цього не хочеться.
* **100% зворотна сумісність.** Хуки не містять змін, що потребують переписання існуючого коду.
* **Доступні вже зараз.** Хуки вже доступні разом з релізом v16.8.0.

**Ми не маємо планів видаляти класи із React.** Почитати про поступову стратегію впроваження Хуків можна у [нижній частині](#gradual-adoption-strategy) цієї сторінки.

**Хуки не замінюють ваші знання концепцій React** Хуки ж навпаки впроваджуть більш прямі API до концепцій React які ви вже знаєте: пропси, стан, контекст, рефи та життєві цикли. Ми пізніше покажемо вам як Хуки cтворюють новий спосіб комбінацїй цих концепцій.

**Якщо вам лише кортить спробувати Хуки, просимо [перейти на наступну сторінку!](/docs/hooks-overview.html)** Також ви можете залишитися щоб дізнатися більше про те, чоми ми додаємо хуки та як ми збираємося їх використовувати без переписання наших застосунків.

## Що нас спонувало {#motivation}

Хуки вирішують великий діапазон скоріш за все непоєднаних проблем в Реакті, на які ми натрапили при написанні та підтриманні десятків тисяч компонентів протягом пʼяти років. Неважливо чи ви тільки вичаєте React, чи використовуєте його щодня, чи навіть віддаєте перевагу іншій бібліотеці зі схожою системою компонентів, можливо ви впізнаєте деякі з цих проблем.

### Перевикористати логіку із відслідкуванням стану між компонентами вкрай важко{#its-hard-to-reuse-stateful-logic-between-components}

React не має можливості "прикріпити" до компонента поведінки, яку можна перевикористати (наприклад підключення до стору). Якщо ви вже доволі давно працюєте із Реактом, то скоріше за все ви знайомі із такими петернами, як [рендер-пропи](/docs/render-props.html) [та компоненти вищого рівня](/docs/higher-order-components.html), що мають на меті вирішити цю проблему. Але при використанні цих патернів, розробник вимушений реструктурувати компоненти, через що код стає заплутаним та його важче розуміти. Якщо поглянути у Реакт ДевТулс на типовий застосунок написаний на Реакт, з великою імовірністю ви побачите таку ситуацію, коли компонети обгорнуті у шари провайдерів, споживачів, компонентів вищого порядку, рендер-пропів та інших абстракцій, які ми назвемо "обгорткове пекло". Незважаючи на те що можливо [їх відфільтрувати у ДевТулс](https://github.com/facebook/react-devtools/pull/503), стає логічно що існує глибинна проблема в Реакт - це кращий спосіб повторного використання логіки із відслідкуванням стану.

Викорисовуючи Хуки можливо витягнути логіку з компоненту, що відслідковує стан таким чином, щоб забезпечити її самостійне тестування та перевикористання. **З Хуками зʼявляється можливість перевикористання логіки з відслідкуванням стану без зміни ієрархії ваших компонентів.** Через це стає легко ділитися Хуками поміж іншими компонентами чи зі спільнотою.

Поговоримо про це більше у [Написанні власних Хуків](/docs/hooks-custom.html).

### Складні компоненти стає важко розуміти {#complex-components-become-hard-to-understand}

Нам часто доводилося підтримувати компонети, що були простими на початку, але переросли у щось вкрай неконтрольоване із купою побічних ефектів та логіки із відслідкуванням станів. Кожен життєвий цикл часто містить мікс не повʼязаної між собою логіки. Наприклад, можливо у компоненті виконується завантаження даних у `componentDidMount` та `componentDidUpdate`. При цьому у цьому самому `componentDidMount` методі може міститися якась не повʼязана логіка, що реєструє обробники подій, та виконує очистку у `componentWillUnmount`. Взаємно повʼязаний код, що спільно змінюється розбивається на шматки, але ті його частини, що є зовсім не повʼязані між собою опиняються звʼязаними у олному методі. І це призводить до виникнення помилок та невідповідностей.

Розбити ці компонент на менші в більшості випадків просто неможливо через обширну присутність логіки із відслідкуванням станів. Також важко їх тестувати. Це і є однією із причин чому багато людей віддають перевагу додаванню сторонніх бібліотек для керування станом у Реакті. Однак часто це призводить до інтенсивної абстракції, що призводить до ще важчого перевикористання компонентів та змушує вас перемикатися між різними файлами.

**З Хуками можна розділити один компонент на менші функції базуючись на їхньому спільному призначенні, до прикладу хай то буде встановлення підписки чи завантаження даних**. Що є відмінним від примусового розчеплення з використанням методів життєвих циклів. Ви також маєте можливість використовувати редʼюсер для керуванням локального стану компоненту, що робить його більш передбачуваним.

Поговоримо про це більше у [Використанні Хуку Ефекту](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns).

### Classes confuse both people and machines {#classes-confuse-both-people-and-machines}

In addition to making code reuse and code organization more difficult, we've found that classes can be a large barrier to learning React. You have to understand how `this` works in JavaScript, which is very different from how it works in most languages. You have to remember to bind the event handlers. Without unstable [syntax proposals](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/), the code is very verbose. People can understand props, state, and top-down data flow perfectly well but still struggle with classes. The distinction between function and class components in React and when to use each one leads to disagreements even between experienced React developers.

Additionally, React has been out for about five years, and we want to make sure it stays relevant in the next five years. As [Svelte](https://svelte.technology/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), and others show, [ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) of components has a lot of future potential. Especially if it's not limited to templates. Recently, we've been experimenting with [component folding](https://github.com/facebook/react/issues/7323) using [Prepack](https://prepack.io/), and we've seen promising early results. However, we found that class components can encourage unintentional patterns that make these optimizations fall back to a slower path. Classes present issues for today's tools, too. For example, classes don't minify very well, and they make hot reloading flaky and unreliable. We want to present an API that makes it more likely for code to stay on the optimizable path.

To solve these problems, **Hooks let you use more of React's features without classes.** Conceptually, React components have always been closer to functions. Hooks embrace functions, but without sacrificing the practical spirit of React. Hooks provide access to imperative escape hatches and don't require you to learn complex functional or reactive programming techniques.

>Examples
>
>[Hooks at a Glance](/docs/hooks-overview.html) is a good place to start learning Hooks.

## Gradual Adoption Strategy {#gradual-adoption-strategy}

>**TLDR: There are no plans to remove classes from React.**

We know that React developers are focused on shipping products and don't have time to look into every new API that's being released. Hooks are very new, and it might be better to wait for more examples and tutorials before considering learning or adopting them.

We also understand that the bar for adding a new primitive to React is extremely high. For curious readers, we have prepared a [detailed RFC](https://github.com/reactjs/rfcs/pull/68) that dives into motivation with more details, and provides extra perspective on the specific design decisions and related prior art.

**Crucially, Hooks work side-by-side with existing code so you can adopt them gradually.** There is no rush to migrate to Hooks. We recommend avoiding any "big rewrites", especially for existing, complex class components. It takes a bit of a mindshift to start "thinking in Hooks". In our experience, it's best to practice using Hooks in new and non-critical components first, and ensure that everybody on your team feels comfortable with them. After you give Hooks a try, please feel free to [send us feedback](https://github.com/facebook/react/issues/new), positive or negative.

We intend for Hooks to cover all existing use cases for classes, but **we will keep supporting class components for the foreseeable future.** At Facebook, we have tens of thousands of components written as classes, and we have absolutely no plans to rewrite them. Instead, we are starting to use Hooks in the new code side by side with classes.

## Frequently Asked Questions {#frequently-asked-questions}

We've prepared a [Hooks FAQ page](/docs/hooks-faq.html) that answers the most common questions about Hooks.

## Next Steps {#next-steps}

By the end of this page, you should have a rough idea of what problems Hooks are solving, but many details are probably unclear. Don't worry! **Let's now go to [the next page](/docs/hooks-overview.html) where we start learning about Hooks by example.**
