import { Link } from "react-router-dom";

function Header({ isAuthenticated, handleLogout }) {
    return (
        <header>
            <section className='title-container'>
                <h1 className="fancy"><Link to="/">Return to Eden</Link></h1>
            </section>
            <div className="nav-links">
                <nav>
                    <ul className='navbar'>
                        <button className="btn btn-primary"><Link to="/">Home</Link></button>
                        <button className='btn'><Link to="/nativeplantrecommender">Build Your Garden!</Link></button>

                        {!isAuthenticated && (
                            <>
                                <button className='btn'><Link to="/login">Login</Link></button>
                                <button className='btn'><Link to="/register">Register</Link></button>
                            </>
                        )}

                        <button className='btn'><Link to="/garden_app">Garden App</Link></button>
                    </ul>

                    {isAuthenticated && (
                        <ul className='account-links'>
                            <button className='btn'><Link to="/account">Account</Link></button>
                            <button onClick={handleLogout} className="button logout-btn">Logout</button>
                        </ul>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
