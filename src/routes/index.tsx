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
    <main class="w-full">
      <h2 class="title">courses</h2>
      <Show when={user()}>
        <button class="button" onclick={() => setShowAddCourse(true)}>
          add new course
        </button>
      </Show>
      <Show when={showAddCourse()}>
        <div>
          <form action={addCourse} method="post">
            <div class="field">
              <label class="label">Course Name</label>
              <div class="control">
                <input class="input" type="text" name="name" />
              </div>
            </div>
            <button name="new" type="submit" class="button">
              save new course
            </button>
          </form>
        </div>
      </Show>
      <For each={courses()} fallback={<div>no courses</div>}>
        {(item) => (
          <div class="grid has-2-cols">
            <div class="cell">
              <a href={`/courses/${item.id}`}>{item.name}</a>
            </div>
            <div class="cell">
              <Show when={user() !== undefined}>
                <a href={`/courses/${item.id}`} class="button">
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
