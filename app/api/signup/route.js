import { put, getDownloadUrl } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { encode, decode } from "@msgpack/msgpack";

const FILE_NAME = "users.bin";

const readUsers = async () => {
  try {
    const url = await getDownloadUrl(FILE_NAME);
    if (!url) return [];
    const res = await fetch(url);
    if (!res.ok) return [];
    const buffer = new Uint8Array(await res.arrayBuffer());
    return buffer.length ? decode(buffer) : [];
  } catch (err) {
    console.error("readUsers error:", err);
    return [];
  }
};

const writeUsers = async (users) => {
  const buffer = encode(users); // already Uint8Array
  await put(FILE_NAME, buffer, { access: "public" });
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
