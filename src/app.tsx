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
          <header class="container">
            <nav class="navbar" role="navigation" aria-label="main navigation">
              <div class="navbar-brand">
                <div>
                  <div>
                    <a href="/" class="is-size-3">
                      disc navi golf
                    </a>
                  </div>
                  <p>
                    {" "}
                    <a href="/" class="is-size-5">
                      disc golf course design helper (early alpha)
                    </a>
                  </p>
                </div>
              </div>
              <div class="navbar-menu is-size-6 my-auto is-active">
                <div class="navbar-end">
                  <NavBarMenu></NavBarMenu>
                </div>
              </div>
            </nav>
          </header>
          <main class="container">
            <Suspense>{props.children}</Suspense>
          </main>
          <footer class="footer has-text-centered container">
            disc navi golf - disc golf course design helper (early alpha) - 2024
            &copy;
          </footer>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
