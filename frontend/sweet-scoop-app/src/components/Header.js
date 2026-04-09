function Header() {
    const username = localStorage.getItem("username");

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        window.location.href = "/";
    };

    return (
        <div>
            <header>
                <img src="/images/logo.webp" alt="Sweet Scoop logo" />
                <h1>Sweet Scoop Ice Cream Shop</h1>
                <div className="login-logout">
                    {username ? (
                        <button onClick={handleLogout}>Logout</button>
                    ) : (
                        <a href="/login">Login</a>
                    )}
                </div>
                </header>

            <div className="navbar">
                <div>
                    <a href="/">Home</a>
                    <a href="/flavors">Flavors</a>
                    <a href="/order-history">Order History</a>
                </div>
                
            </div>
        </div>
    );
}

export default Header;