import { put } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { encode, decode } from "@msgpack/msgpack";

const FILE_NAME = "users.bin";
const BLOB_URL = "https://4m0cie5i8sy7hf53.public.blob.vercel-storage.com/users.bin";

const readUsers = async () => {
  try {
    const res = await fetch(BLOB_URL);
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
  await put(FILE_NAME, buffer, { access: "public",allowOverwrite: true, }); // <-- FIXED
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
