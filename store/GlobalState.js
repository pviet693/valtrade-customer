import { createContext, useReducer, useEffect, useRef } from 'react';
import reducers from './Reducers';
import Cookie from 'js-cookie';
import api from '../utils/backend-api.utils';
import { Toast } from 'primereact/toast';
import * as common from '../utils/common';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const router = useRouter();
    const toast = useRef(null);
    const initialState = {
        notify: {}, auth: {}, cart: [], modal: [], orders: [], users: [], categories: [], searchQuery: ""
    }
    const [state, dispatch] = useReducer(reducers, initialState);
    const swal = Swal.mixin({
        title: 'Vui lòng chờ!',
        html: "Đang xử lí...",
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
    })

    useEffect(async () => {
        if (router.query.search) {
            dispatch({ type: 'SEARCH', payload: router.query.search });
        }
        if (Cookie.get("access_token")) {
            try {
                const profileRes = await api.buyer.getProfile();

                let user = {};
                if (profileRes.status === 200) {
                    user = profileRes.data.information;
                }

                dispatch({ type: 'AUTH', payload: { user } });

                const cartRes = await api.cart.getCart();
                let carts = [];
                if (cartRes.data.code === 200) {
                    const cartItems = cartRes.data.result;
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
                common.ToastPrime('Lỗi', error.message + error.statusCode || error, 'error', toast);
            }
        }
    }, [])

    return (
        <DataContext.Provider value={{ state, dispatch, toast, swal }}>
            <Toast ref={toast} />
            {children}
        </DataContext.Provider>
    )
}