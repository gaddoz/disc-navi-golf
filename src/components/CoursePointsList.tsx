import { createAsync, RouteDefinition } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { deletePoint, getUser, updatePointInfo } from "~/api";

export const route = {
  preload() {
    getUser();
  },
} satisfies RouteDefinition;

export default function CoursePointsList(
  props:
    | {
        markers:
          | {
              type: string;
              location: string;
              name: string;
              id: number;
              courseId: number | null;
            }[]
          | undefined;
      }
    | undefined
) {
  const user = createAsync(async () => getUser(), { deferStream: true });
  const [showList, setShowList] = createSignal(false);

  // showEditPoint is used for the ID of the point being edited
  const [showEditPoint, setShowEditPoint] = createSignal(0);
  const [pointName, setPointName] = createSignal("");
  const [pointType, setPointType] = createSignal("");

  const handleShowEditPoint = (id: number) => {
    setShowEditPoint(id);
    const mm = props?.markers?.filter((m) => m.id === id);
    console.log("handleShowEditPoint", id, "found", mm);
    if (mm && mm.length > 0) {
      console.log("yoooo", mm[0].name, mm[0].type);
      setPointName(mm[0].name);
      setPointType(mm[0].type);
    }
  };

  // TODO: fix this reset form after saving (now using setTimeOut workaround)
  const handleClientSubmit = () => {
    console.log("handleClientSubmit");
    setShowEditPoint(0);
    setPointName("");
    setPointType("");
  };

  return (
    <>
      <Show when={!showList()}>
        <button class="button" onclick={() => setShowList(true)}>
          show points list
        </button>
      </Show>
      <Show when={showList()}>
        <button class="button" onclick={() => setShowList(false)}>
          hide list
        </button>
      </Show>
      <Show when={showList()}>
        <For each={props?.markers} fallback={<div>No points.</div>}>
          {(item) => (
            <div class="grid has-2-cols">
              <div class="cell">
                <a href={`/points/${item.id}`}>
                  {item.name} ({item.type}) {item.location}
                </a>
              </div>
              <div class="cell">
                <Show when={user()}>
                  <button
                    class="button"
                    onclick={() => handleShowEditPoint(item.id)}
                  >
                    edit
                  </button>
                  <form
                    action={deletePoint.with(item.id, item.courseId || 0)}
                    method="post"
                  >
                    <button name="go" type="submit" class="button">
                      delete
                    </button>
                  </form>
                </Show>
              </div>
            </div>
          )}
        </For>
        <Show when={showEditPoint()}>
          <form
            action={updatePointInfo.with(
              showEditPoint(),
              pointName(),
              pointType()
            )}
            onSubmit={() => setTimeout(handleClientSubmit, 100)}
            method="post"
          >
            <div>
              <div class="field">
                <label class="label">Point Name</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    name="name"
                    value={pointName()}
                    onChange={(e) => {
                      setPointName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div class="field">
                <div class="select is-normal">
                  <select
                    name="type"
                    onChange={(e) => {
                      setPointType(e.target.value);
                    }}
                  >
                    <option value="teepad" selected={pointType() === "teepad"}>
                      Teepad
                    </option>
                    <option value="basket" selected={pointType() === "basket"}>
                      Basket
                    </option>
                    <option
                      value="ob-point"
                      selected={pointType() === "ob-point"}
                    >
                      OB point
                    </option>
                    <option
                      value="water-point"
                      selected={pointType() === "water-point"}
                    >
                      Water point
                    </option>
                  </select>
                </div>
              </div>
              <button name="go" type="submit" class="button">
                save
              </button>
            </div>
          </form>
        </Show>
      </Show>
    </>
  );
}
