import type {NextPage} from 'next'
import Welcome from '../components/Welcome';
import Navbar from '../components/Navbar'
import Toggle from '../components/Toggle';
import Actions from '../components/Actions';
import TabContext, {UserType} from '../contexts/TabContext';
import {useState} from 'react';
import Head from "next/head";
import { TronProvider } from '../components/TronProvider';
import CreditsDisplay from "../components/CreditsDisplay";

const Home: NextPage = () => {
    const [userType, setUserType] = useState<UserType>(UserType.BUYER);

    return (
        <div>
            <Head>
                <link rel="shortcut icon" href="../static/KeyStream.png"/>
                <title>KeyStream Dashboard</title>
            </Head>
            <TabContext.Provider value={{
                userType,
                setUserType
            }}>
                <TronProvider>
                    <Navbar/>
                    <div className={"container mx-auto grid grid-cols-2"}>
                        <Welcome/>
                        <CreditsDisplay/>
                    </div>
                    <Toggle/>
                    <Actions/>
                </TronProvider>
            </TabContext.Provider>
        </div>
    )
}

export default Home