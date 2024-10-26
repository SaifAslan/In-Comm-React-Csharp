// src/Redux/features/courses/coursesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICourse } from '../../../Interfaces/ICourse';

interface CoursesState {
    courses: ICourse[];

}

const initialState: CoursesState = {
    courses: [],
};

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setEnrollments(state, action: PayloadAction<ICourse[]>) {
            state.courses = action.payload;
        },
        clearEnrollments(state) {
            state.courses = [];
        },
    },
});

export const { setEnrollments, clearEnrollments } = coursesSlice.actions;
export default coursesSlice.reducer;
