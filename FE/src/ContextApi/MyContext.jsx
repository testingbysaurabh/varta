import React, { createContext, useContext, useState } from 'react'


export const globalContext = createContext()
const MyContext = ({ children }) => {
    const [mail, setMail] = useState("kagfsdkj")
    const [ui, setUi] = useState(0)
    return (
        <globalContext.Provider value={{
            mail, setMail,
            ui, setUi
        }}>

            {children}
        </globalContext.Provider>
    )
}
export default MyContext

export function useGlobalcontext() {
    return useContext(globalContext)
}