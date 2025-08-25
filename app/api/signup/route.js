import { put, getDownloadUrl } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { encode, decode } from "@msgpack/msgpack";

// Helper to read users from blob storage
const readUsers = async () => {
  try {
    const { url } = await getDownloadUrl("users.bin");
    if (!url) return [];
    const res = await fetch(url);
    if (!res.ok) return [];
    const buffer = Buffer.from(await res.arrayBuffer());
    return buffer.length ? decode(buffer) : [];
  } catch {
    return [];
  }
};

// Helper to write users to blob storage
const writeUsers = async (users) => {
  const buffer = encode(users);
  await put("users.bin", Buffer.from(buffer), { access: "private" });
};

// POST handler
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const users = await readUsers();

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User already exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    await writeUsers(users);

    return new Response(
      JSON.stringify({ message: "Signup successful" }),
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
