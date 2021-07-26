import React, { useContext, useState, useEffect, useRef } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { ChatList } from 'react-chat-elements';
import Message from "./Message";
import api from '../utils/backend-api.utils';
import { DataContext } from '../store/GlobalState';
import * as common from "../utils/common";
import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';

function Layout({ children }) {
    const { state, socket, toast } = useContext(DataContext);
    const { auth } = state
    const [anchorEl, setAnchorEl] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [listMessage, setListMessage] = useState([]);
    const [listConversation, setListConversation] = useState([]);
    const [chatUserId, setChatUserId] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (listMessage.length > 0) {
            scrollToBottom();
        }
    }, [listMessage]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const sendMessage = async (e) => {
        e.preventDefault();
        const text = messageText;
        setMessageText("");
        try {
            let body = {
                typeFrom: "Buyer",
                typeTo: "Seller",
                to: chatUserId,
                message: text
            }
            const response = await api.chat.postMessage(body);
            if (response.status !== 200) {
                common.ToastPrime("Lỗi",
                    response.data.message,
                    "error",
                    toast
                );
            }
        } catch (error) {
            common.ToastPrime("Lỗi",
                error.response ? error.response.data.message : error.message,
                "error",
                toast
            );
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("messages", (res) => {
                setListMessage((prevStates) => [...prevStates, {
                    message: {
                        messageText: res.message,
                        createdAt: res.time,
                        imageUrl: "/static/avatar-person.svg"
                    },
                    isMyMessage: res.typeFrom === "Buyer"
                }])
            });
        }
    }, [socket]);

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

    const getListConversation = async () => {
        try {
            const response = await api.chat.getListConversation();
            if (response.data.code === 200) {
                const { result } = response.data;
                const conversations = [];
                result.forEach((conversation, index) => {
                    if (index === 0) {
                        const { recipients } = conversation;
                        const { to } = recipients;
                        const { toId } = to;
                        setChatUserId(toId._id);
                    }
                    conversations.push({
                        avatar: getAvatar(conversation),
                        alt: "avatar",
                        title: conversation.recipients.from.fromId.name || "",
                        subtitle: conversation.lastMessage,
                        dateString: conversation.date,
                        unread: conversation.count,
                    })
                });
                setListConversation(conversations);
            } else {
                common.ToastPrime("Lỗi",
                    response.data.message,
                    "error",
                    toast
                );
            }
        } catch (error) {
            common.ToastPrime("Lỗi",
                error.response ? error.response.data.message : error.message,
                "error",
                toast
            );
        }
    }

    const getListMessage = async (chatUserId) => {
        try {
            const response = await api.chat.getListMessage(chatUserId);
            if (response.data.code === 200) {
                const { result } = response.data;
                const messages = [];
                result.forEach((message) => {
                    const { from, body, date } = message;
                    const { typeTo } = from;
                    messages.push({
                        message: {
                            messageText: body,
                            createdAt: date,
                            imageUrl: "/static/avatar-person.svg"
                        },
                        isMyMessage: typeTo === "Buyer"
                    })
                });
                setListMessage(messages);
            } else {
                common.ToastPrime("Lỗi",
                    response.data.message,
                    "error",
                    toast
                );
            }
        } catch (error) {
            common.ToastPrime("Lỗi",
                error.response ? error.response.data.message : error.message,
                "error",
                toast
            );
        }
    };

    useEffect(() => {
        if (!_.isEmpty(auth)) {
            getListConversation();
        }
    }, [auth]);

    useEffect(() => {
        if (chatUserId) {
            getListMessage(chatUserId);
        }
    }, [chatUserId]);

    return (
        <div style={{ width: "100vw", position: "relative", height: "100vh" }}>
            <NavBar />
            <main>{children}</main>
            <Footer />
            <Button aria-describedby={id} onClick={handleClick}
                style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    background: "#0795df",
                    borderRadius: "50%"
                }}>
                <img src="/static/chat-icon.svg" />
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl || null}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <div className="d-flex w-100">
                    <div className="col-lg-5 px-0 h-100"
                        style={{
                            borderRight: "1px solid rgba(0, 0, 0, 0.09)",
                            minHeight: 500
                        }}
                    >
                        <ChatList
                            className='chat-list'
                            dataSource={listConversation} />
                    </div>
                    <div className="col-lg-7 px-0 h-100" style={{ position: "relative", minHeight: "500px" }}>
                        <div style={{ height: 440, overflow: "auto", padding: 10, marginBottom: 10 }}>
                            {/* <Message
                                isMyMessage={false}
                                message={{
                                    messageText: "Sản phẩm này bạn có vừa lòng không ạ? Cho shop xin ít ý kiến để cải thiện dịch vụ với ạ. Shop cảm ơn",
                                    imageUrl: "/static/avatar-person.svg",
                                    createdAt: "12/07/2021 - 10:20:21 AM"
                                }}
                            />
                            <Message
                                isMyMessage={true}
                                message={{
                                    messageText: "Sản phẩm rất ưng ý nhé shop. Giao hàng nhanh, tư vấn viên nhiệt tình hỗ trợ. Điểm 10 chất lượng",
                                    createdAt: "12/07/2021 - 10:20:25 AM"
                                }}
                            /> */}
                            {
                                listMessage.map((message) => {
                                    return (
                                        <Message
                                            key={uuidv4()}
                                            isMyMessage={message.isMyMessage}
                                            message={message.message}
                                        />
                                    );
                                })
                            }
                            <div ref={messagesEndRef} />
                        </div>
                        <form 
                            className="chat-form"
                        >
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tin nhắn ở đây..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn"
                                onClick={sendMessage}
                            >
                                <img src="/static/send.png" />
                            </button>
                        </form>
                    </div>
                </div>
            </Popover>
        </div>
    )
}

export default Layout;