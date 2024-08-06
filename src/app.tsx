// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./styles/main.css";
import { logout } from "./api";
import NavBarMenu from "./components/NavBarMenu";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
              <a href="/" class="is-size-3">
                disc golf course design helper
              </a>
            </div>
            <div class="navbar-menu is-size-6 my-auto is-active">
              <div class="navbar-end">
                <NavBarMenu></NavBarMenu>
              </div>
            </div>
          </nav>
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
