---
title: Розуміння вашого UI як дерева
---

<Intro>

React-застосунок формується великою кількістю компонентів, які вкладені один в одного. Як React відстежує структуру компонентів у вашому застосунку?

Інтерфейс користувача (_далі_ — UI) моделюється у вигляді дерева у React і багатьох інших UI-бібліотеках. Думати про ваш застосунок як про дерево — корисно, щоб розуміти зв'язки між компонентами. Це розуміння допоможе вам далі у налагодженні певних моментів як продуктивність та управління станом.

</Intro>

<YouWillLearn>

* Як React "бачить" структури компонентів
* Що таке дерево рендерингу і чим воно корисне
* Що таке дерево залежностей модулів і чим воно корисне

</YouWillLearn>

## Ваш UI у вигляді дерева {/*your-ui-as-a-tree*/}

Дерева є моделлю зв'язків між елементами, і UI часто представлений за допомогою деревоподібних структур. Наприклад, браузери використовують деревоподібні структури для моделювання HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) та CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Мобільні платформи також використовують дерева для представлення своєї ієрархії "екранів".

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Діаграма із трьох секцій, розташованих горизонтально. У першій секції розташовані вертикально три прямокутники з написами 'Component A', 'Component B' та 'Component C'. Перехід до наступної секції здійснюється за допомогою стрілки з логотипом React над нею та підписом 'React'. Середня секція містить дерево компонентів: корінь, підписаний як 'A', і його двоє дітей, підписані як 'B' і 'C'. Перехід до наступної секції також здійснюється за допомогою стрілки з логотипом React над нею та підписом 'React DOM'. Третя і остання секція — це ескіз браузера, що містить дерево з 8 вузлами, в якому виділено кольором лише піддерево (що вказує на піддерево з середнього розділу).">

React створює дерево UI із ваших компонентів. У цьому прикладі дерево UI потім використовується для рендерингу у DOM.
</Diagram>

Подібно до браузерів і мобільних платформ, React також використовує деревоподібні структури для управління та моделювання зв'язків між компонентами у React-застосунку. Ці дерева є корисними інструментами для розуміння того, як дані рухаються через React-застосунок і як оптимізувати рендеринг та розмір застосунку.

## Дерево рендерингу {/*the-render-tree*/}

Основна функція компонентів полягає у можливості створення компонентів з інших компонентів. Коли ми [вкладаємо компоненти](/learn/your-first-component#nesting-and-organizing-components), у нас з'являється концепція батьківських і дочірніх компонентів, де кожен батьківський компонент сам може бути дочірнім компонентом іншого компонента.

Коли ми рендеримо React-застосунок, ми можемо моделювати ці зв'язки у вигляді дерева, яке називається деревом рендерингу.

Ось застосунок React, який рендерить цитати, що надихають.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Застосунок 'Натхнення'" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

  return (
    <>
      <p>Цитата, що тебе надихає:</p>
      <FancyText text={quote} />
      <button onClick={next}>Надихнутися знову</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/quotes.js
export default [
  "Не дозволяйте вчорашньому займати занадто багато сьогодення.” — Вільям Роджерс (Will Rogers)",
  "Амбіція — це ставити драбину до неба.",
  "Поділена радість — подвійна радість, поділене горе — вже тільки півгоря.",
  ];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

<Diagram name="render_tree" height={250} width={500} alt="Граф дерева з п'ятьма вузлами. Кожен вузол відповідає компоненту. Корінь дерева — це App, він має дві стрілки, які ведуть до 'InspirationGenerator' та 'FancyText'. Стрілки позначені словом 'renders'. Вузол 'InspirationGenerator' також має дві стрілки, що вказують на вузли 'FancyText' та 'Copyright'.">

React створює *дерево рендерингу* — дерево UI, складене з відрендерених компонентів.


</Diagram>

З прикладу застосунку ми можемо побудувати вищеописане дерево рендерингу.

Дерево складається з вузлів, кожен з яких відповідає певному компоненту. `App`, `FancyText`, `Copyright` — це приклади кількох вузлів у нашому дереві.

Кореневий вузол у дереві рендерингу React — це [кореневий компонент](/learn/importing-and-exporting-components#the-root-component-file) застосунку. У цьому прикладі кореневим компонентом є `App`, і це перший компонент, який React рендерить. Кожна стрілка у дереві напрямлена від батьківського до дочірнього компонента.

<DeepDive>

#### Де у дереві рендерингу HTML-теги? {/*where-are-the-html-elements-in-the-render-tree*/}

У наведеному вище дереві рендерингу не згадуються HTML-теги, які кожен компонент рендерить. Це тому, що дерево рендерингу складається лише з [компонентів](learn/your-first-component#components-ui-building-blocks) React.

React як UI-фреймворк є платформонезалежним. На сайті uk.react.dev ми демонструємо приклади, які рендеряться для вебу, що використовує HTML-розмітку як свої UI-примітиви. Але React-застосунок може так само рендеритися для мобільної або стаціонарної платформи, що може використовувати інші UI-примітиви, як-от [UIView](https://developer.apple.com/documentation/uikit/uiview) або [FrameworkElement](https://learn.microsoft.com/uk-ua/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

Ці платформові UI-примітиви не є частиною React. Дерева рендерингу React можуть надавати інформацію про наш React-застосунок незалежно від того, для якої платформи він рендериться.

</DeepDive>

Дерево рендерингу відповідає одному проходу рендеру React-застосунку. За допомогою [умовного рендерингу](/learn/conditional-rendering) батьківський компонент може відображати різних дітей залежно від переданих даних.

Ми можемо оновити застосунок, щоб умовно відрендерити або цитату, або колір, що надихає.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Застосунок 'Натхнення'" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>{inspiration.type}, що тебе надихає:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Надихнутися знову</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  {type: 'quote', value: "Не дозволяйте вчорашньому займати занадто багато сьогодення.” — Вільям Роджерс (Will Rogers)"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Амбіція — це ставити драбину до неба."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "Поділена радість — подвійна радість, поділене горе — вже тільки півгоря."},
  {type: 'color', value: "#F9F2B4"},
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="Граф дерева із шістьма вузлами. Кореневий вузол дерева позначений як 'App' і має дві стрілки, що ведуть до вузлів, позначених як 'InspirationGenerator' та 'FancyText'. Стрілки мають тверді лінії і позначені словом 'renders'. Вузол 'InspirationGenerator' також має три стрілки. Стрілки до вузлів 'FancyText' і 'Color' пунктирні і позначені як 'renders?'. Остання стрілка вказує на вузол, позначений як 'Copyright', і є твердою та позначена словом 'renders'.">

За допомогою умовного рендерингу, посеред різних рендерів, дерево рендерингу може рендерити різні компоненти.

</Diagram>

У цьому прикладі залежно від того, що є `inspiration.type`, ми можемо відрендерити або `<FancyText>`, або `<Color>`. Дерево рендерингу може бути різним для кожного проходу рендеру.

Хоча дерева рендерингу можуть відрізнятися між різними проходами рендеру, вони загалом корисні для ідентифікації *внутрішніх* (top-level) та *зовнішніх* (leaf) компонентів у React-застосунку. Внутрішні компоненти — це компоненти, ближчі до кореневого компонента, які впливають на продуктивність рендерингу всіх компонентів під ними і часто є найбільш складними. Зовнішні компоненти, або листи, знаходяться в нижній частині дерева і не мають дочірніх компонентів та часто піддаються повторному рендерингу.

Ідентифікація цих категорій компонентів корисна для розуміння потоку даних (data flow) та продуктивності вашого застосунку.

## Дерево залежностей модуля {/*the-module-dependency-tree*/}

Ще одним типом зв'язків у React-застосунку, що можуть бути змодельовані за допомогою дерева, є залежності модулів застосунку. Коли ми [виносимо наші компоненти](/learn/importing-and-exporting-components#exporting-and-importing-a-component) та логіку в окремі файли, ми створюємо [JS-модулі](https://webdoky.org/uk/docs/Web/JavaScript/Guide/Modules), з яких можна експортувати компоненти, функції або константи.

Кожен вузол у дереві залежностей модулів — це модуль, а кожна гілка відповідає оператору `import` у цьому модулі.

Якщо ми візьмемо попередній застосунок "Натхнення", ми можемо побудувати дерево залежностей модулів, або скорочено — дерево залежностей.

<Diagram name="module_dependency_tree" height={250} width={658} alt="Граф дерева із сімома вузлами. Кожен вузол позначений назвою модуля. Кореневий вузол дерева позначений як 'App.js'. Від нього виходять три стрілки до модулів 'InspirationGenerator.js', 'FancyText.js' та 'Copyright.js', і ці стрілки позначені словом 'imports'. Від вузла 'InspirationGenerator.js' відходять три стрілки до трьох модулів: 'FancyText.js', 'Color.js' та 'inspirations.js'. Ці стрілки позначені словом 'imports'.">

Дерево залежностей модулів для застосунку "Натхнення".

</Diagram>

Кореневий вузол дерева — це кореневий модуль, відомий також як файл точки входу. Зазвичай це модуль, який містить кореневий компонент.

Порівнюючи з деревом рендерингу цього ж застосунку, бачимо схожі структури з деякими ключовими відмінностями:

* Вузли, які утворюють дерево, відповідають модулям, а не компонентам.
* Модулі, що не містять компонентів, як-от `inspirations.js`, також є у цьому дереві. Дерево рендерингу охоплює лише компоненти.
* `Copyright.js` розташований безпосередньо під `App.js`, але в дереві рендерингу компонент `Copyright` з'являється як дочірній елемент `InspirationGenerator`. Це тому, що `InspirationGenerator` приймає JSX як [проп children](/learn/passing-props-to-a-component#passing-jsx-as-children), тому він рендерить `Copyright` як дочірній компонент, а не імпортує модуль.

Дерева залежностей корисні для визначення, які модулі необхідні для запуску вашого React-застосунку. Під час побудови готового до впровадження React-застосунку зазвичай є етап, який запакує (bundle) весь необхідний JavaScript-код для доставлення клієнту. Інструмент, що за це відповідає, називається [бандлер](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem), і бандлери використовують дерево залежностей для визначення, які модулі повинно бути включено.

Відповідно до того, як зростає ваш застосунок, збільшується і розмір запакованого застосунку — бандлу. Великі розміри бандлів є "дорогими" для завантаження та виконання клієнтом. Великі розміри бандлів можуть затримувати час відображення вашого UI. Розуміння дерева залежностей вашого застосунку може допомогти з налагодженням цих проблем.

[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* Дерева — це поширений спосіб представлення зв'язків між сутностями. Часто вони використовуються для моделювання UI.
* Дерева рендерингу відображають вкладені зв'язки між компонентами React у межах одного рендеру.
* З умовним рендерингом дерево рендерингу може змінюватися між різними рендерами. Залежно від різних значень пропсів компоненти можуть рендерити різні дочірні компоненти.
* Дерева рендерингу допомагають ідентифікувати, які компоненти є внутрішніми, а які — зовнішніми (листи). Внутрішні компоненти впливають на продуктивність рендерингу всіх компонентів-нащадків, а компоненти-листи часто піддаються повторному рендерингу. Їх ідентифікація корисна для розуміння та налагодження продуктивності рендерингу.
* Дерева залежностей відображають залежності модулів у React-застосунку.
* Дерева залежностей використовуються бандлерами, щоб запакувати необхідний код для доставлення застосунку.
* Дерева залежностей корисні для налагодження великих розмірів бандлів, які збільшують час до появи першого вмісту та показують можливі оптимізації відносно того, який код додається до бандлу.

</Recap>

[TODO]: <> (Add challenges)
