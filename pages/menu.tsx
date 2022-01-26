import { useEffect, useState } from "react";

import MenuSlideOver from "../app/components/modules/menu/MenuSlideOver";
import { SEO } from "../app/components/templates/SEO";
import {
  addDocWithAutoID,
  deleteADoc,
  getAllDocs,
  setDocWithID,
} from "../firebase/firestore/client";
import { INavItem } from "./../app/types/INavItem";
import { v4 as uuid } from "uuid";
import Menu from "./../app/components/modules/menu/Menu";

const newPage: INavItem = {
  id: uuid(),
  name: "",
  isPage: true,
  level: 1,
  position: 999,
};

const newNav: INavItem = {
  id: uuid(),
  name: "",
  isPage: false,
  level: 1,
  position: 999,
};
interface MenuProps {}

const MenuPage: React.FunctionComponent<MenuProps> = () => {
  const [openMenuSlideOver, setOpenMenuSlideOver] = useState(false);
  const [navItems, setNavItems] = useState<INavItem[]>([]);
  const [selectedNav, setSelectedNav] = useState<INavItem>(newPage);
  const [lev1Pos, setLev1Pos] = useState<number>();
  const [lev2Pos, setLev2Pos] = useState<number>();

  const sort = (list: INavItem[]) => {
    list.sort((a, b) => (a.position > b.position ? 1 : -1));
  };
  const getNavItems = async () => {
    // get all labels
    const querySnapshot = await getAllDocs("navItems");
    const navItems = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as INavItem;
    });
    sort(navItems);
    setNavItems(navItems);
  };

  const onSave = async (navItem: INavItem) => {
    // add level 1 item
    if (navItem.level === 1) {
      // update existing item
      if (navItems.some((item) => item.id === navItem.id)) {
        await setDocWithID(`navItems/${navItem.id}`, navItem);
        setNavItems([
          ...navItems.map((item) => {
            if (item.id === navItem.id) {
              item = navItem;
            }
            return item;
          }),
        ]);
        // add new item
      } else {
        const docRef = await addDocWithAutoID("navItems/", navItem);
        navItem.id = docRef.id;
        setNavItems([...navItems, navItem]);
      }
      // add level 3 item
    } else {
      if (typeof lev2Pos === "number" && typeof lev1Pos === "number") {
        const lev2Items = navItems[lev1Pos].navItems;
        if (lev2Items) {
          lev2Items[lev2Pos] = navItem;
          await setDocWithID(
            `navItems/${navItems[lev1Pos].id}`,
            navItems[lev1Pos]
          );
          setNavItems([...navItems]);
        }
      }
    }
    setLev1Pos(undefined);
    setLev2Pos(undefined);
  };

  const onDelete = async () => {
    if (typeof lev2Pos !== "number" && typeof lev1Pos === "number") {
      // remove first level item
      await deleteADoc(`navItems/${navItems[lev1Pos].id}`);
      setNavItems([...navItems.filter((item, index) => index !== lev1Pos)]);
    } else if (typeof lev2Pos === "number" && typeof lev1Pos === "number") {
      // remove second level item
      const lev2Items = navItems[lev1Pos].navItems;
      if (lev2Items) {
        const newItems = lev2Items.filter((item, index) => index !== lev2Pos);
        navItems[lev1Pos].navItems = newItems;
        console.log(navItems);

        await setDocWithID(
          `navItems/${navItems[lev1Pos].id}`,
          navItems[lev1Pos]
        );
        setNavItems([...navItems]);
      }
    }
    setLev1Pos(undefined);
    setLev2Pos(undefined);
  };
  useEffect(() => {
    getNavItems();
  }, []);
  return (
    <>
      <SEO />
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold text-gray-900">Menu</h1>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="m-1 btn btn-primary">
            Add Menu Item
          </div>
          <ul
            tabIndex={0}
            className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
          >
            <li
              onClick={() => {
                setSelectedNav(newPage);
                setOpenMenuSlideOver(true);
              }}
            >
              <a>Page</a>
            </li>
            <li
              onClick={() => {
                setSelectedNav(newNav);
                setOpenMenuSlideOver(true);
              }}
            >
              <a>NavItem</a>
            </li>
          </ul>
        </div>
      </div>

      <MenuSlideOver
        open={openMenuSlideOver}
        setOpen={setOpenMenuSlideOver}
        navItem={selectedNav}
        onDelete={onDelete}
        onSave={onSave}
      />
      <Menu
        navItems={navItems}
        setNavItems={setNavItems}
        setLev1Pos={setLev1Pos}
        setLev2Pos={setLev2Pos}
        setSelectedNav={setSelectedNav}
        setOpenMenuSlideOver={setOpenMenuSlideOver}
      ></Menu>
    </>
  );
};

export default MenuPage;
