import React, { useState, useReducer, useEffect, useCallback } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import { setIn } from "seamless-immutable" 
import ShortcutField from "./ShortcutField"


const defaultShortcuts = {
    select: {
        name: 'Select Region',
        key: 'Escape'
    },
    "zoom": {
        name: 'Zoom In/Out',
        key: 'z'
    },
    "create-point": {
        name: "Create Point"
    },
    "create-box": {
        name: 'Add Bounding Box',
        key: 'b'

    },
    "pan": {
        name: "Pan"
    },
    "create-polygon": {
        name: "Create Polygon"
    },
    "create-pixel": {
        name: "Create Pixel"
    },
    "prev-image": {
        //TODO: { type: "GO_TO_PREV_IMAGE" }
        name: "Previous Image"
    },
    "next-image": {
        //TODO: { type: "GO_TO_NEXT_IMAGE" }
        name: "Next Image"
    }
}

export default ({ action }) =>{
    /*  shortcuts: {
            [actionId: string] : {
                name: string,
                key: string
            }
        }
    */
    const [shortcuts, setShortcuts] = useState({})

    useEffect(() => {
        const newShortcuts = { ...shortcuts }
        for(const actionId of Object.keys(defaultShortcuts)){
            if(!newShortcuts[actionId]){
                newShortcuts[actionId] = defaultShortcuts[actionId]
            }  
        }
        setShortcuts(newShortcuts)
    }, [])

    const onChangeShortcut = (actionId, keyName) => {
        setShortcuts(setIn(shortcuts, [actionId, "key"], keyName))
    }

    useEffect(() => {
        const handleKeyPress = (e) => {
            for (const actionId in shortcuts) {
                const shortcut = shortcuts[actionId]
                if (!shortcut || !shortcut.key){
                   continue
                }
                if (e.key === shortcut.key) {
                   //TODO:  Add Switch case for finding correct action type when user press right/left or another key
                   action({ type: "SELECT_TOOL", selectedTool: actionId })
                }
            }
        }

        window.addEventListener("keypress", handleKeyPress)

         return () => {
            window.removeEventListener("keypress", handleKeyPress)
            // When one of the shortcuts changed it's not focused that input anymore
            if (document.activeElement !== document.body) document.activeElement.blur();
         }
     }, [shortcuts])
    
    return(
        <SidebarBoxContainer title="Shortcuts">
            {
                Object.keys(shortcuts).map((actionId, index) => {
                    if (!shortcuts[actionId]) return null
                    return (
                        <ShortcutField
                            key={actionId}
                            actionId={actionId}
                            actionName={shortcuts[actionId].name}
                            keyName={shortcuts[actionId].key || ""}
                            onChangeShortcut={onChangeShortcut}
                        />
                    )
                }).filter(Boolean)
            }
        </SidebarBoxContainer>
    )
}