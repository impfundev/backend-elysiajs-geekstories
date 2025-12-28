import { Html } from "@elysiajs/html";

const menus = [
  { lable: "Home", icon: "home", link: "/" },
  { lable: "Topics", icon: "sell", link: "/topics" },
];

export const Sidebar = () => {
  return (
    <dialog class="right" id="dialog-right">
      <header>
        <nav>
          <h6 class="max">Menu</h6>
          <button class="transparent circle large" data-ui="#dialog-right">
            <i>close</i>
          </button>
        </nav>
      </header>
      <div class="space"></div>
      <ul class="list">
        {menus.map((menu) => (
          <li class="wave round">
            <a href={menu.link}>
              <i>{menu.icon}</i>
              <span class="max">{menu.lable}</span>
            </a>
          </li>
        ))}
      </ul>
    </dialog>
  );
};
