import { Component, createEffect, createSignal, For } from "solid-js";
import { getRatings, Rating } from "../../backend/rating";
import { Link } from "@solidjs/router"

export const RatingList: Component = () => {
  const [ratings, setRatings] = createSignal<Rating[]>([]);
  
  createEffect(async () => {
    const ratings = await getRatings();
    console.log({ratings})
    setRatings(ratings);
  })

  return <div>
    <For each={ratings()} >
      { (rating) => <div><Link href={`/rating/${rating.username}`}>{rating.username}</Link></div>}
    </For>
  </div>
}