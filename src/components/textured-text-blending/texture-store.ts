import { atom } from "nanostores";

function createTextureStore() {
  const text = atom<string>("Clay");
  const color = atom<string>("#891030");

  return {
    text,
    color,
  };
}
export default createTextureStore();
