import { Fragment } from "react";
import { Navbar } from "@itsrennyman/reactailwind";

const Layout = ({ ...props }) => (
  <Fragment>
    <Navbar
      logo={<span className="text-lg text-white">Freschissimo Admin</span>}
      menuItems={[
        { label: "Dashboard", link: "/dashboard" },
        { label: "Users", link: "/users" },
        { label: "Scopes", link: "/scopes" },
      ]}
    />
    {props.children}
  </Fragment>
);

export default Layout;
