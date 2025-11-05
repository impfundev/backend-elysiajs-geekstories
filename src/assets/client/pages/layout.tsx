import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";

interface LayoutProps {
  children: ReactNode;
  title: string;
  onCreate?: () => void;
}

export const Layout = ({ children, title, onCreate }: LayoutProps) => {
  return (
    <>
      <Sidebar onCreate={onCreate} />
      <main className="surface-container margin large-padding round">
        <h3>{title}</h3>
        <div className="top-padding large-padding page active">{children}</div>
      </main>
      <div className="overlay"></div>
    </>
  );
};
