// make a navbar that prints "Keystream" on the top left corner of the screen and "Buyer" and "Seller" on the top right corner of the screen, linking to two different pages
// clicking "Keystream" should redirect to the home page
import TronLinkConnect from './TronLinkConnect'
import styles from './Navbar.module.css'


const Navbar = () => {
    return (
        <div className={styles.content}>
            <div className="flex">
                <TronLinkConnect />
            </div>
            <div>
                <div className={styles.buyer}>Buyer</div>
                <div className={styles.seller}>Seller</div>
            </div>
        </div>
    )
}

export default Navbar