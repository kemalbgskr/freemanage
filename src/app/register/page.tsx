import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export default function RegisterPage() {
  async function register(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    redirect("/login")
  }

  return (
    <form action={register}>
      <input type="text" name="name" placeholder="Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  )
}
