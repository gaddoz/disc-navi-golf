import { type RouteSectionProps } from "@solidjs/router";

export default function About(props: RouteSectionProps) {
  return (
    <main class="w-full p-4 space-y-2">
      <h2 class="title">about</h2>
      <div>
        <p class="is-size-4 help is-warning">
          Disc Golf Course Design Helper is in early alpha version!
        </p>
        <p class="is-size-4 help is-warning">
          Attention: data loss can occur frequently
        </p>
        <p class="is-size-3">
          Tools and utilities for disc golf course designers
        </p>
        <ul class="is-size-4">
          <li>create a course: done</li>
          <li>detect current position: done</li>
          <li>add and edit markers for tees, baskets, ob points: wip</li>
          <li>auto draw lines: tee to basket, ob lines from ob points: todo</li>
          <li>generate course map info: todo</li>
          <li>manage collaboration: todo</li>
          <li>fix ui: todo</li>
        </ul>
      </div>
    </main>
  );
}
