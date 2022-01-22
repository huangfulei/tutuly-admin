import { useFieldArray, useFormContext } from "react-hook-form";
import ImageUpload from "../../elements/ImageUpload";

interface ProductImagesProps {
  index: number;
}

const ProductImages: React.FunctionComponent<ProductImagesProps> = (props) => {
  const { index } = props;
  const { control } = useFormContext();
  const {
    fields: images,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: `variants.${index}.images`,
  });

  return (
    <ImageUpload
      limit={5}
      width={32}
      height={32}
      location={"products/"}
      images={images}
      onUploadFinished={(image) => {
        appendImage(image);
      }}
      onRemoveFinished={(image, index) => {
        removeImage(index);
      }}
    />
  );
};

export default ProductImages;
