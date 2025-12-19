import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./components/Home"));
const About = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const Students = lazy(() => import("./components/Students"));

function App() {
    return (
        <BrowserRouter>
            <nav className="space-x-4">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/students">Students</Link>
            </nav>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/students" element={<Students />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
