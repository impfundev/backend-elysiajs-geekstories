import { Html } from "@elysiajs/html";
import { Site } from "../../entities";

interface FooterProps {
  site: Site;
}

export const Footer = ({ site }: FooterProps) => {
  return (
    <section class="responsive">
      <hr />
      <div class="row wrap top-margin bottom-margin large-margin">
        <div class="chip no-margin">{site.name}</div>
        <a class="large-text">Privacy Policy</a>
        <a class="large-text">Terms of Service</a>
        <a class="large-text">Join research studies</a>
        <a class="large-text">Feedback</a>
      </div>
    </section>
  );
};
