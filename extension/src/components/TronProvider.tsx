import TronWeb from "tronweb";
import React, {useEffect, useState} from "react";
import KeyStreamDeployment from "../KeyStreamDeployment.json";
import TronLinkContext from "../contexts/TronLinkContext";
import BigNumber from "bignumber.js";

export function getTronWeb() {
    const API_URL = 'https://nile.trongrid.io';
    const fullNode = API_URL;
    const solidityNode = API_URL;
    const eventServer = API_URL;

    return new TronWeb(fullNode, solidityNode, eventServer, process.env.REACT_APP_SECRET_KEY);
}

export function TronProvider(props: any) {
    const [tronWeb, setTronWeb] = useState(getTronWeb());
    const [contract, setContract] = useState<any>(undefined);
    const [credits, setCredits] = useState(new BigNumber(0));

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

    useEffect(() => {
        if (tronWeb && !contract) {
            const tronAddress = TronWeb.address.fromHex(KeyStreamDeployment.address);
            const abi = KeyStreamDeployment.abi;
            const instance = tronWeb.contract(abi, tronAddress);
            setContract(instance);
            console.log('Contract Address');
            console.log(tronAddress);
        }
        refreshCredits();
    }, [tronWeb, contract])

    return (
        <TronLinkContext.Provider value={{
            tronWeb,
            setTronWeb,
            contract,
            credits,
            refreshCredits
        }}>
            {props.children}
        </TronLinkContext.Provider>
    )
}