import { Component, createEffect, createSignal, For } from "solid-js";
import { getRatings, Rating } from "../../backend/rating";
import { Link } from "@solidjs/router"

export const RatingList: Component = () => {
  const [ratings, setRatings] = createSignal<Rating[]>([]);
  
  createEffect(async () => {
    const ratings = await getRatings();
    setRatings(ratings);
  })

  return <div>
    <For each={ratings()} >
      { (rating, index) => <div>{index() + 1}:<Link href={`/rating/${rating.id}`}>{rating.username}</Link></div>}
    </For>
  </div>
}