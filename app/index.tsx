import { useEffect } from "react";
import { useRouter, useRootNavigationState } from "expo-router";

export default function Index() {
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (navigationState?.key) {
      // Solo redirige cuando el Root Layout esté montado
      router.replace("/sign-up");
    }
  }, [navigationState?.key]);

  return null;
}
