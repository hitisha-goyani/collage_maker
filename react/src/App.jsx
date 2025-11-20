import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Text as KonvaText, Group } from "react-konva";
import { v4 as uuidv4 } from "uuid";

import { TEMPLATES } from "./data/templates";
import TemplateList from "./components/TemplateList";
import SlotPlaceholder from "./components/SlotPlaceholder";
import EditableImage from "./components/EditableImage";
import EditableText from "./components/EditableText";
import PropertiesPanel from "./components/PropertiesPanel";
import { exportStageAsImage } from "./utils/exportImage";

export default function App() {
  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 500;

  // ⭐ Category State
  const [category, setCategory] = useState(TEMPLATES[0].category);

  // ⭐ Active Template
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0]);

  // Objects inside Canvas
  const [images, setImages] = useState([]);
  const [texts, setTexts] = useState([]);

  // Selected item
  const [selectedId, setSelectedId] = useState(null);

  const stageRef = useRef();
  const wrapperRef = useRef();  

  // Load template slots
  useEffect(() => {
    const newImgs = activeTemplate.slots.map((slot) => ({
      id: uuidv4(),
      src: null,
      x: Math.round(slot.x * CANVAS_WIDTH),
      y: Math.round(slot.y * CANVAS_HEIGHT),
      width: Math.round(slot.width * CANVAS_WIDTH),
      height: Math.round(slot.height * CANVAS_HEIGHT),

      // ⭐ IMPORTANT DEFAULTS (PropertiesPanel requires these!)
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      fitMode: "cover",
      rotation: 0,

      border: { width: 4, color: "#ffffff", radius: 10 }
    }));

    setImages(newImgs);
    setTexts([]);
    setSelectedId(null);
  }, [activeTemplate]);

  // Pick image
  const handleReplace = (slotId) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const src = URL.createObjectURL(file);

      setImages((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, src } : s))
      );
    };

    input.click();
  };

  // Drag–drop
  const handleDropToSlot = (e, slotId) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const src = URL.createObjectURL(file);
    setImages((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, src } : s))
    );
  };

  // Update image
  const updateImage = (id, changes) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...changes } : img))
    );
  };

  // Update text
  const updateText = (id, changes) => {
    setTexts((prev) =>
      prev.map((txt) => (txt.id === id ? { ...txt, ...changes } : txt))
    );
  };

  const addText = () => {
  setTexts((prev) => [
    ...prev,
    {
      id: uuidv4(),
      text: "Double-click to edit",
      x: 50,
      y: 420,
      fontSize: 28,
      fill: "#000",
      fontFamily: "Arial",
      draggable: true
    }
  ]);
};

const removeSelected = () => {
  // If selected is an image → only remove the image, not the slot
  setImages((prev) =>
    prev.map((slot) =>
      slot.id === selectedId ? { ...slot, src: null } : slot
    )
  );

  // Remove text objects normally
  setTexts((prev) => prev.filter((t) => t.id !== selectedId));

  setSelectedId(null);
};
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-6">

        {/* LEFT SIDEBAR ------------------------------------------------------ */}
        <aside className="lg:col-span-3 bg-white p-5 rounded-3xl shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Templates</h2>

          <TemplateList
            templates={TEMPLATES}
            activeTemplateId={activeTemplate.id}
            activeCategory={category}
            onSelectCategory={setCategory}
            onSelectTemplate={(templateId) => {
              const tpl = TEMPLATES.find((t) => t.id === templateId);
              if (tpl) setActiveTemplate(tpl);
            }}
          />

          <hr className="my-4" />

          {/* Export */}
          <div className="flex gap-3">
            <button className="btn w-full" onClick={() => exportStageAsImage(stageRef, "png")}>
              PNG
            </button>
            <button className="btn w-full" onClick={() => exportStageAsImage(stageRef, "jpeg")}>
              JPEG
            </button>
          </div>

          {/* Text / Remove */}
        <div className="flex gap-3 mt-4">
  <button className="btn w-full" onClick={addText}>
    Add Text
  </button>

  <button
    className={`btn w-full ${
      selectedId ? "bg-red-500 text-white" : "bg-gray-300 cursor-not-allowed"
    }`}
    disabled={!selectedId}
    onClick={removeSelected}
  >
    Remove
  </button>
</div>
        </aside>

        {/* CANVAS ----------------------------------------------------------- */}
        <main className="lg:col-span-6 bg-white p-6 rounded-3xl shadow-xl flex items-center justify-center">
          <div
            ref={wrapperRef}
            className="bg-gray-50 rounded-2xl shadow-inner"
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              position: "relative"
            }}
          >
            <Stage
  ref={stageRef}
  width={CANVAS_WIDTH}
  height={CANVAS_HEIGHT}
  onMouseDown={(e) => {
    const clickedEmpty = e.target === e.target.getStage();
    if (clickedEmpty) setSelectedId(null);
  }}
>
              <Layer>
                {/* BG */}
                <Rect
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  fill={activeTemplate.bg}
                  cornerRadius={20}
                />

                {/* IMAGE SLOTS */}
                {images.map((slot) => (
                  <Group
                    key={slot.id}
                    x={slot.x}
                    y={slot.y}
                    clipWidth={slot.width}
                    clipHeight={slot.height}
                    onMouseDown={() => setSelectedId(slot.id)}
                  >
                    <Rect
                      width={slot.width}
                      height={slot.height}
                      stroke={slot.border.color}
                      strokeWidth={slot.border.width}
                      cornerRadius={slot.border.radius}
                      onDrop={(e) => handleDropToSlot(e.evt, slot.id)}
                    />

                    {slot.src ? (
                      <EditableImage
                        shapeProps={slot}
                        onChange={(attrs) => updateImage(slot.id, attrs)}
                      />
                    ) : (
                      <KonvaText x={10} y={10} text="Drop image" fill="#999" />
                    )}
                  </Group>
                ))}

                {/* TEXTS */}
                {texts.map((t) => (
                  <EditableText
                    key={t.id}
                    textProps={t}
                    isSelected={selectedId === t.id}
                    onSelect={() => setSelectedId(t.id)}
                    onChange={(attrs) => updateText(t.id, attrs)}
                  />
                ))}
              </Layer>
            </Stage>

            {/* HTML Add Button Over Slots */}
            {images.map((slot) =>
              !slot.src ? (
                <SlotPlaceholder
                  key={slot.id}
                  left={`${slot.x}px`}
                  top={`${slot.y}px`}
                  width={`${slot.width}px`}
                  height={`${slot.height}px`}
                  onClick={() => handleReplace(slot.id)}
                />
              ) : null
            )}
          </div>
        </main>

        {/* RIGHT PROPERTIES PANEL ------------------------------------------- */}
        <aside className="lg:col-span-3 bg-white p-5 rounded-3x
xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Properties</h2>

          <PropertiesPanel
            selected={selectedId}
            images={images}
            texts={texts}
            updateImage={updateImage}
            updateText={updateText}
            handleReplace={handleReplace}
          />
        </aside>
      </div>
    </div>
  );
}
