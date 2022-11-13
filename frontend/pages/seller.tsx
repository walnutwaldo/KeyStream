import type { NextPage } from 'next'
import Welcome from '../components/Welcome';
import Navbar from '../components/Navbar'
const Seller: NextPage = () => {
  return (
      <h1 className="welcome">
        <Navbar />
        <Welcome />
      </h1>
  )
}

export default Seller