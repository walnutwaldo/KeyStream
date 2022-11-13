// returns a toggle button with a label of "buyer" on the left and "seller" on the right
// the toggle button should be able to be clicked and change the state of the button
import {useContext, useEffect, useState} from 'react';
import TabContext from '../contexts/TabContext';
import styles from './Toggle.module.css'


const Toggle = () => {
    const {
        userType,
        setUserType
    } = useContext(TabContext);

    return (
            <div className={styles.toggle_button}>
                I am a 
                <button className="text-sky-400 ml-1 border-2 border-rose-500" onClick={() => setUserType((userType + 1) % 2)}>
                    {userType ? " Seller" : " Buyer"}
                </button>
            </div>
    );
};
export default Toggle;