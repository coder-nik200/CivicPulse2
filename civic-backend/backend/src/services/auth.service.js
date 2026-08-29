export async function signupUser({ name, email, password, phone, role }) {
  const existingUser = await users().findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    phone: phone || "",
    role: role || "citizen",
    avatar: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await users().insertOne(newUser);

  return {
    id: result.insertedId.toString(),
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    role: newUser.role,
    avatar: newUser.avatar,
  };
}
