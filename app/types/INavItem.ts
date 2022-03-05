import { ILabel } from "./ILabel";
export interface INavItem {
  id: string;
  name: string;
  isPage: boolean;
  level: number;
  position: number;
  pages?: INavItem[];
  url?: string;
  label?: ILabel;
  navItems?: INavItem[];
  features?: INavItem[];
}
