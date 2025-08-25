"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined" && localStorage.getItem("token")) {
            router.push("/");
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("email", email);
            if (onLogin) onLogin(data.token);
            router.push("/");
        } else {
            setError(data.message || "Login failed");
        }
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
                    Login
                </h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            border: "1px solid #808080",
                            borderRadius: "4px",
                            fontSize: "16px",
                            color: "#000000",
                            backgroundColor: "#f5f5f5",
                        }}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            border: "1px solid #808080",
                            borderRadius: "4px",
                            fontSize: "16px",
                            color: "#000000",
                            backgroundColor: "#f5f5f5",
                        }}
                    />
                    {error && (
                        <div
                            style={{
                                color: "#b00020",
                                marginBottom: "10px",
                                textAlign: "center",
                                fontSize: "14px",
                            }}
                        >
                            {error}
                        </div>
                    )}
                    <div style={{ textAlign: "center" }}>
                        <button
                            type="submit"
                            style={{
                                padding: "10px 24px",
                                backgroundColor: "#c0c0c0",
                                border: "2px solid #808080",
                                cursor: "pointer",
                                fontWeight: "bold",
                                color: "#000000",
                                fontSize: "16px",
                            }}
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}