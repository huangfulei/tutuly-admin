import { BiEditAlt } from "react-icons/bi";
import { ILabel } from "../../../types/ILabel";
import Image from "next/image";
interface LabelsProps {
  labels: ILabel[];
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  setSelectedLabel: (label: ILabel) => void;
}

const Labels: React.FunctionComponent<LabelsProps> = (props) => {
  const { labels, open, setOpen, setSelectedLabel } = props;

  return (
    <>
      {/* Display labels */}
      <ul role="list" className="my-2 flex flex-wrap">
        {labels.map((label: ILabel) => (
          <li key={label.id} className="flex flex-col items-center mr-2 mb-5">
            <div className="flex items-center justify-center hover:opacity-70 relative w-32 h-32 rounded-lg bg-gray-100 md:w-64 md:h-64">
              <BiEditAlt
                className={
                  "text-green-500 h-full w-full p-5 absolute z-10 opacity-0 hover:opacity-80 hover:cursor-pointer"
                }
                onClick={() => {
                  setSelectedLabel(label);
                  setOpen(true);
                }}
              />
              {label.image ? (
                <Image
                  src={label.image.src}
                  alt={label.image.alt}
                  layout="fill"
                />
              ) : undefined}
            </div>
            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
              {label.name}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Labels;
