import {useContext, useEffect, useState} from "react";
import TronLinkContext from "../contexts/TronLinkContext";
import {CustomButton} from "./CustomButton";

export default function BalanceDisplay() {
    const {tronWeb, contract} = useContext(TronLinkContext);
    const [balance, setBalance] = useState<string>("");
    const [credits, setCredits] = useState<string>("");

    function refreshCredits() {
        contract.availableBalance(tronWeb.defaultAddress.base58).call().then((credits: any) => {
            console.log(credits);
            setCredits(credits.toString());
        }).catch((err: any) => {
            console.log("got error while requesting available balance");
            console.log(err);
        })
    }

    function refreshBalance() {
        tronWeb.trx.getBalance(tronWeb.defaultAddress.base58).then((balance: any) => {
            console.log(balance);
            setBalance(tronWeb.fromSun(balance));
        })
    }

    useEffect(() => {
        // if (tronWeb) {
        //     refreshBalance();
        // }
        if (contract) {
            refreshCredits();
        }
    }, [tronWeb, contract]);

    return <>
        {tronWeb && (
            <div className={"text-sm flex flex-row gap-2 justify-center"}>
                <span className={"font-semibold"}>Credits</span> {credits}
            </div>
        )}
    </>
}