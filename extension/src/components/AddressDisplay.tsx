import {useContext} from "react";
import TronLinkContext from "../contexts/TronLinkContext";

export default function AddressDisplay() {
    const {tronWeb} = useContext(TronLinkContext);

    return tronWeb ? (
        <div className={"text-sm"}>
            <span className={"font-semibold"}>Connected</span> ({tronWeb.defaultAddress.base58.toString()})
        </div>
    ) : (
        <div>
            Please install TronLink
        </div>
    )
}