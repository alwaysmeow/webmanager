import { createContext } from "react"

const EditContext = createContext(
    {
        editState: false,
        toggleEditState: () => {}
    }
)

export default EditContext