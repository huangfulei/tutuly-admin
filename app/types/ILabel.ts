import { IImage } from "./IImage";
export interface ILabel {
  id: string;
  name: string;
  priority:number;
  image?: IImage;
}
