---
id: getting-started
title: Початок роботи
permalink: docs/getting-started.html
next: add-react-to-a-website.html
redirect_from:
  - "docs/"
  - "docs/index.html"
  - "docs/getting-started-ko-KR.html"
  - "docs/getting-started-zh-CN.html"
  - "docs/installation.html"
  - "download.html"
  - "downloads.html"
  - "docs/try-react.html"
  - "docs/tooling-integration.html"
  - "docs/package-management.html"
  - "docs/language-tooling.html"
  - "docs/environments.html"
---

В даному розділі ми оглянемо документацію React та пов'язані з ним ресурси.

**React** -- це JavaScript-бібліотека для створення інтерфейсу користувачів. Відвідайте [нашу головну сторінка](/) або [вступ](/tutorial/tutorial.html), аби скласти враження про React.

---

- [Спробуємо React](#try-react)
- [Вивчаємо React](#learn-react)
- [Новини про нові релізи](#staying-informed)
- [Документація старих версій React](#versioned-documentation)
- [Зворотній зв'язок](#something-missing)

## Спробуємо React {#try-react}

З самого початку React був спроектований для поступового вбудовування і **ви можете використати ту частину React, яка вам потрібна.** Посилання в цьому розілі допоможуть вам дізнатися як познайомитися з React, додати трохи "інтерактивності" до простої HTML-сторінки, або почати розробку складних React-додатків.

### Онлайн-пісочниці {#online-playgrounds}

Хочете погратися з React? Тоді ви можете використати онлайн-пісочниці. Спробуйте початковий шаблон на [CodePen](codepen://hello-world), [CodeSandbox](https://codesandbox.io/s/new) або [Glitch](https://glitch.com/edit/#!/remix/starter-react-template).

Віддаєте перевагу вашому редактору коду? Тоді ви можете [завантажити даний HTML-файл](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html), відредагувати та відкрити його в вашому браузері. Даний шаблон під час запуску проводить трансформацію JSX в JavaScript. Однак, воно є повільним, тому ми рекомендуємо використовувати даний файл тільки для простих демонстраційних прикладів.

### Додаємо React до сайту {#add-react-to-a-website}

Ви можете [додати React до HTML-сторінки лише за хвилину](/docs/add-react-to-a-website.html). За бажанням, ви зможете потім поступово поширювати React на сайті або залишити в декількох динамічних віджетах.

### Створюємо простий React-додаток {#create-a-new-react-app}

Розпочинаючи розробку React-проекту, [проста HTML-сторінка з script-тегами](/docs/add-react-to-a-website.html) може бути найкращим варіантом. Лише хвилина потрібна для її створення!

Однак для розробки більш складного додатку вам, мабуть, потрібно буде розглянути варіант використання робочого середовища, яке містить різноманітні технології. Ось [декілька наборів JavaScript-інструментів](/docs/create-a-new-react-app.html), які ми рекомендуємо для розробки більш серйозних React-додатків. Кожен із них може використовуватись майже без зміни налаштувань, а також дають змогу розкрити весь потенціал великої React-екосистеми.

## Вивчаємо React {#learn-react}

Люди приходять до React із різним досвідом і стилем навчання. Мабуть, ви віддаєте перевагу ознайомленню з теоретичною частиною або навчанню на практиці, але ми надіємось, що для вас даний розділ був корисним.

* Віддаєте перевагу **навчанню на практиці**? Почніть з [навчального посібника](/tutorial/tutorial.html).
* Або ж **ознайомленню з теоретичною частиною**? [Ознайомтесь з головними концептами React](/docs/hello-world.html).

Можливо, React може здатися для вас трохи важким, але, доклавши трохи зусилля, ви **обов'язково вивчите його**. Терпіння і праця все перемагають.

### Перші приклади {#first-examples}

[Головна сторінка](/) містить декілька невеликих React-прикладів з можливістю їх редагування. Навіть якщо ви не знаєте нічого про React, спробуйте погратися з їх кодом, аби побачити, як впливають на результат ваші зміни.

### React для початківців {#react-for-beginners}

Якщо ви відчуваєте те, що вивчення React за допомогою цієї документації здається важким і йде не так швидко, як вам хотілось би, тоді прочитайте [цей запис блогу Тані Раша (Tania Rascia)](https://www.taniarascia.com/getting-started-with-react/). Вона описала найбільш важливі концепти React в детальному стилі, який також доступний для новачків. Як тільки ви ознайомитесь з ним, спробуйте документацію знову!

### React для дизайнерів {#react-for-designers}

Займаєтесь дизайном і хочете вивчити React? Хорошим способом для цього є [даний ресурс](https://reactfordesigners.com/).

### Ресурси по JavaScript {#javascript-resources}

The React documentation assumes some familiarity with programming in the JavaScript language. You don't have to be an expert, but it's harder to learn both React and JavaScript at the same time.

We recommend going through [this JavaScript overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) to check your knowledge level. It will take you between 30 minutes and an hour but you will feel more confident learning React.

>Tip
>
>Whenever you get confused by something in JavaScript, [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) and [javascript.info](https://javascript.info/) are great websites to check. There are also [community support forums](/community/support.html) where you can ask for help.

### Practical Tutorial {#practical-tutorial}

If you prefer to **learn by doing,** check out our [practical tutorial](/tutorial/tutorial.html). In this tutorial, we build a tic-tac-toe game in React. You might be tempted to skip it because you're not building games -- but give it a chance. The techniques you'll learn in the tutorial are fundamental to building *any* React apps, and mastering it will give you a much deeper understanding.

### Step-by-Step Guide {#step-by-step-guide}

If you prefer to **learn concepts step by step,** our [guide to main concepts](/docs/hello-world.html) is the best place to start. Every next chapter in it builds on the knowledge introduced in the previous chapters so you won't miss anything as you go along.

### Thinking in React {#thinking-in-react}

Many React users credit reading [Thinking in React](/docs/thinking-in-react.html) as the moment React finally "clicked" for them. It's probably the oldest React walkthrough but it's still just as relevant.

### Recommended Courses {#recommended-courses}

Sometimes people find third-party books and video courses more helpful than the official documentation. We maintain [a list of commonly recommended resources](/community/courses.html), some of which are free.

### Advanced Concepts {#advanced-concepts}

Once you're comfortable with the [main concepts](#main-concepts) and played with React a little bit, you might be interested in more advanced topics. This section will introduce you to the powerful, but less commonly used React features like [context](/docs/context.html) and [refs](/docs/refs-and-the-dom.html).

### API Reference {#api-reference}

This documentation section is useful when you want to learn more details about a particular React API. For example, [`React.Component` API reference](/docs/react-component.html) can provide you with details on how `setState()` works, and what different lifecycle methods are useful for.

### Glossary and FAQ {#glossary-and-faq}

The [glossary](/docs/glossary.html) contains an overview of the most common terms you'll see in the React documentation. There is also a FAQ section dedicated to short questions and answers about common topics, including [making AJAX requests](/docs/faq-ajax.html), [component state](/docs/faq-state.html), and [file structure](/docs/faq-structure.html).

## Staying Informed {#staying-informed}

The [React blog](/blog/) is the official source for the updates from the React team. Anything important, including release notes or deprecation notices, will be posted there first.

You can also follow the [@reactjs account](https://twitter.com/reactjs) on Twitter, but you won't miss anything essential if you only read the blog.

Not every React release deserves its own blog post, but you can find a detailed changelog for every release [in the `CHANGELOG.md` file in the React repository](https://github.com/facebook/react/blob/master/CHANGELOG.md), as well as on the [Releases](https://github.com/facebook/react) page.

## Versioned Documentation {#versioned-documentation}

This documentation always reflects the latest stable version of React. Since React 16, you can find older versions of the documentation [on a separate page](/versions). Note that documentation for past versions is snapshotted at the time of the release, and isn't being continuously updated.

## Something Missing? {#something-missing}

If something is missing in the documentation or if you found some part confusing, please [file an issue for the documentation repository](https://github.com/reactjs/reactjs.org/issues/new) with your suggestions for improvement, or tweet at the [@reactjs account](https://twitter.com/reactjs). We love hearing from you!
