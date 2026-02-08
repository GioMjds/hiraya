import { useRouter, useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { auth } from "./api";

function useLogout() {
  const router = useRouter();
  const params = useParams();
  const rawLang = params?.lang;
  const lang = Array.isArray(rawLang) ? rawLang[0] : rawLang ?? "en";
  
  return useMutation({
    mutationFn: () => auth.logout(),
    onSuccess: () => {
      router.push(`/${lang}`);
    },
    onError: (error) => {
      console.error(`Logout failed: ${error}`);
    }
  });
}

export { useLogout };