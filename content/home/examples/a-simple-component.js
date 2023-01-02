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
>>>>>>> e77ba1e90338ff18f965c9b94c733b034b3ac18f
