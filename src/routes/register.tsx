import { useSubmission, type RouteSectionProps } from "@solidjs/router";
import { Show } from "solid-js";
import { loginOrRegister } from "~/api";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);
  return (
    <main class="w-full p-4 space-y-2">
      <h2 class="title">register</h2>
      <form action={loginOrRegister} method="post">
        <input
          type="hidden"
          name="redirectTo"
          value={props.params.redirectTo ?? "/"}
        />
        <input type="hidden" name="loginType" value="register" checked={true} />
        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input class="input" type="text" name="username" />
          </div>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" name="password" />
          </div>
        </div>
        <button class="button" type="submit">
          Register
        </button>
        <Show when={loggingIn.result}>
          <p class="help is-danger" role="alert" id="error-message">
            {loggingIn.result!.message}
          </p>
        </Show>
      </form>
    </main>
  );
}
