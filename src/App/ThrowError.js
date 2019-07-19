import React from 'react';
import NotefulContext from '../NotefulContext';

class ThrowError extends React.Component {
    /* constructor(props) {
      super(props);
      this.state = { counter: 0 };
    }
    
    handleClick = () => {
        
      this.setState(({counter}) => ({
        counter: counter + 1
      }));
    } */

    static contextType = NotefulContext;

    updateContextErr(e) {
      let value = e.target;

        /* const toggle = this.context.toggle;
        this.context.toggleErrors(!toggle);
        throw new Error; */
    }

    render() {

      /* if (this.state.counter === 1) {
        // Simulate a JS error
        throw new Error();
      } */
      return (
      <div>
          <button onClick={(e) => this.updateContextErr(e)}>Toggle</button>
          <p>click button to toggle errors when clicking <br/>
          the add folder or note</p>
      </div>
      );
    }
  }

  export default ThrowError