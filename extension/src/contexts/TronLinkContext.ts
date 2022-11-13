import React from "react";
import BigNumber from "bignumber.js";

export type TronWeb = any;

export type TronLinkContext = {
    tronWeb: TronWeb,
    setTronWeb: (tronWeb: TronWeb) => void,
    contract: any,
    credits: BigNumber,
    refreshCredits: () => void,
}

const DEFAULT_CONTEXT = {
    tronWeb: null,
    setTronWeb: () => {},
    contract: null,
    credits: new BigNumber(0),
    refreshCredits: () => {},
}

const TronLinkContext = React.createContext<TronLinkContext>(DEFAULT_CONTEXT);

export default TronLinkContext;