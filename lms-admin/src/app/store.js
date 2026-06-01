import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import departmentsReducer from '../features/departments/departmentsSlice'
import coursesReducer from '../features/courses/coursesSlice'
import resourcesReducer from '../features/resources/resourcesSlice'
import examsReducer from '../features/exams/examsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentsReducer,
    courses: coursesReducer,
    resources: resourcesReducer,
    exams: examsReducer,
  },
})

export default store
