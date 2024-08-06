import { clientOnly } from "@solidjs/start";

const CoursePointsMap = clientOnly(
  () => import("~/components/CoursePointsMap")
);

export default function map() {
  return (
    <main class="w-full p-4 space-y-2">
      <h2 class="title">Test Map</h2>
      <CoursePointsMap markers={[]} courseId={0}></CoursePointsMap>
    </main>
  );
}
