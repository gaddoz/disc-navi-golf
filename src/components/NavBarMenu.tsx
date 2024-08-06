import { createAsync, RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { getUser, logout } from "~/api";

export const route = {
  preload() {
    getUser();
  },
} satisfies RouteDefinition;

export default function NavBarMenu() {
  const user = createAsync(async () => getUser(), { deferStream: true });
  return (
    <>
      <Show when={user() == undefined}>
        <a class="p-2" href="/login">
          login
        </a>
        <a class="p-2" href="/register">
          register
        </a>
      </Show>
      <Show when={user() !== undefined}>
        <form action={logout} method="post">
          <button class="link p-2">
            <a class="p-2">logout</a>
          </button>
        </form>
      </Show>
      <a class="p-2" href="/about">
        about
      </a>
      <a class="p-2" href="/test-map">
        test map
      </a>
    </>
  );
}
