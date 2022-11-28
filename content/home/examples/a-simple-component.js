class HelloMessage extends React.Component {
  render() {
<<<<<<< HEAD
    return (
      <div>
        Привіт, {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Петро" />,
  document.getElementById('hello-example'),
);
=======
    return <div>Hello {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Taylor" />);
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b
