import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";

export const useAppState = () => {
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
  });

  //   useEffect(() => {
  //     const subscription = AppState.addEventListener("change", onChange);
  //     return () => {
  //       subscription.remove();
  //     };
  //   }, [onChange]);
};
