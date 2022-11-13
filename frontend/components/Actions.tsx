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
        <div>
            <Request />
        </div>

    ) : (
        <div>
            <Fulfill />
        </div>

    )

}

export default Actions