import { useState } from "react";
import { Link } from "react-router-dom";
import DisplayStatus from "./DisplayStatus";

function SignupForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");

    const validate = () => {
        if (!username || !email || !password || !confirmPassword) {
            return "All fields are required.";
        }
        if (username.length < 3 || username.length > 20) {
            return "Username must be between 3 and 20 characters.";
        }
        if (!/^[a-zA-Z]/.test(username)) {
            return "Username must start with a letter.";
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return "Username may only contain letters, numbers, " +
                   "underscores, and hyphens.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "Invalid email address.";
        }
        if (
            password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[^a-zA-Z0-9]/.test(password)
        ) {
            return "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, number, and special character.";
        }
        if (password !== confirmPassword) {
            return "Passwords do not match.";
        }
        return null;
    };

    const handleSignup = () => {
        const error = validate();
        if (error) {
            setType("error");
            setMessage(error);
            return;
        }

        fetch("http://127.0.0.1:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, confirmPassword })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setType("success");
                setMessage("Signup successful! Redirecting to login...");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
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

    return (
        <form>
            <h2>Sign Up</h2>

            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />

            <br />
            <br />

            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />

            <br />
            <br />

            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

            <br />
            <br />

            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            
            <br />

            <button type="button" onClick={handleSignup}>Sign Up</button>

            <br />

            <Link to="/login">Already have an account? Log in</Link>

            {message && <DisplayStatus type={type} message={message} />}
        </form>
    );
}

export default SignupForm;