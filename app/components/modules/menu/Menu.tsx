import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { setDocWithID } from "../../../../firebase/firestore/client";
import { INavItem } from "../../../types/INavItem";

interface MenuProps {
  navItems: INavItem[];
  setNavItems: (any: any) => void;
  setSelectedNav: (item: INavItem) => void;
  setLev1Pos: (pos: number) => void;
  setLev2Pos: (pos: number) => void;
  setOpenMenuSlideOver: (open: boolean) => void;
}

const Menu: React.FunctionComponent<MenuProps> = (props) => {
  const {
    navItems,
    setNavItems,
    setLev1Pos,
    setLev2Pos,
    setOpenMenuSlideOver,
    setSelectedNav,
  } = props;
  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { type, source, destination } = result;
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null;

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    if (type == "-1") {
      // level 1 change
      const result = reorder(navItems, source.index, destination.index);
      setNavItems(result);
    } else if (type.includes("-")) {
      // level 3 change
      const index = type.indexOf("-");
      const lev1Index = Number(type.substring(0, index));
      const lev2Index = Number(type.substring(index + 1));

      const lev1Item = navItems[lev1Index];
      if (lev1Item.navItems) {
        const items = lev1Item.navItems[lev2Index].navItems || [];
        const result = reorder(items, source.index, destination.index);
        lev1Item.navItems[lev2Index].navItems = result;
        setNavItems(navItems);
      }
    } else {
      // level 2 change
      const lev1Index = Number(type);
      const items = navItems[lev1Index].navItems || [];
      const result = reorder(items, source.index, destination.index);
      navItems[lev1Index].navItems = result;
      setNavItems(navItems);
    }

    navItems.map((item) => setDocWithID(`navItems/${item.id}`, item));
    // console.log(items);
  };

  const reorder = (list: INavItem[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result.map((item, index) => (item.position = index));

    return result;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" type="-1">
        {(provided, snapshot) => (
          <ul
            ref={provided.innerRef}
            className="divide-y divide-gray-300 menu w-full p-3 border bg-base-100 rounded-box"
          >
            {navItems.map((lev1Item, lev1Index) => (
              <Draggable
                key={lev1Item.id}
                draggableId={`${lev1Item.id}`}
                index={lev1Index}
              >
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                  >
                    <a className="flex justify-between">
                      <div>{lev1Item.name}</div>
                      <button
                        className="btn btn-primary"
                        onClick={(event) => {
                          // event.isPropagationStopped();
                          setSelectedNav(lev1Item);
                          setLev1Pos(lev1Index);
                          setOpenMenuSlideOver(true);
                        }}
                      >
                        Edit
                      </button>
                    </a>

                    <Droppable droppableId={lev1Item.id} type={`${lev1Index}`}>
                      {(provided, snapshot) => (
                        <ul
                          className="divide-y divide-gray-300 menu"
                          ref={provided.innerRef}
                        >
                          {lev1Item.navItems?.map((lev2Item, lev2Index) => {
                            return (
                              <Draggable
                                key={`${lev1Index}${lev2Index}`}
                                draggableId={`${lev1Index}${lev2Index}`}
                                index={lev2Index}
                              >
                                {(provided, snapshot) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <a className="flex justify-between">
                                      {lev2Item.name}
                                      <button
                                        className="btn btn-primary"
                                        onClick={(event) => {
                                          // event.isPropagationStopped();
                                          setSelectedNav(lev2Item);
                                          setLev1Pos(lev1Index);
                                          setLev2Pos(lev2Index);
                                          setOpenMenuSlideOver(true);
                                        }}
                                      >
                                        Edit
                                      </button>
                                    </a>
                                    <Droppable
                                      droppableId={lev2Item.id}
                                      direction="horizontal"
                                      type={`${lev1Index}-${lev2Index}`}
                                    >
                                      {(provided, snapshot) => (
                                        <ul
                                          className="flex divide-x divide-gray-300"
                                          ref={provided.innerRef}
                                        >
                                          {lev2Item.navItems?.map(
                                            (lev3Item, lev3Index) => {
                                              return (
                                                <Draggable
                                                  key={`${lev1Index}${lev2Index}${lev3Index}`}
                                                  draggableId={`${lev1Index}${lev2Index}${lev3Index}`}
                                                  index={lev3Index}
                                                >
                                                  {(provided, snapshot) => (
                                                    <li
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                    >
                                                      <a>{lev3Item.name}</a>
                                                    </li>
                                                  )}
                                                </Draggable>
                                              );
                                            }
                                          )}
                                          {provided.placeholder}
                                        </ul>
                                      )}
                                    </Droppable>
                                  </li>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Menu;
