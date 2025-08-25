import { get } from "@vercel/blob";
import { decode } from "@msgpack/msgpack";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET;

const readUsers = async () => {
    try {
        const response = await get("users.bin");
        if (!response.ok) return [];
        const buffer = Buffer.from(await response.arrayBuffer());
        return buffer.length ? decode(buffer) : [];
    } catch {
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
