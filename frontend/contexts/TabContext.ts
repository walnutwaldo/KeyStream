import { createContext } from "react";

export enum UserType {
    BUYER,
    SELLER
}

export type TabContext = {
    userType: UserType;
    setUserType: (userType: UserType) => void;
}

const DEFAULT_CONTEXT : TabContext = {
    userType: UserType.BUYER,
    setUserType: (userType: UserType) => {}
}

const TabContext = createContext<TabContext>(DEFAULT_CONTEXT);

export default TabContext;
