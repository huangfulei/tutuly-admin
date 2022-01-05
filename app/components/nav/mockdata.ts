import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
} from "@heroicons/react/outline";

export interface NavItem {
  name: string;
  href: string;
  icon?: any;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  {
    name: "Products",
    icon: UsersIcon,
    children: [
      { name: "All products", href: "/allProducts" },
      { name: "Labels", href: "/labels" },
      { name: "Calendar", href: "/" },
      { name: "Settings", href: "/" },
    ],
    href: "#",
  },
  { name: "Projects", href: "#", icon: FolderIcon },
  { name: "Calendar", href: "#", icon: CalendarIcon },
  { name: "Documents", href: "#", icon: InboxIcon },
  { name: "Reports", href: "#", icon: ChartBarIcon },
];
