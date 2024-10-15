"use client";

import { ImagePlus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSuccess = (result: any) => {
    console.log('Upload Result:', result); // Log the entire result for debugging
    if (result.info && result.info.secure_url) {
      onChange(result.info.secure_url); // Use the secure URL from the upload result
      console.log('Secure URL:', result.info.secure_url); // Log the secure URL
    } else {
      console.error('Secure URL not found in the upload result');
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="">
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant={"destructive"}
                size={"sm"}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image src={url} fill className="object-cover" alt="Image" />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onSuccess={(result) => {
          console.log('Upload Result:', result);
          if (result.info && result.info.secure_url) {
            onChange(result.info.secure_url);
            console.log('Secure URL:', result.info.secure_url);
          } else {
            console.error('Secure URL not found in the upload result');
          }
        }}
        uploadPreset="miniproject"
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant={"secondary"}
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
