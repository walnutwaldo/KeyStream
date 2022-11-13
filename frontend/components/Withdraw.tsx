function handleWithdraw(): void {
    throw new Error("Function not implemented.")
}
//center the withdraw button
const Withdraw = () => {
    return (
    <div className="grid pb-0.5 place-items-center" >
        <form  onSubmit={() => handleWithdraw()}>
        <label>
            Withdraw:
            <input type = "num" placeholder = "amount" />
        </label>
        <button type = "submit"> Submit </button> 
    </form>
    </div>)
}

export default Withdraw