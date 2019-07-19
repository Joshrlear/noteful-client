import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import NotefulContext from '../NotefulContext';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder';
import AddNote from '../AddNote';
import ErrorBoundary from '../ErrorHandlers/ErrorBoundary';

import './App.css';
import config from '../config';


class App extends Component {
    state = {
        notes: [],
        folders: [],
        errorBoundaryKey: 0
    };

    handleBackButton = () => {
        this.setState(prevState => ({
            errorBoundaryKey: prevState.errorBoundaryKey + 1
        }), console.clear());
    }

    handleAddFolder = folder => {
        this.setState({
            folders: [...this.state.folders, folder]
        })
    }

    handleAddNote = note => {
        this.setState({
            notes: [...this.state.notes, note]
        })
    }

    componentDidMount() {
        ['folders', 'notes'].map((endPoint) => fetch(`${config.API_ENDPOINT}/${endPoint}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(error => {
                    console.log(`Error: ${error}`)

                    throw error
                })
            }
            return res.json()
        })
        .then(data => {
            if(endPoint === 'notes') {
                data.map(note => {
                    return this.handleAddNote(note)
                })
                
            }
            else {
                data.map(folder => {
                    return this.handleAddFolder(folder)
                })
            }
        })
        .catch(error => {
            this.setState({
                error: `error for ${endPoint}: ${error}`
            })
        }))
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    }

    renderNavRoutes() {
        
        //const {notes, folders} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <ErrorBoundary key={this.state.errorBoundaryKey}>
                <Route
                    path="/note/:noteId"
                    component={NotePageMain}
                />
                </ErrorBoundary>
                <Route 
                    path="/add-folder" 
                    component={AddFolder} 
                />
                <Route 
                    path="/add-note" 
                    component={AddNote} 
                />
            </>
        );
    }


    render() {
        const contextValue = {
            notes: this.state.notes,
            folders: this.state.folders,
            toggle: this.state.toggle,
            toggleErrors: this.handleErrorToggle,
            addNote: this.handleAddNote,
            addFolder: this.handleAddFolder,
            deleteNote: this.handleDeleteNote,
            back: this.handleBackButton
        }

        return (
            <NotefulContext.Provider value={contextValue}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
            </NotefulContext.Provider>
        );
    }
}

export default App;
