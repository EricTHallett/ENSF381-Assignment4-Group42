import { useState, useEffect } from "react";
import DisplayStatus from "./DisplayStatus";

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    
    const handleLogin = () => {
        if (!username || !password) {
            setType("error");
            setMessage("Username and password cannot be empty.");
            return;
        }

        fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setType("success");
                setMessage("Login successful! Redirecting...");

                localStorage.setItem("userId", data.userId);
                localStorage.setItem("username", data.username);
            } else {
                setType("error");
                setMessage(data.message);
            }
        })
        .catch(() => {
            setType("error");
            setMessage("Server error. Please try again.");
        });
    };

    useEffect(() => {
        if (type === "success") {
            setTimeout(() => {
                window.location.href = "/flavors";
            }, 2000);
        }
    }, [type]);

    return (
        <form>
            <h2>Login</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />

            <br />
            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <br />

            <button type="button" onClick={handleLogin}>
                Login
            </button>

            <br />

            <a href="/signup">Don't have an account? Sign up</a>

            {message && <DisplayStatus type={type} message={message} />}
        </form>
    );
}

export default LoginForm;