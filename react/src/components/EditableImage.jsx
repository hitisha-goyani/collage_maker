import React, { useEffect, useState } from "react";
import { Image as KonvaImage, Group, Rect } from "react-konva";

export default function EditableImage({ shapeProps, onChange }) {
  const {
    src,
    width: slotW,
    height: slotH,
    rotation = 0,
    fitMode = "cover",
    offsetX = 0,
    offsetY = 0,
    scale = 1,
    borderRadius = 12,
  } = shapeProps;

  const [imgObj, setImgObj] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!src) return setImgObj(null);
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    image.onload = () => setImgObj(image);
  }, [src]);

  if (!imgObj) return null;

  const iw = imgObj.width;
  const ih = imgObj.height;

  // FIT OR COVER calculation
  const baseRatio =
    fitMode === "cover"
      ? Math.max(slotW / iw, slotH / ih)
      : Math.min(slotW / iw, slotH / ih);

  const finalRatio = baseRatio * scale;

  const drawW = iw * finalRatio;
  const drawH = ih * finalRatio;

  // center inside mask
  const baseX = (slotW - drawW) / 2;
  const baseY = (slotH - drawH) / 2;

  const posX = baseX + offsetX;
  const posY = baseY + offsetY;

  // prevent dragging outside slot
  const dragBoundFunc = (pos) => {
    const minX = slotW - drawW;
    const minY = slotH - drawH;

    return {
      x: Math.min(0, Math.max(pos.x, minX)),
      y: Math.min(0, Math.max(pos.y, minY)),
    };
  };

  // ⭐ ZOOM HANDLER (Wheel / Pinch)
  const handleWheel = (e) => {
    e.evt.preventDefault();

    let newScale = scale + (e.evt.deltaY > 0 ? -0.05 : 0.05);

    // limit zoom range
    newScale = Math.max(0.5, Math.min(newScale, 3));

    onChange({
      scale: newScale,
    });
  };

  return (
    <Group
      clipX={0}
      clipY={0}
      clipWidth={slotW}
      clipHeight={slotH}
      onWheel={handleWheel}
      clipFunc={(ctx) => {
        ctx.beginPath();
        ctx.moveTo(borderRadius, 0);
        ctx.lineTo(slotW - borderRadius, 0);
        ctx.quadraticCurveTo(slotW, 0, slotW, borderRadius);
        ctx.lineTo(slotW, slotH - borderRadius);
        ctx.quadraticCurveTo(slotW, slotH, slotW - borderRadius, slotH);
        ctx.lineTo(borderRadius, slotH);
        ctx.quadraticCurveTo(0, slotH, 0, slotH - borderRadius);
        ctx.lineTo(0, borderRadius);
        ctx.quadraticCurveTo(0, 0, borderRadius, 0);
        ctx.closePath();
      }}
    >
      {/* IMAGE */}
      <KonvaImage
        image={imgObj}
        x={posX}
        y={posY}
        width={drawW}
        height={drawH}
        rotation={rotation}
        draggable={editMode}
        dragBoundFunc={dragBoundFunc}
        onDblClick={() => setEditMode((s) => !s)}
        onDragMove={(e) => {
          onChange({
            offsetX: e.target.x() - baseX,
            offsetY: e.target.y() - baseY,
          });
        }}
      />

      {/* White Border */}
      <Rect
        x={0}
        y={0}
        width={slotW}
        height={slotH}
        cornerRadius={borderRadius}
        stroke="#ffffff"
        strokeWidth={4}
      />
    </Group>
  );
}
