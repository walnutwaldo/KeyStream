function handleFulfill(): void {
    throw new Error("Function not implemented.")
}

const Fulfill = () => {
    return(
        <div className="grid pt-10 place-items-center">
            <button onClick = {() => handleFulfill()}> Fulfill </button>
        </div>)
}

export default Fulfill