import React, { useContext, useState, createContext } from 'react';

type Flicker = {
    flicker: boolean,
    setFlicker: (f:boolean) => void,
}

const FlickerContext = createContext<Flicker>({
    flicker: true,
    setFlicker: () => {}
});

export const FlickerProvider: React.FC<{}> = ({children, ...props}) => {
    const [flicker, setFlicker] = useState<boolean>(true);
    return (
        <FlickerContext.Provider value={{flicker, setFlicker}}>
            {children}
        </FlickerContext.Provider>
    )
};

export const useFlickerContext = () => {
    const cont = useContext(FlickerContext);
    return cont.flicker;
};
export const useSetFlicker = () => {
    const cont = useContext(FlickerContext);
    return cont.setFlicker;
};