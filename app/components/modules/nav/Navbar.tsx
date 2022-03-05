/* This example requires Tailwind CSS v2.0+ */
import { MenuIcon } from "@heroicons/react/outline";
import { useState } from "react";

import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import { NavItem, navigation } from "./mockdata";

export default function Example() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	// todo: get static data
	const [currentItem, setCurrentItem] = useState<string>("Dashboard");

	const onItemClick = (item: NavItem) => {
		setCurrentItem(item.name);
	};

	return (
		<>
			{/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}

			<NavbarMobile sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} navigation={navigation} currentItem={currentItem} />
			<NavbarDesktop navigation={navigation} currentItem={currentItem} onItemClick={onItemClick} />

			{/* Mobile view switcher */}
			<div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
				<button
					type="button"
					className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
					onClick={() => setSidebarOpen(true)}>
					<span className="sr-only">Open sidebar</span>
					<MenuIcon className="h-6 w-6" aria-hidden="true" />
				</button>
			</div>
		</>
	);
}
