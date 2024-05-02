// @flow

import { createRoot } from "react-dom/client";
import Theme from "./Theme";
import DemoSite from "./DemoSite";
import "./site.css";

const Site = () => {
  return (
    <Theme>
      <DemoSite />
    </Theme>
  );
};

const container = document.getElementById("root")!;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Site />);
