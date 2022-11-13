import React, {useEffect, useState} from 'react';
import './App.css';
import AddressDisplay from './components/AddressDisplay';
import BalanceDisplay from "./components/BalanceDisplay";
import {TronProvider} from "./components/TronProvider";
import AuthSection from "./components/AuthSection";

export default function App() {

    return (
        <TronProvider>
            <div className="center flex flex-col h-full">
                <header className="center h-full w-hull bg-slate-700 text-lg text-white text-center my-auto p-2">
                    <AddressDisplay/>
                    <BalanceDisplay/>
                    <AuthSection/>
                </header>
            </div>
        </TronProvider>
    );
}
