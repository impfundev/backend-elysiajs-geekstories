import { navigationAtom } from "./atoms/navigations";
import { useAtomValue } from "jotai";
import { routes } from "./routes";

export function App() {
  const path = useAtomValue(navigationAtom);
  const lastPath = sessionStorage.getItem("navigation");

  return (
    <>
      {routes.map((route, i) => {
        if (lastPath ? lastPath === route.path : path)
          return <route.component key={i} />;
      })}
    </>
  );
}

export default App;
