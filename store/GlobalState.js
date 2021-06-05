import { createContext, useReducer, useEffect, useRef } from 'react';
import reducers from './Reducers';
import Cookie from 'js-cookie';
import api from '../utils/backend-api.utils';
import { Toast } from 'primereact/toast';
import * as common from '../utils/common';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const toast = useRef(null);
    const initialState = {
        notify: {}, auth: {}, cart: [], modal: [], orders: [], users: [], categories: []
    }

    const [state, dispatch] = useReducer(reducers, initialState);

    useEffect(async () => {
        if (Cookie.get("access_token")) {
            try {
                const profileRes = await api.buyer.getProfile();

                let user = {};
                if (profileRes.status === 200) {
                    user = profileRes.data.information;
                }

                dispatch({ type: 'AUTH', payload: { user: user } });

                const cartRes = await api.cart.getCart();
                let carts = [];
                if (cartRes.data.code === 200) {
                    const cartItems = cartRes.data.cartItems;
                    Object.keys(cartItems).forEach(id => {
                        let cart = {
                            productName: cartItems[id].name || "",
                            productId: id || "",
                            productImage: cartItems[id].img.url || "",
                            price: cartItems[id].price || 0,
                            quantity: cartItems[id].quantity || 1
                        }
                        carts.push(cart);
                    })
                }

                dispatch({ type: 'ADD_CART', payload: carts });
            } catch (error) {
                common.ToastPrime('Lỗi', error.message || error, 'error', toast);
            }
        }
    }, [])

    return (
        <DataContext.Provider value={{ state, dispatch, toast }}>
            <Toast ref={toast} />
            {children}
        </DataContext.Provider>
    )
}