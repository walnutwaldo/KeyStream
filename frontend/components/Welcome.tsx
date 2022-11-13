// render a title that says "welcome to Keystream" in a blue color

const Welcome = () => {
    return (
        <div className={"text-center"}>
            <div className="h-72 flex flex-col justify-center gap-4">
                <h1 className={"text-4xl"}>
                    Welcome to Keystream
                </h1>
                <span className={"text-gray-200"}>
                    Share your unused subscriptions, API keys, and more with the world<br/>
                    while earning passive revenue
                </span>
            </div>
        </div>
    )
}
export default Welcome