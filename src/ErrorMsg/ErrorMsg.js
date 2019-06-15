import React from 'react';

// this function is only here to demonstrate 
// conditional rendering for input errors
export default function ErrMsg(props) {

    return (
        <p classname="input__errmessage">
            {props.validationMessages}
        </p>
    )
}

ErrMsg.defaultProps = {
    validationMessages: 'Title is required.'
}