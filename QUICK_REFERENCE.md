# 🚀 LMS Quick Reference Guide

## Development Quick Start

### Start Both Servers (in separate terminals)

**Terminal 1 - Backend:**
```bash
cd server && npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client && npm run dev
# Runs on http://localhost:5173
```

## Useful Commands

### Backend
```bash
cd server

npm install              # Install dependencies
npm run dev             # Start dev server
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Drizzle Studio
npm run start           # Start production server
```

### Frontend
```bash
cd client

npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Lint code
```

## Project URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Base: http://localhost:5000/api

## File Locations

### Backend
- **Routes**: `server/src/routes/`
- **Controllers**: `server/src/controllers/`
- **Services**: `server/src/services/`
- **Database**: `server/src/db/`
- **Middleware**: `server/src/middleware/`
- **Config**: `server/src/config/`

### Frontend
- **Pages**: `client/src/pages/`
- **Components**: `client/src/components/`
- **Redux**: `client/src/redux/`
- **Vite Config**: `client/vite.config.js`

## Redux Usage

### Dispatch an Action
```javascript
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';

const dispatch = useDispatch();
dispatch(loginUser({ email: 'user@test.com', password: 'pass' }));
```

### Access Redux State
```javascript
import { useSelector } from 'react-redux';

const { user, isLoading } = useSelector(state => state.auth);
```

## Add New Feature

### 1. Create Service
```javascript
// server/src/services/newFeatureService.js
export const getAll = async () => { /* ... */ };
export const getById = async (id) => { /* ... */ };
export const create = async (data) => { /* ... */ };
export const update = async (id, data) => { /* ... */ };
export const delete = async (id) => { /* ... */ };
```

### 2. Create Controller
```javascript
// server/src/controllers/newFeatureController.js
import * as service from '../services/newFeatureService.js';
import { success, error } from '../utils/response.js';

export const getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    success(res, data, 'Success');
  } catch (err) {
    error(res, 'Failed', 500, err.message);
  }
};
```

### 3. Create Routes
```javascript
// server/src/routes/newFeatureRoutes.js
import express from 'express';
import * as controller from '../controllers/newFeatureController.js';
import { isAdmin, authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/', controller.getAll);
router.post('/', authenticateUser, isAdmin, controller.create);

export default router;
```

### 4. Register Route
```javascript
// server/src/index.js
import newFeatureRoutes from './routes/newFeatureRoutes.js';
app.use('/api/new-feature', newFeatureRoutes);
```

### 5. Create Redux Slice
```javascript
// client/src/redux/slices/newFeatureSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAll = createAsyncThunk(
  'newFeature/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/new-feature`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const newFeatureSlice = createSlice({
  name: 'newFeature',
  initialState: { items: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder.addCase(fetchAll.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default newFeatureSlice.reducer;
```

### 6. Add to Store
```javascript
// client/src/redux/store.js
import newFeatureReducer from './slices/newFeatureSlice';

export const store = configureStore({
  reducer: {
    // ...
    newFeature: newFeatureReducer,
  },
});
```

### 7. Create Page/Component
```javascript
// client/src/pages/NewFeature.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll } from '../redux/slices/newFeatureSlice';

export function NewFeaturePage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.newFeature);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### 8. Add Route
```javascript
// client/src/App.jsx
import NewFeaturePage from './pages/NewFeature';

<Route path="/new-feature" element={<NewFeaturePage />} />
```

## Database Operations

### Add New Table to Schema
```javascript
// server/src/db/schema.js
export const newFeature = pgTable('new_feature', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Run Migration
```bash
cd server
npm run db:migrate
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": null
}
```

## Common Patterns

### Protected Admin Route
```javascript
<Route
  path="/admin/something"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminComponent />
    </ProtectedRoute>
  }
/>
```

### Fetch with Authentication
```javascript
const response = await axios.get('/api/endpoint', {
  withCredentials: true,
});
```

### Handle Redux Error
```javascript
const { error } = useSelector(state => state.feature);

useEffect(() => {
  if (error) {
    toast.error(error);
  }
}, [error]);
```

## Debugging

### Check Redux State
```javascript
// In browser console
store.getState()
```

### View Network Requests
```javascript
// Browser DevTools → Network tab
// Filter by XHR/Fetch
```

### Check Server Logs
```bash
# Terminal running server
# Look for [INFO], [ERROR], [AUTH] logs
```

### View Database
```bash
cd server
npm run db:studio
```

## Common Errors & Solutions

### CORS Error
```
❌ Access to XMLHttpRequest at 'http://localhost:5000/api/...'
✅ Add to server .env: CLIENT_URL=http://localhost:5173
✅ Restart server
```

### 401 Unauthorized
```
❌ Response: 401 Unauthorized
✅ Check session cookie in browser DevTools
✅ Verify BETTER_AUTH_URL is correct
✅ Re-login
```

### 404 Not Found
```
❌ Response: 404 Not Found
✅ Check route exists in server/src/routes
✅ Check route is registered in server/src/index.js
✅ Verify URL matches exactly (case-sensitive)
```

### Redux State Not Updating
```
❌ State not changing after dispatch
✅ Check Redux DevTools for actions
✅ Verify extraReducers are implemented
✅ Check async thunk fulfilled/rejected cases
```

### Empty Page on Load
```
❌ Blank page showing
✅ Check browser console for errors
✅ Verify API calls in Network tab
✅ Check Redux state for data
✅ Verify routes are correct
```

## Performance Tips

1. **Use Redux DevTools** - Monitor state changes
2. **Check Network Tab** - See API call times
3. **Use React DevTools** - Profile component renders
4. **Implement Pagination** - For large datasets
5. **Cache Data** - Avoid redundant API calls
6. **Lazy Load** - Load resources on demand

## Security Reminders

- ✅ Never commit .env files
- ✅ Never expose API keys in frontend
- ✅ Always use withCredentials for authenticated requests
- ✅ Validate all inputs on backend
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Keep dependencies updated

## Useful VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Thunder Client (for API testing)
- PostgreSQL (for database queries)
- Tailwind CSS IntelliSense
- Drizzle Kit

## Resources

- [Better Auth Docs](https://better-auth.vercel.app/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Express Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Redux Docs](https://redux.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Happy Coding! 🚀**
