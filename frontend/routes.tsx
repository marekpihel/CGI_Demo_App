import MainView from "Frontend/views/MainView.js";
import MovieView from "Frontend/views/MovieView.js";
import {
    createBrowserRouter,
    RouteObject
} from "react-router-dom";

export const routes: readonly RouteObject[] = [
    {path: "/Main", element: <MainView />},
    { path: "/", element: <MovieView /> },
];

export const router = createBrowserRouter([...routes], {basename: new URL(document.baseURI).pathname });
