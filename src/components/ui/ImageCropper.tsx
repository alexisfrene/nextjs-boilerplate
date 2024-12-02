"use client";

import React, { useRef, useState, ChangeEvent } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
  PercentCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "../setCanvasPreview";
import { Button } from "@/ui";
import Image from "next/image";

const ASPECT_RATIO = 0;
const MIN_DIMENSION = 150;

interface ImageCropperProps {
  updateImage: (dataUrl: string) => void;
  onSave: (dataUrl: string) => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  updateImage,
  onSave,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<PercentCrop | null>(null);
  const [error, setError] = useState<string>("");

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const target = e.currentTarget as HTMLImageElement;
        const { naturalWidth, naturalHeight } = target;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("La Imagen debe ser al menos de 150 x 150 pixels.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget as HTMLImageElement;
    const { width, height } = target;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const initialCrop: Crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      1,
      width,
      height
    );
    const centeredCrop = centerCrop(initialCrop, width, height);
    setCrop(centeredCrop);
  };

  return (
    <>
      <label className="block mb-3 w-fit">
        <span className="sr-only">Seleccionar Archivo</span>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </label>
      {error && <div className="text-red-400 text-xs">{error}</div>}
      {imgSrc && (
        <div className="flex flex-col items-center">
          <ReactCrop
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <Image
              ref={imgRef}
              src={imgSrc}
              alt="Subir"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <Button
            variant="outline"
            onClick={() => {
              if (imgRef.current && previewCanvasRef.current && crop) {
                setCanvasPreview(
                  imgRef.current,
                  previewCanvasRef.current,
                  convertToPixelCrop(
                    crop,
                    imgRef.current.width,
                    imgRef.current.height
                  )
                );
                const dataUrl = previewCanvasRef.current.toDataURL();
                updateImage(dataUrl);
                onSave(dataUrl);
              }
            }}
          >
            Guardar
          </Button>
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 196,
            height: 128,
          }}
        />
      )}
    </>
  );
};
