---
id: concurrent-mode-intro
title: Introducing Concurrent Mode (Experimental)
permalink: docs/concurrent-mode-intro.html
next: concurrent-mode-suspense.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Увага:
>
>На сторінці описані **експериментальні функції, [яких ще немає](/docs/concurrent-mode-adoption.html) в стабільній версії**. Не використовуйте експериментальні збірки React в продакшн додатках. Ці функції можуть значно змінитися без попередження перед тим, як потрапити в React.
>
>Ця документація орієнтована на першопрохідців та зацікавлених користувачів. **Якщо ви новачок в React, не турбуйтеся про ці функції**, не потрібно вивчати їх прямо зараз.
</div>

На цій сторінці подано теоретичний огляд "Конкурентного Режиму". **Для більш практичного застосування ви можете ознайомитись з наступними розділами:**

* [Suspense for Data Fetching](/docs/concurrent-mode-suspense.html) describes a new mechanism for fetching data in React components.
* [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html) shows some UI patterns made possible by Concurrent Mode and Suspense.
* [Adopting Concurrent Mode](/docs/concurrent-mode-adoption.html) explains how you can try Concurrent Mode in your project.
* [Concurrent Mode API Reference](/docs/concurrent-mode-reference.html) documents the new APIs available in experimental builds.

## Що таке конкурентный режим? {#what-is-concurrent-mode}

Конкурентный режим - це набір нових функцій які допомагають React додаткам залишатися чутливими та плавно підлаштовується під можливості пристрою користувача та швидкість мережі.
Ці особливості досі експериментальні і можуть змінюватися. Вони ще не є частиною стабільної версії React, але ви можете спробувати їх в експериментальній збірці.


## Блокування проти переривання рендерингу {#blocking-vs-interruptible-rendering} 

**Щоб пояснити конкурентний режим, ми будемо використовувати керування версіями як метафору.**
Якщо ви працюєте в команді, ви, ймовірно, використовуєте систему контролю версій на зразок Git і працюєте на гілках. Коли гілка готова, ви можете злити свою роботу в master, щоб інші люди могли її витягнути.

Before version control existed, the development workflow was very different. There was no concept of branches. If you wanted to edit some files, you had to tell everyone not to touch those files until you've finished your work. You couldn't even start working on them concurrently with that person — you were literally *blocked* by them.

До того, як існував контроль версій, робочий процес розвитку був дуже різним. Там не було поняття гілок. Якщо ви хотіли відредагувати деякі файли, вам доводилося сказати всім не торкатися цих файлів, поки ви не закінчите роботу. Ви навіть не могли почати працювати над ними одночасно з цією людиною - вас вони буквально *заблокували*.

This illustrates how UI libraries, including React, typically work today. Once they start rendering an update, including creating new DOM nodes and running the code inside components, they can't interrupt this work. We'll call this approach "blocking rendering".

Це ілюструє, як типово сьогодні працюють UI бібліотеки включаючи React. Як тільки вони починають рендерить оновлення, включаючи створення нових вузлів DOM та запуск коду всередині компонентів, вони не можуть перервати цю роботу. Цей підхід ми будемо називати "блокуванням рендеренгу".

In Concurrent Mode, rendering is not blocking. It is interruptible. This improves the user experience. It also unlocks new features that weren't possible before. Before we look at concrete examples in the [next](/docs/concurrent-mode-suspense.html) [chapters](/docs/concurrent-mode-patterns.html), we'll do a high-level overview of new features.

У конкурентному режимі рендеринг не блокується. Він переривається. Це покращує зручність в користуванні. Він також розблоковує нові функції, які раніше були неможливі. Перш ніж ми розглянемо конкретні приклади в [наступних](/docs/concurrent-mode-suspense.html) [главах](/docs/concurrent-mode-patterns.html), ми зробимо загальний огляд нових функцій.


### Interruptible Rendering {#interruptible-rendering} Переривання рендерингу

Consider a filterable product list. Have you ever typed into a list filter and felt that it stutters on every key press? Some of the work to update the product list might be unavoidable, such as creating new DOM nodes or the browser performing layout. However, *when* and *how* we perform that work plays a big role.

Розглянемо список продуктів, що фільтруються. Ви коли-небудь фільтрували список та відчували, що він заїкається при кожному натисканні клавіш? Деяка робота над оновленням списку продуктів може бути неминучою, наприклад, створення нових вузлів DOM або "веб-переглядача, що виконує макет". Однак * коли * і * як * ми виконуємо цю роботу, грає велику роль.

A common way to work around the stutter is to "debounce" the input. When debouncing, we only update the list *after* the user stops typing. However, it can be frustrating that the UI doesn't update while we're typing. As an alternative, we could "throttle" the input, and update the list with a certain maximum frequency. But then on lower-powered devices we'd still end up with stutter. Both debouncing and throttling create a suboptimal user experience.

Поширений спосіб обійти заїкання - "debounce" введення. Під час дебаунсингу ми лише оновлюємо список *після* того як користувач перестає друкувати. Однак може бути неприємно, що інтерфейс користувача не оновлюється під час введення тексту. Як альтернатива, ми могли б "throttle" введення та оновити список з певною максимальною частотою. Але потім на пристроях з меншою потужністю ми все-таки почнемо затинатися. Як дебаунсинг, так і тротлинг створюють неоптимальну зручність для користувача.

The reason for the stutter is simple: once rendering begins, it can't be interrupted. So the browser can't update the text input right after the key press. No matter how good a UI library (such as React) might look on a benchmark, if it uses blocking rendering, a certain amount of work in your components will always cause stutter. And, often, there is no easy fix.

Причина затинання проста: після початку рендеринга, він не може бути перерван. Тому браузер не може оновити введення тексту відразу після натискання клавіші. Незалежно від того, наскільки добре може виглядати бібліотека користувальницького інтерфейсу (наприклад, React) на еталоні, якщо він використовує блокування візуалізації, певна кількість роботи у ваших компонентах завжди призведе до заїкання


**Concurrent Mode fixes this fundamental limitation by making rendering interruptible.** This means when the user presses another key, React doesn't need to block the browser from updating the text input. Instead, it can let the browser paint an update to the input, and then continue rendering the updated list *in memory*. When the rendering is finished, React updates the DOM, and changes are reflected on the screen.

Conceptually, you can think of this as React preparing every update "on a branch". Just like you can abandon work in branches or switch between them, React in Concurrent Mode can interrupt an ongoing update to do something more important, and then come back to what it was doing earlier. This technique might also remind you of [double buffering](https://wiki.osdev.org/Double_Buffering) in video games.

Concurrent Mode techniques reduce the need for debouncing and throttling in UI. Because rendering is interruptible, React doesn't need to artificially *delay* work to avoid stutter. It can start rendering right away, but interrupt this work when needed to keep the app responsive.

### Intentional Loading Sequences {#intentional-loading-sequences}

We've said before that Concurrent Mode is like React working "on a branch". Branches are useful not only for short-term fixes, but also for long-running features. Sometimes you might work on a feature, but it could take weeks before it's in a "good enough state" to merge into master. This side of our version control metaphor applies to rendering too.

Imagine we're navigating between two screens in an app. Sometimes, we might not have enough code and data loaded to show a "good enough" loading state to the user on the new screen. Transitioning to an empty screen or a large spinner can be a jarring experience. However, it's also common that the necessary code and data doesn't take too long to fetch. **Wouldn't it be nicer if React could stay on the old screen for a little longer, and "skip" the "bad loading state" before showing the new screen?**

While this is possible today, it can be difficult to orchestrate. In Concurrent Mode, this feature is built-in. React starts preparing the new screen in memory first — or, as our metaphor goes, "on a different branch". So React can wait before updating the DOM so that more content can load. In Concurrent Mode, we can tell React to keep showing the old screen, fully interactive, with an inline loading indicator. And when the new screen is ready, React can take us to it.

### Concurrency {#concurrency}

Let's recap the two examples above and see how Concurrent Mode unifies them. **In Concurrent Mode, React can work on several state updates *concurrently*** — just like branches let different team members work independently:

* For CPU-bound updates (such as creating DOM nodes and running component code), concurrency means that a more urgent update can "interrupt" rendering that has already started.
* For IO-bound updates (such as fetching code or data from the network), concurrency means that React can start rendering in memory even before all the data arrives, and skip showing jarring empty loading states.

Importantly, the way you *use* React is the same. Concepts like components, props, and state fundamentally work the same way. When you want to update the screen, you set the state.

React uses a heuristic to decide how "urgent" an update is, and lets you adjust it with a few lines of code so that you can achieve the desired user experience for every interaction.

## Putting Research into Production {#putting-research-into-production}

There is a common theme around Concurrent Mode features. **Its mission is to help integrate the findings from the Human-Computer Interaction research into real UIs.**

For example, research shows that displaying too many intermediate loading states when transitioning between screens makes a transition feel *slower*. This is why Concurrent Mode shows new loading states on a fixed "schedule" to avoid jarring and too frequent updates.

Similarly, we know from research that interactions like hover and text input need to be handled within a very short period of time, while clicks and page transitions can wait a little longer without feeling laggy. The different "priorities" that Concurrent Mode uses internally roughly correspond to the interaction categories in the human perception research.

Teams with a strong focus on user experience sometimes solve similar problems with one-off solutions. However, those solutions rarely survive for a long time, as they're hard to maintain. With Concurrent Mode, our goal is to bake the UI research findings into the abstraction itself, and provide idiomatic ways to use them. As a UI library, React is well-positioned to do that.

## Next Steps {#next-steps}

Now you know what Concurrent Mode is all about!

On the next pages, you'll learn more details about specific topics:

* [Suspense for Data Fetching](/docs/concurrent-mode-suspense.html) describes a new mechanism for fetching data in React components.
* [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html) shows some UI patterns made possible by Concurrent Mode and Suspense.
* [Adopting Concurrent Mode](/docs/concurrent-mode-adoption.html) explains how you can try Concurrent Mode in your project.
* [Concurrent Mode API Reference](/docs/concurrent-mode-reference.html) documents the new APIs available in experimental builds.
