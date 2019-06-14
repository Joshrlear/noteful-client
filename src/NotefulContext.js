import React from 'react'

const NotefulContext = React.createContext({
    notes: [],
    folders: [],
    toggle: false,
    deleteNote: () => {},
    addFolder: () => {},
    addNote: () => {},
    toggleErrors: () => {},
    throwError: () => {}
})

export default NotefulContext