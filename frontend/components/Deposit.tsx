function handleDeposit(): void {
    throw new Error("Function not implemented.")
}

const Deposit = () => {
    return (
        <div className = "grid pb-10 place-items-center">
            <form onSubmit={() => handleDeposit()}>
                <label>
                    Deposit: 
                    <input type = "num" placeholder = "amount" />
                </label>
                <button type = "submit"> Submit </button> 
            </form>
        </div>)
}

export default Deposit