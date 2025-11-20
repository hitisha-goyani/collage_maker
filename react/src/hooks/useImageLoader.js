import useImage from "use-image";

export default function useImageLoader(src) {
  const [image] = useImage(src, "anonymous");
  return image;
}
