import { getDownloadUrl } from "@vercel/blob";
import { decode } from "@msgpack/msgpack";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET;
const BLOB_URL = "https://4m0cie5i8sy7hf53.public.blob.vercel-storage.com/users.bin";

// Read users from blob storage using direct fetch
const readUsers = async () => {
    try {
        const res = await fetch(BLOB_URL);
        if (!res.ok) return [];
        const arrayBuffer = await res.arrayBuffer();
        return arrayBuffer.byteLength ? decode(new Uint8Array(arrayBuffer)) : [];
    } catch (err) {
        console.error("readUsers error:", err);
        return [];
    }
};

export async function GET(req) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const token = authHeader.split(" ")[1];
        try {
            jwt.verify(token, SECRET);
        } catch {
            return new Response(
                JSON.stringify({ message: "Invalid token" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const users = await readUsers();
        const safeUsers = users.map(u => ({ email: u.email }));

        return new Response(
            JSON.stringify({ users: safeUsers }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ message: "Failed to fetch users" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
