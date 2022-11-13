import React, {useState} from 'react';
import './App.css';
import TronLinkConnect from './TronLinkConnect';
import {CustomButton} from "./components/CustomButton";

const cookieTargets = [
    'memclid',
    'flwssn',
    'nfvdid',
    'SecureNetflixId',
    'NetflixId',
    'OptanonConsent'
]

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
        <div className="center flex flex-col h-full">
            <header className="center h-full w-hull bg-slate-700 text-lg text-white text-center my-auto p-2">
                <div className="flex flex-row justify-between gap-2">
                    <TronLinkConnect />
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
    );
}
