import React from "react";

export function CustomButton(props: any) {
    return (
        <button onClick={props.onClick} className={
            props.className +
            " bg-gray-100 px-2 py-1 text-black rounded-md font-bold text-sm hover:bg-gray-200 transition"
        }>
            {props.children}
        </button>
    )
}