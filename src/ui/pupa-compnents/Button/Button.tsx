import { JSX, ParentComponent } from "solid-js"

type ButtonProps = {
  type?: "submit" | "reset" | "button";
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
}

export const Button: ParentComponent<ButtonProps> = ({ type = 'button', children, onClick }) => {
  return <button onClick={onClick} type={type}>{children}</button>
}