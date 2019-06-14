import React from 'react';
import PropTypes from 'prop-types';
import NotefulContext from './NotefulContext';
import config from './config';

export default class AddNote extends React.Component {
    state = {
        error: null,
        title: "",
        content: "",
        formValid: false,
        titleValid: false,
        contentValid: false,
        validationMessages: ""
    }

    static contextType = NotefulContext;

    updateFormEntry(e) {
        console.log(e.target);            
        const name = e.target.name;
        const value = e.target.value;
        let id;
        if (e.target.selectedOptions) {
            id = e.target.selectedOptions[0].id;
        }
        this.setState({
            [e.target.name]: e.target.value,
            'folderId': id
        }, () => {this.validateEntry(name, value)});
    }

    validateEntry(name, value) {
        console.log(`${name}: ${value}`)
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
        const { titleValid, contentValid } = this.state;
        if (titleValid && contentValid === true){
            this.setState({
                formValid: true
            });
        }
        else {this.setState({
            formValid: !this.formValid
        })}
      }

    handleSubmit(e) {
        e.preventDefault();
        const { title, content, folderId, titleValid, contentValid } = this.state;
        const note = {
            name: title,
            content: content,
            folderId: folderId,
            modified: new Date()
        }
        console.log(`
            Title: ${title}\n 
            Content: ${content}\n 
            Folder Id: ${folderId}\n
            Is title valid: ${titleValid}\n
            Is content valid: ${contentValid}\n`);

        this.setState({error: null})

        
        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            body: JSON.stringify(note),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => {
                    console.log(`Error is: ${err}`)
                    throw err
                })
            }
            return res.json()
        })
        .then(data => {
            //note.name = ''
            //note.content = ''
            console.log(data)
            this.props.history.push('/')
            console.log('3')
            this.context.addNote(data)
            console.log('4')
        })
        .catch(err => {
            this.setState({ err })
        })
    }

    
    render() {
        console.log(this.context.error);
        const folders = this.context.folders;
        const options = folders.map((folder) => {
            return(
            <option 
                key ={folder.id} 
                id={folder.id}>
            {folder.name}
            </option>
            )
        })

        return (
            <form 
                className="add__note"
                onSubmit={e => this.handleSubmit(e)}>
                <h2>Add Note</h2>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input 
                    type="text" 
                    className="noteful__title"
                    name="title" 
                    id="title" 
                    placeholder="Note Title"
                    onChange={e => this.updateFormEntry(e)}/>
                </div>
                <div className="form-group">
                   <label htmlFor="content">Note:</label>
                   <textarea 
                        className="noteful__content"
                        name="content" 
                        id="content"
                        onChange={e => this.updateFormEntry(e)}/>
                </div>
                <div className="form-group">
                  <label htmlFor="folder-select">folder</label>
                  <select 
                    type="text" 
                    className="noteful__note-folder"
                    name="folderSelect" 
                    id="folder-select" 
                    onChange={e => this.updateFormEntry(e)}>
                        <option>Select</option>
                        { options }
                    </select>
                </div>
                <div className="form-group">
                 <button type="button" className="cancel__button">
                     Cancel
                 </button>
                 <button 
                    type="submit" 
                    className="save__button"
                    disabled={!this.state.formValid}>
                     Save
                 </button>
                </div>
            </form> 
        )
    }
}

AddNote.propTypes = {
    push: PropTypes.func.isRequired
}