import type { NextPage } from 'next'
import Welcome from '../components/Welcome';
import TronLinkConnect from '../components/TronLinkConnect'
import Navbar from '../components/Navbar'
import Toggle from '../components/Toggle';
import Actions from '../components/Actions';
import TabContext, { UserType } from '../contexts/TabContext';
import { useState } from 'react';
const Home: NextPage = () => {
  const [userType, setUserType] = useState(UserType.BUYER);

  return (
    <TabContext.Provider value={{
      userType,
      setUserType
    }}>
      <h1 className="welcome">
        <Navbar />
        <Welcome />
        <Toggle />
        <Actions />
      </h1>
    </TabContext.Provider>
  )
}

export default Home