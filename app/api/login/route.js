import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { decode } from "@msgpack/msgpack";
import { getDownloadUrl } from "@vercel/blob";

const SECRET = process.env.SECRET;
const FILE_NAME = "users.bin";

// Read users from blob storage using getDownloadUrl
const readUsers = async () => {
  try {
    const { url } = await getDownloadUrl(FILE_NAME); // <-- CORRECT destructure
    if (!url) return [];
    const res = await fetch(url);
    if (!res.ok) return [];
    const arrayBuffer = await res.arrayBuffer();
    return arrayBuffer.byteLength ? decode(new Uint8Array(arrayBuffer)) : [];
  } catch (err) {
    console.error("readUsers error:", err);
    return [];
  }
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const users = await readUsers();

    const user = users.find((u) => u.email === email);
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: "Invalid password" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: "1h" });

    return new Response(
      JSON.stringify({ message: "Login successful", token }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
