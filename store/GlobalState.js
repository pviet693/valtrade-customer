import { createContext, useReducer, useEffect, useRef, useState } from 'react';
import reducers from './Reducers';
import Cookie from 'js-cookie';
import api from '../utils/backend-api.utils';
import { Toast } from 'primereact/toast';
import * as common from '../utils/common';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { io } from "socket.io-client";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const router = useRouter();
    const toast = useRef(null);
    const [socket, setSocket] = useState(null);
    const initialState = {
        notify: {},
        auth: {},
        cart: [],
        modal: [],
        orders: [],
        users: [],
        categories: [],
        searchQuery: "",
        conversations: [],
        activeChatUser: "",
        openChat: false,
        firstAccess: true
    }
    const [state, dispatch] = useReducer(reducers, initialState);
    const swal = Swal.mixin({
        title: 'Vui lòng chờ!',
        html: "Đang xử lí...",
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
    });

    const getAvatar = (conversation) => {
        const { recipients } = conversation;
        const { from } = recipients;
        const { fromId } = from;
        const { imageUrl } = fromId;
        if (imageUrl) {
            const { url } = imageUrl;
            return url || "/static/avatar-person.svg";
        };

        return "/static/avatar-person.svg";
    };

    useEffect(async () => {
        console.log("Socket connect");
        const socket = io.connect("https://valtrade-api.tech", {
            transports: ["websocket", "polling"]
        });
        setSocket(socket);

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

                const responseConversation = await api.chat.getListConversation();
                if (responseConversation.data.code === 200) {
                    const { result } = responseConversation.data;
                    const conversations = [];
                    result.forEach((conversation) => {
                        const { recipients } = conversation;
                        const { from, to } = recipients;
                        const { fromId } = from;
                        const { toId } = to;
                        const checkSeller = from.actors === "Seller";
                        let title = checkSeller ? fromId.nameOwner : toId.nameOwner;
                        let fromUserId = checkSeller ? toId._id : fromId._id;
                        let toUserId = checkSeller ? fromId._id : toId._id;
                        conversations.push({
                            fromUserId,
                            toUserId,
                            avatar: getAvatar(conversation),
                            alt: "avatar",
                            title,
                            subtitle: conversation.lastMessage,
                            dateString: common.formatTimeChat(new Date(conversation.date)),
                            unread: conversation.count,
                            className: ""
                        })
                    });

                    if (conversations.length > 0) {
                        dispatch({ type: 'GET_CONVERSATIONS', payload: conversations });
                        dispatch({ type: 'ACTIVE_CHAT_USER', payload: conversations[0].toUserId });
                    }
                }
            } catch (error) {
                common.ToastPrime('Lỗi', error.response ? error.response.data.message : error.message, 'error', toast);
            }
        }
    }, []);

    return (
        <DataContext.Provider value={{ state, dispatch, toast, swal, socket }}>
            <Toast ref={toast} />
            {children}
        </DataContext.Provider>
    )
}