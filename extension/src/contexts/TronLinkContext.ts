import React from "react";

export type TronWeb = any;

export type TronLinkContext = {
    tronWeb: TronWeb,
    setTronWeb: (tronWeb: TronWeb) => void,
    contract: any
}

const DEFAULT_CONTEXT = {
    tronWeb: null,
    setTronWeb: () => {},
    contract: null,
}

const TronLinkContext = React.createContext<TronLinkContext>(DEFAULT_CONTEXT);

export default TronLinkContext;