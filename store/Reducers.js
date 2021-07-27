import { ACTIONS } from './Actions';


const reducers = (state, action) => {
    switch (action.type) {
        case ACTIONS.NOTIFY:
            return {
                ...state,
                notify: action.payload
            };
        case ACTIONS.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case ACTIONS.AUTH:
            return {
                ...state,
                auth: action.payload
            };
        case ACTIONS.ADD_CART:
            return {
                ...state,
                cart: action.payload
            };
        case ACTIONS.ADD_MODAL:
            return {
                ...state,
                modal: action.payload
            };
        case ACTIONS.ADD_ORDERS:
            return {
                ...state,
                orders: action.payload
            };
        case ACTIONS.ADD_USERS:
            return {
                ...state,
                users: action.payload
            };
        case ACTIONS.ADD_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            };
        case ACTIONS.SEARCH:
            return {
                ...state,
                searchQuery: action.payload
            };
        case ACTIONS.GET_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload
            };
        case ACTIONS.ADD_NEW_CONVERSATION:
            const { conversations } = state;
            const newConversation = action.payload;
            const checkExistConversation = conversations.find(
                (conversation) => conversation.toUserId === newConversation.toUserId
            );
            let newListConversation = [];
            if (!checkExistConversation) {
                newListConversation = [...conversations, newConversation];
            } else {
                newListConversation = [...conversations];
            }

            return {
                ...state,
                conversations: newListConversation,
                activeChatUser: newConversation.toUserId
            }
        case ACTIONS.ACTIVE_CHAT_USER:
            return {
                ...state,
                activeChatUser: action.payload
            };
        case ACTIONS.OPEN_CHAT:
            return {
                ...state,
                openChat: action.payload
            };
        default:
            return state;
    }
}

export default reducers;