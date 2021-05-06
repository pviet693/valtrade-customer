import { createContext, useReducer, useEffect } from 'react';
import reducers from './Reducers';
import Cookie from 'js-cookie';
import url from '../utils/backend-api.utils';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const initialState = {
        notify: {}, auth: {}, cart: [], modal: [], orders: [], users: [], categories: []
    }

    const [state, dispatch] = useReducer(reducers, initialState);

    useEffect( async () => {
        if (Cookie.get("access_token")) {
            dispatch({ type: 'LOADING', payload: { loading: true } });
            
            const profileRes = await url.buyer.getProfile();

            let user = {};
            if (profileRes.status === 200) {
                user = profileRes.data.information;
            }

            dispatch({ type: 'AUTH', payload: { user: user } });
                
            dispatch({ type: 'LOADING', payload: {} });
        }
    }, [])

    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {children}
        </DataContext.Provider>
    )
}