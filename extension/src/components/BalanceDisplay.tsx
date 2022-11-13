import {useContext, useEffect, useState} from "react";
import TronLinkContext from "../contexts/TronLinkContext";
import {CustomButton} from "./CustomButton";

export default function BalanceDisplay() {
    const {tronWeb, contract, credits} = useContext(TronLinkContext);
    const [balance, setBalance] = useState<string>("");

    function refreshBalance() {
        tronWeb.trx.getBalance(tronWeb.defaultAddress.base58).then((balance: any) => {
            console.log(balance);
            setBalance(tronWeb.fromSun(balance));
        })
    }

    return <>
        {tronWeb && (
            <div className={"text-sm flex flex-row gap-2 justify-center"}>
                <span className={"font-semibold"}>Credits</span> {tronWeb.fromSun(credits).toString()}
            </div>
        )}
    </>
}