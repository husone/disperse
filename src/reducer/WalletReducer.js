
const initialState = {
    wallets : [],
    amounts : [],
}
const walletReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_WALLET':
            state.wallets.push(action.payload.wallet);
            state.amounts.push(action.payload.amount);
            return state;
        case 'DELETE_WALLET':
            let i = state.wallets.indexOf(action.payload.wallet);
            state = state.wallets.filter((wallet) => wallet.id !== action.payload.id);
            
            return {
                ...state,
                amounts: [...state.amounts, action.payload]
            }
        default:
            return state
    }
}