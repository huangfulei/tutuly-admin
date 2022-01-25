import { useEffect, useRef, useState } from "react";
import { getAllDocs } from "../../../../firebase/firestore/client";
import SelectMenu from "../../elements/SelectMenu";
import SlideOverLayout from "./../../layouts/SlideOverLayout";
import { ILabel } from "./../../../types/ILabel";
import { INavItem } from "./../../../types/INavItem";
import Badge from "../../elements/Badge";
import { v4 as uuid } from "uuid";
interface MenuSlideOverProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  navItem: INavItem;
  lev1Pos?: number;
  lev2Pos?: number;
  onSave: (navItem: INavItem) => void;
  onDelete: (navItem: INavItem) => void;
}

const MenuSlideOver: React.FunctionComponent<MenuSlideOverProps> = (props) => {
  const { open, setOpen, navItem, onSave, onDelete } = props;
  const [allLabels, setAllLabels] = useState<ILabel[]>([]);
  const pageNameRef = useRef<HTMLInputElement>(null);
  const [newNavItem, setNewNavItem] = useState<INavItem>(navItem);

  const getAllLabels = async () => {
    // get all labels
    const querySnapshot = await getAllDocs("labels");
    const labels = querySnapshot.docs.map((doc) => {
      return doc.data();
    }) as ILabel[];
    setAllLabels(labels);
  };

  useEffect(() => {
    setNewNavItem(navItem);
  }, [navItem]);

  useEffect(() => {
    getAllLabels();
  }, []);

  return navItem.isPage ? (
    <SlideOverLayout title="New Page" open={open} setOpen={setOpen}>
      <div className="flex flex-col space-y-2">
        <input
          ref={pageNameRef}
          type="text"
          defaultValue={newNavItem.name}
          placeholder="Page Name"
          className="w-full input input-primary input-bordered"
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            newNavItem.name = pageNameRef.current!.value;
            onSave(newNavItem);
            setOpen(false);
          }}
        >
          Save
        </button>
        <button
          className="btn btn-error"
          onClick={() => {
            onDelete(newNavItem);
            setOpen(false);
          }}
        >
          Delete
        </button>
      </div>
    </SlideOverLayout>
  ) : (
    <SlideOverLayout title="New NavItem" open={open} setOpen={setOpen}>
      <div className="flex flex-col space-y-2">
        <SelectMenu
          items={allLabels}
          title="Item Name"
          defaultValue={newNavItem.name}
          onSelected={(value) => {
            newNavItem.id = uuid();
            newNavItem.name = value.name;
            newNavItem.isPage = false;
            newNavItem.label = value;
            setNewNavItem({ ...newNavItem });
          }}
        />
        {/* Sub Items */}
        <SelectMenu
          items={allLabels}
          title="Sub-items"
          onSelected={(value) => {
            const newItem: INavItem = {
              id: uuid(),
              name: value.name,
              position: 999,
              level: navItem.level + 1,
              isPage: false,
              label: value,
            };
            // add nav-item to the next level
            if (newNavItem.navItems) {
              if (
                newNavItem.navItems.some(
                  (item: INavItem) => item.name === newItem.name
                )
              )
                return;
              newNavItem.navItems.push(newItem);
            } else {
              newNavItem.navItems = [newItem];
            }
            setNewNavItem({ ...newNavItem });
          }}
        />
        {newNavItem.navItems?.map((item) => (
          <Badge
            key={item.name}
            className="w-fit"
            name={item.name}
            onRemove={() => {
              newNavItem.navItems = newNavItem.navItems?.filter((navItem) => {
                if (item.id !== navItem.id) return navItem;
              });
              setNewNavItem({ ...newNavItem });
            }}
          />
        ))}

        {/* Features */}
        {navItem.level === 1 ? (
          <SelectMenu
            items={allLabels}
            title="Featured"
            onSelected={(value) => {
              const newItem: INavItem = {
                id: uuid(),
                name: value.name,
                position: 999,
                level: navItem.level + 1,
                isPage: false,
                label: value,
              };
              if (newNavItem.features) {
                if (
                  newNavItem.features.some(
                    (item: INavItem) => item.name === newItem.name
                  )
                )
                  return;
                newNavItem.features.push(newItem);
              } else {
                newNavItem.features = [newItem];
              }
              setNewNavItem({ ...newNavItem });
            }}
          />
        ) : undefined}

        {newNavItem?.features?.map((item) => (
          <Badge
            key={item.name}
            className="w-fit"
            name={item.name}
            onRemove={(name) => {}}
          />
        ))}
        <button
          className="btn btn-primary"
          onClick={() => {
            onSave(newNavItem);
            setOpen(false);
          }}
        >
          Save
        </button>
        <button
          className="btn btn-error"
          onClick={() => {
            onDelete(newNavItem);
            setOpen(false);
          }}
        >
          Delete
        </button>
      </div>
    </SlideOverLayout>
  );
};

export default MenuSlideOver;
