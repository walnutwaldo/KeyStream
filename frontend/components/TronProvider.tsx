import TronWeb from "tronweb";
import React, {useEffect, useState} from "react";
import KeyStreamDeployment from "../src/KeyStreamDeployment.json";
import TronLinkContext from "../contexts/TronLinkContext";
import BigNumber from "bignumber.js";

export function getTronWeb() {
    return (typeof window !== 'undefined' && (window as any).tronWeb) || undefined;
}

export function TronProvider(props: any) {
    const [tronWeb, setTronWeb] = useState<any>(undefined);
    const [contract, setContract] = useState<any>(undefined);
    const [credits, setCredits] = useState<BigNumber>(new BigNumber(0));
    const [balance, setBalance] = useState<BigNumber>(new BigNumber(0));

    function refreshCredits() {
        if (contract) {
            contract.availableBalance(tronWeb.defaultAddress.base58).call().then((credits: any) => {
                setCredits(credits);
            }).catch((err: any) => {
                console.log("got error while requesting credits");
                console.log(err);
            })
        }
    }

    function refreshBalance() {
        if (tronWeb) {
            tronWeb.trx.getBalance(tronWeb.defaultAddress.base58).then((balance: any) => {
                setBalance(new BigNumber(balance));
            }).catch((err: any) => {
                console.log("got error while requesting balance");
                console.log(err);
            })
        }
    }

    useEffect(() => {
        if (!tronWeb) {
            setTronWeb(getTronWeb());
        } else if (tronWeb && !contract) {
            const tronAddress = TronWeb.address.fromHex(KeyStreamDeployment.address);
            const abi = KeyStreamDeployment.abi;
            const instance = tronWeb.contract(abi, tronAddress);
            setContract(instance);
            console.log('Contract Address');
            console.log(tronAddress);
        }
        refreshCredits();
        refreshBalance();
    }, [tronWeb, contract])

    return (
        <TronLinkContext.Provider value={{
            tronWeb,
            setTronWeb,
            contract,
            credits,
            balance
        }}>
            {props.children}
        </TronLinkContext.Provider>
    )
}