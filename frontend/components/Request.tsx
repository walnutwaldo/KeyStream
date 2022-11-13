function handleRequest(): void {
    throw new Error("Function not implemented.")
}

const Request = () => {
    return(
        <div className="grid pt-10 place-items-center">
            <button onClick = {() => handleRequest()}> Make a Request </button>
        </div>)
}

export default Request