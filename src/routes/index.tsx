import { createAsync, type RouteDefinition } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { getCourses, addCourse, deleteCourse, getUser } from "~/api";

export const route = {
  preload() {
    getUser(), getCourses();
  },
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(async () => getUser(), { deferStream: true });
  const courses = createAsync(async () => getCourses(), { deferStream: true });
  const [showAddCourse, setShowAddCourse] = createSignal(false);

  return (
    <main class="w-full p-4 space-y-2">
      <h2 class="title is-inline mr-2">courses</h2>
      <Show when={user()}>
        <button class="button" onclick={() => setShowAddCourse(true)}>
          add new course
        </button>
      </Show>

      <Show when={showAddCourse()}>
        <form action={addCourse} method="post">
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">add new course</p>
                <button
                  class="delete"
                  aria-label="close"
                  onclick={() => setShowAddCourse(false)}
                ></button>
              </header>
              <section class="modal-card-body">
                <div class="field">
                  <label class="label">Course Name</label>
                  <div class="control">
                    <input class="input" type="text" name="name" />
                  </div>
                </div>
              </section>
              <footer class="modal-card-foot">
                <div class="buttons">
                  <button name="new" type="submit" class="button">
                    save new course
                  </button>
                  <button
                    class="button"
                    onclick={() => setShowAddCourse(false)}
                  >
                    cancel
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </form>
      </Show>

      <For each={courses()} fallback={<div>no courses</div>}>
        {(item) => (
          <div class="grid has-2-cols mt-3">
            <div class="cell">
              <a href={`/courses/${item.id}`}>{item.name}</a>
            </div>
            <div class="cell">
              <Show when={user() !== undefined}>
                <a href={`/courses/${item.id}`} class="button mr-2">
                  edit
                </a>
                <form action={deleteCourse.with(item.id)} method="post">
                  <button name="go" type="submit" class="button">
                    delete
                  </button>
                </form>
              </Show>
            </div>
          </div>
        )}
      </For>
    </main>
  );
}
