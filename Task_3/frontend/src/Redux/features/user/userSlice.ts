import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../../Interfaces/IUser';
interface UserState {
    isAuthenticated: boolean;
    user: IUser | null;
}

const initialState: UserState = {
    isAuthenticated: false,
    user: null, // Initialize user as null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<IUser>) {
            state.isAuthenticated = true;
            state.user = action.payload; // Set the user object
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null; // Clear user on logout
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
