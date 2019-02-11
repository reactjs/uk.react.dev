function tick() {
  const element = (
    <div>
<<<<<<< HEAD
<<<<<<< HEAD
      <h1>Hello, world!</h1>
=======
      <h1>Привіт, світе</h1>
>>>>>>> ef4344de... Added translation for rendering elements and code snippets
=======
      <h1>Hello, world!</h1>
>>>>>>> dc889496... fix requested changes
      <h2>Зараз {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  // highlight-next-line
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
