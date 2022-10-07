export const errorMessage = (msg, display) => {
    return (
        <div id="err" style={{display: display}}>{msg}</div>
    )
}

export const successMessage = (msg, display) => {
    return (
        <div id="suc" style={{display: display}}>{msg}</div>
    )
}

