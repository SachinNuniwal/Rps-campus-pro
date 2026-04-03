import { useState } from "react";
import "./Login.css"; // your CSS

export default function Login({ onLogin }) {
    const [isSignup, setIsSignup] = useState(false);

    return (
        <div className={`container ${isSignup ? "sign-up-mode" : ""}`}>

            <div className="forms-container">
                <div className="signin-signup">

                    {/* SIGN IN */}
                    <form className="sign-in-form" onSubmit={(e) => e.preventDefault()}>
                        <h2 className="title">Sign In</h2>

                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input type="text" placeholder="Username" />
                        </div>

                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Password" />
                        </div>

                        <button className="btn solid" onClick={onLogin}>
                            Login
                        </button>
                    </form>

                    {/* SIGN UP */}
                    <form className="sign-up-form" onSubmit={(e) => e.preventDefault()}>
                        <h2 className="title">Sign Up</h2>

                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input type="text" placeholder="Username" />
                        </div>

                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input type="email" placeholder="Email" />
                        </div>

                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Password" />
                        </div>

                        <button className="btn solid" onClick={onLogin}>Sign Up</button>
                    </form>

                </div>
            </div>

            {/* PANELS */}
            <div className="panels-container">

                <div className="panel left-panel">
                    <div className="content">
                        <h3>New here?</h3>
                        <h1><b>RPS</b> Engineering College</h1>
                        <p>Empowering Minds, Shaping your Future</p>

                        <button
                            className="btn transparent"
                            onClick={() => setIsSignup(true)}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                <div className="panel right-panel">
                    <div className="content">
                        <h3>Already a member?</h3>
                        <h1><b>RPS</b> Engineering College</h1>
                        <p>Welcome back to campus portal</p>

                        <button
                            className="btn transparent"
                            onClick={() => setIsSignup(false)}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}