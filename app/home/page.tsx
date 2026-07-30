import { redirect } from "next/navigation";

// /home now redirects to the root page (/)
export default function HomeRedirect() {
  redirect("/");
}
