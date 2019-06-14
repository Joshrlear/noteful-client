import React from 'react';
import PropTypes from 'prop-types';
import './ErrorBoundary.css'

class Back extends React.Component {
    goBack = () => {
        this.props.history.goBack();
    }

    render() {

        return (
            <button className="back_btn" onClick={this.goBack}>Back</button>
        )
    }    
}
    

export default Back

Back.propTypes = {
    goBack: PropTypes.func
}