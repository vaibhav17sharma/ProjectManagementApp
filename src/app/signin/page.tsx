import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import SignInForm from "../_components/SignInForm";

const SignInPage = async () => {
  
  const session = await auth();

  if (session?.user) {
    redirect('/');
  }
  
  return (
    <SignInForm />
  )
};

export default SignInPage;
