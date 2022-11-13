import React, {useEffect, useState} from 'react';
import './App.css';
import AddressDisplay from './components/AddressDisplay';
import {CustomButton} from "./components/CustomButton";
import BalanceDisplay from "./components/BalanceDisplay";
import KeyStreamDeployment from './KeyStreamDeployment.json';
import TronLinkContext from './contexts/TronLinkContext';
import {Buffer} from 'buffer';

Buffer.from('anything', 'base64');

const TronWeb = require('tronweb');

const cookieTargets = [
    'memclid',
    'flwssn',
    'nfvdid',
    'SecureNetflixId',
    'NetflixId',
    'OptanonConsent'
]

function getTronWeb() {
    const API_URL = 'https://nile.trongrid.io';
    const fullNode = API_URL;
    const solidityNode = API_URL;
    const eventServer = API_URL;

    return new TronWeb(fullNode, solidityNode, eventServer, process.env.REACT_APP_SECRET_KEY);
}

export function TronProvider(props: any) {
    const [tronWeb, setTronWeb] = useState(getTronWeb());
    const [contract, setContract] = useState(undefined);
    // const [tronWebLoaded, setTronWebLoaded] = useState(false);
    //
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const tw = getTronWeb();
    //         if (
    //             tw &&
    //             typeof tw.defaultAddress.base58 == 'string' &&
    //             !tronWebLoaded
    //         ) {
    //             console.log("TronWeb loaded");
    //             setTronWeb(tw);
    //             setTronWebLoaded(true);
    //         }
    //     }, 100);
    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        setContract(undefined);
        if (tronWeb) {
            const tronAddress = TronWeb.address.fromHex(KeyStreamDeployment.address);
            const abi = KeyStreamDeployment.abi;
            const instance = tronWeb.contract(abi, tronAddress);
            console.log(instance);
            setContract(instance);
        }
    }, [tronWeb])

    return (
        <TronLinkContext.Provider value={{
            tronWeb,
            setTronWeb,
            contract
        }}>
            {props.children}
        </TronLinkContext.Provider>
    )
}

export default function App() {
    const [message, setMessage] = useState<string>('');
    const [cookieString, setCookieString] = useState<string>('');
    const [loadingAuth, setLoadingAuth] = useState<boolean>(false);
    const [textValue, setTextValue] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);

    async function getAuth() {
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

    function startLoadAuth() {
        setLoadingAuth(true);
    }

    return (
        <TronProvider>
            <div className="center flex flex-col h-full">
                <header className="center h-full w-hull bg-slate-700 text-lg text-white text-center my-auto p-2">
                    <AddressDisplay/>
                    <BalanceDisplay/>
                    <div className="flex flex-row justify-between gap-2">
                        <CustomButton onClick={getAuth} className={"w-full my-2"}>
                            Get Auth
                        </CustomButton>
                        <CustomButton onClick={startLoadAuth} className={"w-full my-2"}>
                            Load Auth
                        </CustomButton>
                    </div>
                    {message && <p>{message}</p>}
                    <div className={"my-2"}>
                        {
                            loadingAuth ? (
                                <div className={"w-full"}>
                                <textarea
                                    name="" id="" rows={10} value={textValue}
                                    onChange={
                                        (e) => {
                                            setTextValue(e.target.value);
                                        }
                                    }
                                    className={"w-full outline-none text-black text-sm font-mono p-2 rounded-md"}
                                />
                                    <CustomButton
                                        className={"w-full bg-gray-300"}
                                        onClick={loadAuth}
                                    >
                                        Load
                                    </CustomButton>
                                </div>
                            ) : (
                                cookieString && (
                                    <div>
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
                </header>
            </div>
        </TronProvider>
    );
}
