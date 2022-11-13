import {CustomButton} from "./CustomButton";
import React, {useContext, useEffect, useState} from "react";
import TronLinkContext from "../contexts/TronLinkContext";
import BigNumber from "bignumber.js";

import eccrypto from 'eccrypto';
import InlineLoader from "./InlineLoader";
import {Buffer} from 'buffer';

const cookieTargets = [
    'memclid',
    'flwssn',
    'nfvdid',
    'SecureNetflixId',
    'NetflixId',
    'OptanonConsent'
]

const EXAMPLE_NETFLIX_ID = [
    {
        "domain": ".netflix.com",
        "expirationDate": 1699878866.049,
        "hostOnly": false,
        "httpOnly": false,
        "name": "memclid",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "2495a2e4-7852-4001-b4d8-daf0aaa7cd72"
    },
    {
        "domain": ".netflix.com",
        "expirationDate": 1699770407.718481,
        "hostOnly": false,
        "httpOnly": false,
        "name": "nfvdid",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "BQFmAAEBEAjhRnivHp85y5FMf8bHajBgwsj8qScu2AZ6JUdY0VEWmhwvBXZi-BpDp1iUWMXKoXjHVW_p0QxjvNIb88LHLwTexKJYwMsxA6Qbfl9jF8DLaJGxWs5KdNy24jsGx93NkqbUPLWudZE2qsJTMLVwH9nT"
    },
    {
        "domain": ".netflix.com",
        "expirationDate": 1668353664.187504,
        "hostOnly": false,
        "httpOnly": false,
        "name": "flwssn",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "171eaa33-c4a7-4cc9-8aa7-2cb02a3e2da1"
    },
    {
        "domain": ".netflix.com",
        "expirationDate": 1699853664.045429,
        "hostOnly": false,
        "httpOnly": true,
        "name": "SecureNetflixId",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "v%3D2%26mac%3DAQEAEQABABSuNm2eTmIX8hXfYYzSo6CsB-osACxjn9M.%26dt%3D1668317663817"
    },
    {
        "domain": ".netflix.com",
        "expirationDate": 1699853664.045491,
        "hostOnly": false,
        "httpOnly": true,
        "name": "NetflixId",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "ct%3DBQAOAAEBEGr4yEnVI_gNvhb1OYnEkYyB8OiUmd5MAd8NlpFcjCTnsbuuVzAhLGmCXoJP15D-h9Rnbb_fyzQ6pFHyIufPmvGTUQtka5TiS6BnFMNK6Uh6T062rj1slHpgVORZEc70C5Gx3dK46Ei4WuCVIxUtKGoOrHiJEGqj_QTi527KtOlDyMnHQ9qNntqxp1NAy8mjeShgRMu8x3XxpY7j-rqsqjwPOj_C14qyGIY5iNVWcwsPU_BDXgoi25hCIbOtYORQ3EU62Yiz0oMdfNY9DWjG_uTmzTbaFXqMC02G_0hWLwzd2McCGezyd1BskkrRd8MIFAj7VA-GGOyyRdnqYNrYm7NP03A1G-CV1AwC_uovJ7p43CcMUjtpEZ2m0OLvc60gcBmaAqd_D-pw8jEDpuT45Lax_uX2FZNxpqVIXKzDquYt9atnKeja1VnEXGPStOHwMA1Chxf0m6aUCFAvONb-5maqIX_3e5vlT1jv2AYXgSbITIhCrW45r05mrUUw5XpWfNkeR7onMrELm2ZjIzGh3BQ0_BSUdN5eLEUf-kE-_e3aDset3nNltz8c5yfru1P63aflHbB-dhV7bWWlHH4iNy5Uf3J0Bbsg0Iadw4RcdG7IcYTQrFUh_lMDChQbByeClZr_cMwYWEgEQd4I4d81MV5jUO4w-IM45QOovSjMbcHXCko.%26bt%3Ddbl%26ch%3DAQEAEAABABSGiDjnvFv2sVyZp_UdtoKdBnIjsyyKv8Q.%26v%3D2%26mac%3DAQEAEAABABT3jrxGhTYtwZG9cLZS2vscx9_cWoVhlec."
    },
    {
        "domain": ".netflix.com",
        "expirationDate": 1699878636,
        "hostOnly": false,
        "httpOnly": false,
        "name": "OptanonConsent",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "isIABGlobal=false&datestamp=Sun+Nov+13+2022+07%3A30%3A36+GMT-0500+(Eastern+Standard+Time)&version=6.6.0&consentId=164e7d11-0908-47ee-b3a4-ef6d4f2c2a38&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&hosts=H12%3A1%2CH13%3A1%2CH51%3A1%2CH45%3A1%2CH46%3A1%2CH52%3A1%2CH48%3A1%2CH49%3A1&AwaitingReconsent=false"
    }
];

const EXAMPLE_PRIVATE_KEY = Buffer.from(new Uint8Array([
    42, 87, 52, 240, 227, 230, 150, 140, 152, 107, 41, 56, 76, 30, 193, 67, 89, 45, 173, 145, 212, 93, 98, 192, 223, 246, 103, 170, 67, 20, 5, 94
]));

const HOURLY_FEE = 6;

function isActive(fulfillmentTime: BigNumber) {
    return !fulfillmentTime.eq(0) &&
        (new BigNumber(fulfillmentTime.toString())).plus(24 * 3600).gt(
            new BigNumber(Math.floor(Date.now() / 1000))
        );
}

function timeElapsed(fulfillmentTime: BigNumber) {
    return new BigNumber(Math.floor(Date.now() / 1000)).minus(fulfillmentTime);
}

export default function AuthSection() {
    const [message, setMessage] = useState<string>('');
    const [cookieString, setCookieString] = useState<string>('');
    const [loadingAuth, setLoadingAuth] = useState<boolean>(false);
    const [textValue, setTextValue] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);

    const [requestData, setRequestData] = useState<any>(null);

    const {tronWeb, credits, contract, refreshCredits} = useContext(TronLinkContext);

    async function loadAuth(authData: any) {
        setLoadingAuth(false);
        setMessage('');
        try {
            const newCookies = authData!;
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

    function refreshRequestData() {
        contract.getRequest(tronWeb.defaultAddress.base58).call().then(async (data: any) => {
            console.log(data);
            setRequestData(data);
            const privateKey = chrome &&
                chrome.storage &&
                new TextEncoder().encode((await chrome.storage.local.get('privateKey') as any)['privateKey'])
                || EXAMPLE_PRIVATE_KEY;
            console.log(privateKey);
            const fulfilledAt = new BigNumber(data.fulfilledAt.toString());
            if (isActive(fulfilledAt)) {
                // split data.encryptedAuth into iv, mac, ephemPublicKey, and ciphertext
                const buff = Buffer.from(data.encryptedAuth.slice(2), 'hex');
                const iv = Buffer.from(buff.slice(0, 16));
                const mac = Buffer.from(new Uint8Array(buff.slice(16, 48)));
                const ephemPublicKey = Buffer.from(buff.slice(48, 113));
                const ciphertext = Buffer.from(buff.slice(113));
                const payload = {
                    iv,
                    mac,
                    ephemPublicKey,
                    ciphertext
                };
                console.log(payload);
                loadAuth(
                    chrome && chrome.cookies && EXAMPLE_NETFLIX_ID
                    || JSON.parse(
                        new TextDecoder('utf-8').decode(await eccrypto.decrypt(privateKey, payload))
                    )
                );
            }
        }).then((err: any) => {
            console.log(err);
        })
    }

    useEffect(() => {
        if (contract) {
            refreshRequestData();
        }
    }, [contract]);

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

    async function rentAuth() {
        setLoadingAuth(true);
        setTextValue('');
        if (credits.lt(tronWeb.toSun(HOURLY_FEE * 24))) {
            setMessage('Please load more credits (at least 144 TRX)');
        } else {
            const FEE_BASE = await contract.FEE_BASE().call();

            const privateKey = eccrypto.generatePrivate();
            // chrome &&
            // chrome.storage &&
            // eccrypto.generatePrivate() ||
            // DEFAULT_PRIVATE_KEY;
            console.log(privateKey);
            const privateKeyString = new TextDecoder('utf-8').decode(privateKey);
            console.log(privateKeyString);
            const publicKey = eccrypto.getPublic(privateKey);
            if (chrome && chrome.storage) {
                chrome.storage.local.set({"privateKey": privateKeyString}, function () {
                });
            }
            console.log(publicKey);

            contract.openRentRequest(
                HOURLY_FEE * FEE_BASE,
                publicKey
            ).send().then(() => {
                setMessage("Sent Rent Request");
                setTimeout(() => {
                    refreshRequestData();
                    refreshCredits();
                }, 500);
            }).catch((err: any) => {
                setMessage('Unexpected error while sending rent request');
                console.log(err);
            })
        }
    }

    async function endRent() {
        contract.endRent().send().then(() => {
            setMessage("Ended Rent Request");
            setTimeout(() => {
                refreshRequestData();
                refreshCredits();
            }, 500);
        }).catch((err: any) => {
            setMessage('Unexpected error while ending rent: ' + err.toString());
        })
    }

    return (
        <div className={"text-base"}>
            <div className="flex flex-row flex flex-row gap-2">
                <CustomButton onClick={showAuth} className={"w-full my-2"}>
                    (Sell) Lend Out Login
                </CustomButton>
                {
                    contract && (
                        (!requestData || requestData.fee.eq(0)) && (
                            <CustomButton onClick={rentAuth} className={"w-full my-2"}>
                                (Buy) Rent Login
                            </CustomButton>
                        )
                    )
                }
            </div>
            {
                (requestData && !requestData.fee.eq(0)) && (
                    isActive(requestData.fulfilledAt) ? (
                        <div>
                        <span>
                            Borrowed login since {(new Date(
                                (new BigNumber(requestData.fulfilledAt.toString())).times(1000).toNumber())
                        ).toLocaleString()}
                            </span>
                            <CustomButton onClick={endRent} className={"w-full my-2"}>
                                End Rental
                            </CustomButton>
                        </div>
                    ) : (
                        <div>
                        <span>
                            Requesting shared login <InlineLoader/>
                        </span>
                            <CustomButton onClick={endRent} className={"w-full my-2"}>
                                Cancel
                            </CustomButton>
                        </div>
                    )
                )
            }
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