import { useContext } from "react";
import TabContext, { UserType } from "../contexts/TabContext";
import Deposit from "./Deposit";
import Fulfill from "./Fulfill";
import Withdraw from "./Withdraw";
import Request from "./Request";

// If the userType is buyer, render the Deposit, Withdraw, and Request Components. Otherwise, render the Deposit, withdraw, and Fulfill Components.
const Actions = () => {
    const {
        userType,
        setUserType
    } = useContext(TabContext);

    return userType == UserType.BUYER ? (
        <div className={"container mx-auto text-center"}>
            <div className={"w-1/2 mx-auto"}>
                <h1 className={"my-4 font-bold"}>Step 1: Add credits</h1>
                <p>
                    If your account credit balance is low (below 150 TRX), you won't have enough
                    to start a new rental. You are required to have a balance that is enough to cover
                    24 hours of usage even if you don't use the account for the entire time.<br/>

                    Go add credits if you need to.
                </p>

                <h1 className={"my-4 font-bold"}>Step 2: Open the extension</h1>
                <p>
                    The KeyStream extension lets you rent accounts for 24 hours at a time.
                </p>

                <h1 className={"my-4 font-bold"}>Step 3: Click "Rent a Login"</h1>
                <p>
                    You will then wait until a seller accepts your request. Once they do, you will
                    automatically be logged into the account and can use it for up to 24 hours. You may
                    also end your rental early if you wish and you willonly be charged for the time you used.
                </p>
            </div>
        </div>

    ) : (
        <div>
            <Fulfill />
        </div>

    )

}

export default Actions