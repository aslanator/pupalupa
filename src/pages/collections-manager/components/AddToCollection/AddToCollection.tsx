import { createSignal, JSX } from "solid-js"
import { Icon } from "../../../../ui/icons";
import { addToColelections } from "../../../../backend/collection";
import { Button } from "../../../../ui/pupa-compnents/Button/Button";

export const AddToCollection = () => {
  const [usename, setUsername] = createSignal('');

  const onChange: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    setUsername(event.currentTarget.value);
  }

  const add = (event: Event) => {
    event.preventDefault();
    addToColelections(usename());
    setUsername('');
  }

  return <div>
    <div>Add new</div>
    <form onSubmit={add}>
      <input type="text" value={usename()} onChange={onChange} />
      <Button type="submit" onClick={add}><Icon name='user-plus' /></Button>
    </form>
  </div>
}