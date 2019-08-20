function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      // highlight-next-line
      const {forwardedRef, ...rest} = this.props;

      // Передаємо в якості рефа проп "forwardedRef"
      // highlight-next-line
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // Зауважте, другий параметр "ref" переданий від React.forwardRef.
  // Ми можемо передати його в LogProps, як звичайний проп, напр.: "forwardedRef",
  // а потім прив'язати його до компоненту.
  // highlight-range{1-3}
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
