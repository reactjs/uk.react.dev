const root = ReactDOM.createRoot(
  document.getElementById('root')
);

function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>Зараз {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  // highlight-next-line
  root.render(element);
}

setInterval(tick, 1000);
