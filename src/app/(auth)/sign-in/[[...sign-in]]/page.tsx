import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <main className="flex-center h-screen">
      <SignIn />
    </main>
  )
}

export default SignInPage