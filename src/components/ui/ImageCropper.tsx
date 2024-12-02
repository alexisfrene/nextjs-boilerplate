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

const ASPECT_RATIO = 1; // Ajustar si deseas un aspecto específico
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
      imageElement.onload = () => {
        if (error) setError("");

        const { naturalWidth, naturalHeight } = imageElement;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("La Imagen debe ser al menos de 150 x 150 píxeles.");
          return setImgSrc("");
        }

        setImgSrc(imageUrl);
      };
    });

    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget as HTMLImageElement;
    const { width, height } = target;

    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const initialCrop: PercentCrop = makeAspectCrop(
      {
        unit: "%" as const, // Garantizar que unit sea un valor válido
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );

    const centeredCrop = centerCrop(initialCrop, width, height);
    setCrop(centeredCrop);
  };

  const handleSave = () => {
    if (imgRef.current && previewCanvasRef.current && crop) {
      const pixelCrop = convertToPixelCrop(
        crop as PercentCrop, // Asegurar que crop sea un PercentCrop
        imgRef.current.naturalWidth,
        imgRef.current.naturalHeight
      );

      setCanvasPreview(imgRef.current, previewCanvasRef.current, pixelCrop);

      const dataUrl = previewCanvasRef.current.toDataURL();
      updateImage(dataUrl);
      onSave(dataUrl);
    }
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
            crop={crop || undefined}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            keepSelection
            aspect={ASPECT_RATIO}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Subir"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <Button variant="outline" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      )}
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
    </>
  );
};
