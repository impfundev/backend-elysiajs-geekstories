import { useSetAtom } from "jotai";
import { navigationAtom } from "../atoms/navigations";

export const useNavigation = () => {
  const setNavigation = useSetAtom(navigationAtom);
  const navigate = (path: string) => {
    setNavigation(path);
    sessionStorage.setItem("navigation", path);
  };

  return { navigate };
};
