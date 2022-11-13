import React from "react";

export function CustomButton(props: any) {
    return (
        <button onClick={props.onClick} className={
            props.className +
            " bg-gray-300 px-2 py-1 text-black rounded-md font-bold text-sm hover:bg-gray-400 transition"
        }>
            {props.children}
        </button>
    )
}