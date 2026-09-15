import { Route, Routes } from 'react-router-dom';

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={<h1>SprintHub</h1>}
            />
        </Routes>
    );
}

export default AppRoutes;