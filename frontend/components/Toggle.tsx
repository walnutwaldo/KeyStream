// returns a toggle button with a label of "buyer" on the left and "seller" on the right
// the toggle button should be able to be clicked and change the state of the button
import {useEffect, useState} from 'react';
import styles from './Toggle.module.css'


const Toggle = () => {
    const [state, setState] = useState(false);
    return (
            <div className={styles.toggle_button}>
                I am a 
                <button className="justify-content-center bg-gray-300 px-2 py-1 text-black rounded-md font-bold text-sm hover:bg-gray-400 transition" onClick={() => setState(!state)}>
                    {state ? "Buyer" : "Seller"}
                </button>
            </div>
    );
};
export default Toggle;