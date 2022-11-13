import {useContext} from "react";
import TronLinkContext from "../contexts/TronLinkContext";

const Navbar = () => {
    const {tronWeb} = useContext(TronLinkContext);

    return (
        <div className={"bg-red-500"}>
            <div className="container mx-auto py-2 flex flex-row justify-between items-center">
                <h1 className={"text-2xl font-mono font-bold"}>
                    KeyStream
                </h1>
                <div>
                    <span className={"font-bold"}>Connected </span>
                    <span className={"font-mono"}>
                        {tronWeb?.defaultAddress.base58}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Navbar