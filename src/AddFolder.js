import React from 'react';
import NotefulContext from './NotefulContext';
import config from './config';
import PropTypes from 'prop-types';
import ErrorMsg from './ErrorMsg/ErrorMsg';

export default class AddFolder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        error: null,
        title: "",
        formValid: false,
        titleValid: false,
        validationMessages: "",
        };
        this.title = React.createRef();
    }

    static contextType = NotefulContext;
    
    goBack = () => {
        this.props.history.goBack();
    }

    updateFormEntry(e) {           
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [e.target.name]: e.target.value
        }, () => {this.validateEntry(name, value)});
    }

    validateEntry(name, value) {
        let inputErrors;
        let hasErrors = false;

        value = value.trim();
        if (value < 1) {
            inputErrors = `${name} is required.`;
        } 
        
        else {
            inputErrors = '';
            hasErrors = false;
        }
        this.setState({
            validationMessages: inputErrors,
            [`${name}Valid`]: !hasErrors,
        }, this.formValid );
    }

    formValid() {
        const { titleValid } = this.state;
        if (titleValid === true){
            this.setState({
                formValid: true
            });
        }
        else {this.setState({
            formValid: !this.formValid
            }
        )}
      }

    handleSubmit(e) {
        e.preventDefault();
        const { title, titleValid } = e.target;
        const folder = {
            name: title.value
        }
        console.log(`
            Title: ${title}\n 
            Is title valid: ${titleValid}\n`);

        this.setState({error: null})
        fetch(`${config.API_ENDPOINT}/folders`, {
            method: 'POST',
            body: JSON.stringify(folder),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => {
                    console.log(`Error is: ${error}`)
                    throw error
                })
            }
            return res.json()
        })
        .then(data => {
            this.goBack()
            this.context.addFolder(data)
        })
        .catch(error => {
            this.setState({ error })
        })
    }

    render() {
        
        return (
            <form 
                className="add__folder"
                onSubmit={e => this.handleSubmit(e)}>
                <h2>Add Folder</h2>
                <ErrorMsg
                    validationMessages={this.state.validationMessages}
                />
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input 
                    type="text" 
                    className="noteful__title"
                    name="title" 
                    id="title" 
                    aria-label="Title"
                    aria-required="true"
                    ref={this.title}
                    placeholder="Folder Title"
                    onChange={e => this.updateFormEntry(e)}/>
                </div>
                <div className="form-group">
                 <button 
                    type="button" 
                    className="cancel__button"
                    onClick={() => this.goBack()}>
                     Cancel
                 </button>
                 <button 
                    type="submit" 
                    className="save__button"
                    disabled={!this.state.formValid}>
                     Save
                 </button>
                 {}
                </div>
            </form> 
        )
    }
}


AddFolder.propType = {
    push: PropTypes.func.isRequired
};