"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home({ onLogout }) {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    setToken(storedToken);
    setLoggedInEmail(storedEmail);
    if (!storedToken) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;
    fetch("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    router.push("/login");
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
          User List
        </h1>

        {token && loggedInEmail ? (
          <>
            <div
              style={{
                textAlign: "center",
                marginBottom: "15px",
                fontSize: "14px",
                color: "#000000",
              }}
            >
              Logged in as <b>{loggedInEmail}</b>
            </div>

            <ul style={{ listStyle: "none", padding: 0, color: "#000000" }}>
              {users.map((user, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #808080",
                    textAlign: "center",
                    color: "#000000",
                  }}
                >
                  {user.email}
                </li>
              ))}
            </ul>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#c0c0c0",
                  border: "2px solid #808080",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#000000",
                }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#000000" }}>
            Please log in to view users.
          </p>
        )}
      </div>
    </div>
  );
}
