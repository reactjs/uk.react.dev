// highlight-range{1-2}
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// Тепер ви можете отримати реф беспосередньо на DOM button
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
