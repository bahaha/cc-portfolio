import { atom } from "nanostores";

type TextureBackground = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export const textureBackgrounds: TextureBackground[] = [
  {
    name: "Crepe Paper",
    src: "/sj-objio-XFWiZTa2Ub0.jpg",
    width: 640,
    height: 960,
  },
  {
    name: "Painting Wall",
    src: "/olga-thelavart-5Xkaq7I1iEk.jpg",
    width: 640,
    height: 480,
  },
  {
    name: "Bed Sheets",
    src: "/sincerely-media-9nhxEa3PK30.jpg",
    width: 640,
    height: 853,
  },
];

function createTextureStore() {
  const background = atom<TextureBackground>(textureBackgrounds[0]);
  const text = atom<string>("Clay");
  const color = atom<string>("#e11d48");
  const fontSize = atom<number>(5);
  const level = atom<number>(30);

  return {
    background,
    text,
    color,
    fontSize,
    level,
  };
}
export default createTextureStore();
