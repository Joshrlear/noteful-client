import React from 'react';

// this function is only here to demonstrate 
// conditional rendering for input errors
export default function ErrMsg(props) {
    return (
        <p className="input__errmessage">
            {props.validationMessage}
        </p>
    )
}