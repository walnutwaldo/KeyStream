import type { NextPage } from 'next'
import Welcome from '../components/Welcome';
import TronLinkConnect from '../components/TronLinkConnect'
import Navbar from '../components/Navbar'
import Toggle from '../components/Toggle';
const Home: NextPage = () => {
  return (
      <h1 className="welcome">
        <Navbar />
        <Welcome />
        <Toggle />
      </h1>
  )
}

export default Home