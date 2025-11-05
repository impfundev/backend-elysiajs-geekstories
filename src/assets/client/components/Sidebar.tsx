import { useAtomValue } from "jotai";
import { navigationAtom } from "../atoms/navigations";
import { useNavigation } from "../hooks/useNavigation";
import { routes } from "../routes";
import { useState } from "react";

interface SidebarProps {
  onCreate?: () => void;
}

export const Sidebar = ({ onCreate }: SidebarProps) => {
  const [open, setOpen] = useState(true);

  const path = useAtomValue(navigationAtom);
  const lastPath = sessionStorage.getItem("navigation");
  const currentPath = lastPath ? lastPath : path;

  const currentDataListPage = routes
    .filter((route) => route.path !== "dashboard")
    .find((route) => route.path === path);
  const { navigate } = useNavigation();

  return (
    <nav className={`m l left ${open && "max"}`} id="navigation-rail1">
      <header>
        <button
          className="extra circle transparent"
          onClick={() => setOpen(!open)}
        >
          <i>{open ? "menu_open" : "menu"}</i>
        </button>
        {currentDataListPage && (
          <button
            className="extend square round"
            onClick={onCreate}
            data-ui="#form"
          >
            <i>add</i>
            <span>Create {currentDataListPage.name}</span>
          </button>
        )}
      </header>
      {routes.map((route, i) => {
        return (
          <a
            key={i}
            className={currentPath == route.path ? "active" : ""}
            href={`#${route.path}`}
            onClick={() => navigate(route.path)}
          >
            <i>{route.icon}</i>
            <span>{route.name}</span>
          </a>
        );
      })}
    </nav>
  );
};
