import TronLinkContext from "../contexts/TronLinkContext";
import {useContext} from "react";
import BigNumber from "bignumber.js";
import * as TronWeb from "tronweb";

function CustomButton(props: any) {
    return <button className={
        "bg-red-500 rounded-md py-1 px-2 text-white hover:bg-red-400 transition " +
        "disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:text-gray-600"
    } onClick={props.onClick} disabled={props.disabled}>
        {props.children}
    </button>
}

export default function CreditsDisplay() {
    const {credits, balance, contract, tronWeb} = useContext(TronLinkContext);

    function withdrawBalance() {
        contract.withdraw(credits).send().then((result: any) => {

        });
    }

    function addBalance() {
        contract.deposit().send({
            callValue: TronWeb.toSun(250)
        }).then((result: any) => {

        });
    }

    return (
        <div className={"flex flex-col justify-center"}>
            <div className={"bg-white rounded-lg p-2 text-black w-72 mx-auto flex flex-col"}>
                <h2 className={"font-semibold"}>
                    BALANCE - CREDITS
                </h2>
                <span className={"font-mono text-gray-700"}>
                    TRX Balance: {TronWeb.fromSun(balance.toString()).toString()}
                </span>
                <span className={"font-mono text-gray-700"}>
                    KeyStream Credits: {TronWeb.fromSun(credits.toString()).toString()} TRX
                </span>
                <div className={"grid grid-cols-2 gap-2 my-2"}>
                    <CustomButton onClick={addBalance} disabled={balance.lt(
                        TronWeb.toSun(250)
                    )}>+ 250 Credits</CustomButton>
                    <CustomButton onClick={withdrawBalance}>Withdraw</CustomButton>
                </div>
            </div>
        </div>
    )
}