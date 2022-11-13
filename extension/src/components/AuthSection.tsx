import {CustomButton} from "./CustomButton";
import React, {useContext, useState} from "react";
import TronLinkContext from "../contexts/TronLinkContext";
import BigNumber from "bignumber.js";

const cookieTargets = [
    'memclid',
    'flwssn',
    'nfvdid',
    'SecureNetflixId',
    'NetflixId',
    'OptanonConsent'
]

const HOURLY_FEE = 6;

export default function AuthSection() {
    const [message, setMessage] = useState<string>('');
    const [cookieString, setCookieString] = useState<string>('');
    const [loadingAuth, setLoadingAuth] = useState<boolean>(false);
    const [textValue, setTextValue] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);

    async function showAuth() {
        setLoadingAuth(false);
        setCookieString('');
        setMessage('');
        if (chrome.cookies) {
            try {
                const cookies = await chrome.cookies.getAll({
                    "domain": ".netflix.com"
                });
                const filteredCookies = cookies.filter(cookie => cookieTargets.includes(cookie.name));

                setCookieString(JSON.stringify(filteredCookies, null, 2));
            } catch (error) {
                setMessage(`Unexpected error: ${(error as { message: string }).message}`);
            }
        } else {
            setCookieString('test string');
        }
    }

    async function loadAuth() {
        setLoadingAuth(false);
        setMessage('');
        try {
            const newCookies = JSON.parse(textValue);
            for (const cookie of newCookies) {
                const toSet = {
                    "name": cookie.name,
                    "domain": cookie.domain,
                    "path": cookie.path,
                    "url": 'https://www.netflix.com',
                    "value": cookie.value,
                    "expirationDate": cookie.expirationDate,
                    "secure": cookie.secure,
                    "httpOnly": cookie.httpOnly,
                };
                await chrome.cookies.set(toSet);
            }
        } catch (error) {
            setMessage(`Unexpected error: ${(error as { message: string }).message}`);
        }
    }

    const {tronWeb, credits, contract} = useContext(TronLinkContext);

    async function rentAuth() {
        setLoadingAuth(true);
        setTextValue('');
        if (credits.lt(tronWeb.toSun(HOURLY_FEE * 24))) {
            setMessage('Please load more credits (at least 144 TRX)');
        } else {
            const FEE_BASE = await contract.FEE_BASE();
            contract.openRentRequest(tronWeb.toSun(HOURLY_FEE * FEE_BASE)).send().then(() => {
                console.log("sent rent request")
            }).catch((err: any) => {
                setMessage('Unexpected error while sending rent request');
                console.log(err);
            })
        }
    }

    return (
        <div className={"text-base"}>
            <div className="flex flex-row justify-between gap-2">
                <CustomButton onClick={showAuth} className={"w-full my-2"}>
                    (Sell) Rent Out Login
                </CustomButton>
                { contract && <CustomButton onClick={rentAuth} className={"w-full my-2"}>
                    (Buy) Rent Login
                </CustomButton> }
            </div>
            {message && <p>{message}</p>}
            <div className={"my-2"}>
                {
                    loadingAuth ? (
                        <div className={"w-full"}>
                        </div>
                    ) : (
                        cookieString && (
                            <div>
                                <span className={"text-gray-200"}>Copy your authentication info below</span>
                                <div
                                    className={"text-sm bg-slate-800 p-2 rounded-md mt-2 text-left font-mono overflow-hidden overflow-ellipsis whitespace-nowrap"}>
                                    {cookieString.replace(/\n/g, ' ')}
                                </div>
                                <CustomButton
                                    className={"w-full mt-2"}
                                    onClick={() => {
                                        setCopied(true);
                                        navigator.clipboard.writeText(cookieString);
                                        setTimeout(() => {
                                            setCopied(false);
                                        }, 1000);
                                    }}
                                >
                                    {copied ? "Copied!" : "Copy"}
                                </CustomButton>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}