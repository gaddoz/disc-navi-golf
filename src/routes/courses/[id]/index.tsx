import {
  createAsync,
  RouteDefinition,
  RouteSectionProps,
} from "@solidjs/router";
import { getCourse, getPoints, getUser, deletePoint } from "~/api";
import { clientOnly } from "@solidjs/start";
import CoursePointsList from "~/components/CoursePointsList";

const CoursePointsMap = clientOnly(
  () => import("~/components/CoursePointsMap")
);

export const route = {
  preload({ params }) {
    getUser(), getCourse(+params.id);
    getPoints(+params.id);
  },
} satisfies RouteDefinition;

export default function CourseIndex({ params }: RouteSectionProps) {
  const course = createAsync(() => getCourse(+params.id));
  const points = createAsync(async () => getPoints(+params.id), {
    deferStream: true,
  });
  return (
    <main class="w-full">
      <h2 class="title">
        course '{course()?.name} {course()?.id}'
      </h2>
      <CoursePointsList markers={points()}></CoursePointsList>
      <CoursePointsMap
        markers={points()}
        courseId={course()?.id}
      ></CoursePointsMap>
    </main>
  );
}
