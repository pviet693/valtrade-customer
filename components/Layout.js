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
import { ChatItem } from 'react-chat-elements';

function Layout({ children }) {
    const { dispatch, state, socket, toast } = useContext(DataContext);
    const { auth, conversations, activeChatUser, openChat } = state
    const [anchorEl, setAnchorEl] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [listMessage, setListMessage] = useState([]);
    const [chatUserId, setChatUserId] = useState("");
    const [listConversation, setListConversation] = useState([]);
    const messagesEndRef = useRef(null);
    const refChatButton = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
        if (listMessage.length > 0) {
            const length = listMessage.length;
            const newConversation = listConversation.map(
                (conversation) => {
                    if (conversation.toUserId === activeChatUser) {
                        return ({
                            ...conversation,
                            subtitle: listMessage[length - 1].message.messageText
                        });
                    }
                    return conversation;
                }
            );
            setListConversation(newConversation);
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
        if (activeChatUser) {
            try {
                let body = {
                    typeFrom: "Buyer",
                    typeTo: "Seller",
                    to: activeChatUser,
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
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("messages", (res) => {
                setListMessage((prevStates) => [...prevStates, {
                    message: {
                        messageText: res.message,
                        createdAt: common.formatTimeChat(new Date(res.time)),
                        imageUrl: "/static/avatar-person.svg"
                    },
                    isMyMessage: res.typeFrom === "Buyer"
                }]);
            });
        }
    }, [socket]);

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
                            createdAt: common.formatTimeChat(new Date(date)),
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
        if (!_.isEmpty(activeChatUser)) {
            setChatUserId(activeChatUser);
        }
    }, [activeChatUser]);

    useEffect(() => {
        if (chatUserId) {
            getListMessage(chatUserId);
        }
    }, [chatUserId]);

    const onClickConversation = async (conversation) => {
        try {
            const { toUserId, unread } = conversation;
            if (unread) {
                const response = await api.chat.updateMessage(toUserId);
                if (response.data.code === 200) {
                    const newConversation = listConversation.map(
                        (conversation) => {
                            if (conversation.toUserId === activeChatUser) {
                                return ({
                                    ...conversation,
                                    unread: 0
                                });
                            }
                            return conversation;
                        }
                    );
                    setListConversation(newConversation);
                } else {
                    common.ToastPrime("Lỗi",
                        response.data.message,
                        "error",
                        toast
                    );
                }
            }
        } catch (error) {
            common.ToastPrime("Lỗi",
                error.response ? error.response.data.message : error.message,
                "error",
                toast
            );
        }
    }

    const updateMessage = async () => {
        const conversation = conversations.find((item) => item.toUserId === activeChatUser);
        if (conversation) {
            try {
                const { toUserId, unread } = conversation;
                if (unread) {
                    const response = await api.chat.updateMessage(toUserId);
                    if (response.data.code === 200) {
                        const newConversation = listConversation.map(
                            (conversation) => {
                                if (conversation.toUserId === activeChatUser) {
                                    return ({
                                        ...conversation,
                                        unread: 0
                                    });
                                }
                                return conversation;
                            }
                        );
                        setListConversation(newConversation);
                    } else {
                        common.ToastPrime("Lỗi",
                            response.data.message,
                            "error",
                            toast
                        );
                    }
                }
            } catch (error) {
                common.ToastPrime("Lỗi",
                    error.response ? error.response.data.message : error.message,
                    "error",
                    toast
                );
            }
        }
    }

    useEffect(() => {
        if (conversations.length > 0 && activeChatUser) {
            const newConversation = conversations.map(
                (conversation) => ({
                    ...conversation,
                    className: conversation.toUserId === activeChatUser ? "active-chat-item" : ""
                })
            );
            setListConversation(newConversation);
        }
    }, [conversations, activeChatUser]);

    useEffect(() => {
        if (openChat) {
            refChatButton.current.click();
            dispatch({ type: 'OPEN_CHAT', payload: false });
        }
    }, [openChat]);

    return (
        <div style={{ width: "100vw", position: "relative", height: "100vh" }}>
            <NavBar />
            <main>{children}</main>
            <Footer />
            <Button aria-describedby={id} onClick={handleClick} ref={refChatButton}
                style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    background: "#0795df",
                    borderRadius: "50%"
                }}>
                <img src="https://asliddinusmonov.github.io/popup-chat-react/logo-no-bg.4d881dc9.svg"
                    alt="chat-icon"
                    style={{ width: '50px', height: '50px' }}
                />
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
                        {
                            listConversation.map((conversation) => (
                                <ChatItem
                                    key={uuidv4()}
                                    avatar={conversation.avatar}
                                    alt={conversation.alt}
                                    title={conversation.title}
                                    subtitle={conversation.subtitle}
                                    dateString={conversation.dateString}
                                    unread={conversation.unread}
                                    onClick={() => onClickConversation(conversation)}
                                    className={conversation.className}
                                />
                            ))
                        }
                    </div>
                    <div className="col-lg-7 px-0 h-100" style={{ position: "relative", minHeight: "500px" }}>
                        <div style={{ height: 440, overflow: "auto", padding: 10, marginBottom: 10 }}>
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
                                onFocus={() => updateMessage()}
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