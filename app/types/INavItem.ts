import { ILabel } from "./ILabel";
export interface INavItem {
  id: string;
  name: string;
  isPage: boolean;
  level: number;
  position: number;
  pages?: INavItem[];
  label?: ILabel;
  navItems?: INavItem[];
  features?: INavItem[];
}
