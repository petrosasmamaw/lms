import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import coursesReducer from '../features/courses/coursesSlice'
import resourcesReducer from '../features/resources/resourcesSlice'
import examsReducer from '../features/exams/examsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    resources: resourcesReducer,
    exams: examsReducer,
  },
})

export default store
