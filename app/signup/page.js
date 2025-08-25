"use client";
import { useState } from "react";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        setMessage(data.message);
    };

    return (
        <div
            style={{
                backgroundColor: "#c0c0c0",
                height: "100vh",
                fontFamily: "Tahoma, Verdana, sans-serif",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    backgroundColor: "#ffffff",
                    padding: "30px",
                    width: "400px",
                    border: "2px solid #808080",
                    boxShadow: "5px 5px 0 #808080",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        fontSize: "24px",
                        marginBottom: "20px",
                        color: "#000000",
                    }}
                >
                    Sign Up
                </h1>
                <form onSubmit={handleSignup}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            border: "1px solid #808080",
                            borderRadius: "4px",
                            fontSize: "16px",
                            backgroundColor: "#f5f5f5",
                            color: "#000000",
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            border: "1px solid #808080",
                            borderRadius: "4px",
                            fontSize: "16px",
                            backgroundColor: "#f5f5f5",
                            color: "#000000",
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#c0c0c0",
                            border: "2px solid #808080",
                            cursor: "pointer",
                            fontWeight: "bold",
                            color: "#000000",
                            fontSize: "16px",
                            marginBottom: "10px",
                        }}
                    >
                        Sign Up
                    </button>
                    {message && (
                        <p
                            style={{
                                textAlign: "center",
                                color: "#000000",
                                marginTop: "10px",
                                fontSize: "14px",
                            }}
                        >
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}