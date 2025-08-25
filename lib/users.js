import bcrypt from "bcryptjs";

export const users = [
  { email: "abc@gmail.com", password: bcrypt.hashSync("abc123", 10) }
];
import { encode } from "@msgpack/msgpack";
import fs from "fs";

const empty = [];
fs.writeFileSync("data/users.bin", encode(empty));
