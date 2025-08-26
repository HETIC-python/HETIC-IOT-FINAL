import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef } from "react";

export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const enabledRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (enabledRef.current) {
        refetch();
      } else {
        enabledRef.current = true;
      }
    }, [refetch])
  );
}
