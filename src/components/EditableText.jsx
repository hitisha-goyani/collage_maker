import React, { useRef, useEffect } from "react";
import { Text, Transformer } from "react-konva";

export default function EditableText({ textProps, isSelected, onSelect, onChange }) {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        {...textProps}
        ref={shapeRef}
        draggable
        onClick={onSelect}
        onDragEnd={(e) => onChange({ ...textProps, x: e.target.x(), y: e.target.y() })}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          node.scaleX(1);
          node.scaleY(1);
          onChange({ ...textProps, x: node.x(), y: node.y(), fontSize: Math.max(8, textProps.fontSize * scaleX), rotation: node.rotation() });
        }}
      />
      {isSelected && <Transformer ref={trRef} enabledAnchors={["middle-left","middle-right"]} />}
    </>
  );
}
