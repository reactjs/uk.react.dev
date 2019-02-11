function tick() {
  const element = (
    <div>
      <h1>Привіт, світе</h1>
      <h2>Зараз {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  // highlight-next-line
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
