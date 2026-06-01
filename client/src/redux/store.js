import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import departmentReducer from './slices/departmentSlice';
import courseReducer from './slices/courseSlice';
import examReducer from './slices/examSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    department: departmentReducer,
    course: courseReducer,
    exam: examReducer,
  },
});

export default store;
