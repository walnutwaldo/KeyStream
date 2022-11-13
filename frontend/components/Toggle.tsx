// returns a toggle button with a label of "buyer" on the left and "seller" on the right
// the toggle button should be able to be clicked and change the state of the button
import {useContext, useEffect, useState} from 'react';
import TabContext, {UserType} from '../contexts/TabContext';


const Toggle = () => {
    const {
        userType,
        setUserType
    } = useContext(TabContext);

    const options = [
        UserType.BUYER,
        UserType.SELLER
    ]

    return (
        <div className={"container mx-auto center text-center"}>
            I want to
            <div className={"grid grid-cols-2 grid-rows-1 gap-2 mt-2"}>
                {options.map((option, index) => {
                    return (
                        <button
                            key={index}
                            className={
                                "rounded-md bg-gray-200 enabled:bg-opacity-10 disabled:text-black py-1 px-2" +
                                " transition"
                            }
                            disabled={option === userType}
                            onClick={() => {
                                setUserType(option);
                            }}
                        >
                            {option as string}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};
export default Toggle;