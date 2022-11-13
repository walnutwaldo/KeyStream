import {useContext, useEffect, useState} from "react";
import TronLinkContext from "../contexts/TronLinkContext";
import BigNumber from "bignumber.js";
import { Buffer } from 'buffer';
import eccrypto from "eccrypto";

function Fulfill() {
    const [openRequests, setOpenRequests] = useState<any[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const [feeBase, setFeeBase] = useState(new BigNumber(0));
    const [text, setText] = useState("");

    const {tronWeb, contract} = useContext(TronLinkContext);

    function refreshRequests() {
        const reqs: any[] = [];
        contract.numOpenRequests().call().then(async (cnt: any) => {
            console.log(cnt);
            for (let i = 0; i < cnt.toNumber(); i++) {
                const toPush = await contract.getOpenRequest(i).call();
                reqs.push(toPush);
            }
            setOpenRequests(reqs);
        }).catch((err: any) => {
            console.log("got error while requesting open requests");
            console.log(err);
        });
        contract.FEE_BASE().call().then((r: any) => setFeeBase(r));
    }

    function handleFulfill() {
        setSelectedIndex(-1);

        const req = openRequests[selectedIndex];
        const pubkey = Buffer.from(req.pubkey.substring(2), 'hex');
        const shortText = text.replace(/\s/g, '');
        console.log(shortText);
        eccrypto.encrypt(
            pubkey,
            Buffer.from(shortText, 'hex')
        ).then((encrypted: any) => {
            // console.log(encrypted);
            const encryptedAuth = Buffer.concat([
                encrypted.iv,
                encrypted.mac,
                encrypted.ephemPublicKey,
                encrypted.ciphertext,
            ]);
            // console.log(encryptedAuth);

            contract.fulfillRequest(
                req.borrower,
                encryptedAuth
            ).send().then((r: any) => {
                console.log("Successfully fulfilled request");
                console.log(r);
                refreshRequests();
            }).catch((err: any) => {
                console.log("Error while fulfilling Request");
                console.log(err);
            });
        });
    }

    useEffect(() => {
        if (contract) {
            refreshRequests();
        }
    }, [contract]);

    let validAuth = text.length > 0;

    return (
        <div className="container mx-auto text-center">
            <div>
                <h1 className={"font-bold mt-5"}>
                    Insert Your Authentication Data
                </h1>
                <textarea
                    className={"outline-none w-full bg-white text-black rounded-md p-2 font-mono"}
                    placeholder={"Insert your authentication data here"}
                    rows={5}
                    value={text}
                    onChange={
                        (e) => setText(e.target.value)
                    }
                />
                <button
                    className={
                        "my-3 bg-red-500 text-white font-bold py-1 w-full rounded-md transition "
                        + " disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400"
                        + " enabled:hover:bg-red-600"
                    }
                    disabled={!validAuth || selectedIndex === -1}
                    onClick={() => handleFulfill()}
                >
                    Lend out Login
                </button>
            </div>
            <div>
                <h1 className={"mt-5 font-bold"}>
                    Open Requests
                </h1>
                <div className="flex flex-col my-4 mx-auto">
                    {
                        feeBase && openRequests.map((req: any, idx: number) => {
                            return (
                                <button
                                    key={idx}
                                    className={
                                        "py-3 px-2 border-gray-200 border-t-2 transition " +
                                        "text-white flex flex-row justify-between " +
                                        " enabled:hover:font-bold enabled:hover:bg-red-900 " + (
                                            idx === openRequests.length - 1 ? "border-b-2" : ""
                                        ) + " " + (
                                            selectedIndex === idx ? "font-bold bg-gray-200 text-black" : ""
                                        )
                                    }
                                    onClick={() => setSelectedIndex(idx)}
                                    disabled={selectedIndex === idx}
                                >
                                    <div>
                                        {req.fee.div(feeBase).toString()} TRX / hour
                                    </div>
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </div>)
}

export default Fulfill