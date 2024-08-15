import { clientOnly } from "@solidjs/start";

const CoursePointsMap = clientOnly(
  () => import("~/components/CoursePointsMap")
);

export default function map() {
  return (
    <main class="w-full p-4 space-y-2">
      <h2 class="title is-inline mr-2">test map</h2>
      <CoursePointsMap
        markers={[]}
        courseId={0}
        userId={undefined}
      ></CoursePointsMap>
    </main>
  );
}
