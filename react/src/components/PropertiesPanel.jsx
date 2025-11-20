export default function PropertiesPanel({
  selected,
  images,
  texts,
  updateImage,
  updateText,
  handleReplace
}) {
  if (!selected)
    return <p className="text-gray-500">Select an item to edit</p>;

  const img = images.find((i) => i.id === selected);
  const txt = texts.find((t) => t.id === selected);

  return (
    <div className="space-y-6">

      {/* ================= IMAGE PROPERTIES ================= */}
      {img && (
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Image Settings</h3>

          {/* Scale / Zoom */}
          <label className="text-sm text-gray-700">Zoom</label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.01"
            value={img.scale}
            onChange={(e) =>
              updateImage(img.id, { scale: Number(e.target.value) })
            }
            className="w-full mb-3"
          />

          {/* Offset X */}
          <label className="text-sm text-gray-700">Move Left / Right</label>
          <input
            type="range"
            min={-img.width}
            max={img.width}
            step="1"
            value={img.offsetX ?? 0}
            onChange={(e) =>
              updateImage(img.id, { offsetX: Number(e.target.value) })
            }
            className="w-full mb-3"
          />

          {/* Offset Y */}
          <label className="text-sm text-gray-700">Move Up / Down</label>
          <input
            type="range"
            min={-img.height}
            max={img.height}
            step="1"
            value={img.offsetY ?? 0}
            onChange={(e) =>
              updateImage(img.id, { offsetY: Number(e.target.value) })
            }
            className="w-full mb-3"
          />

          {/* Rotation */}
          <label className="text-sm text-gray-700">Rotation</label>
          <input
            type="range"
            min="0"
            max="360"
            value={img.rotation ?? 0}
            onChange={(e) =>
              updateImage(img.id, { rotation: Number(e.target.value) })
            }
            className="w-full mb-3"
          />

          {/* Fit Mode */}
          <label className="text-sm text-gray-700">Fit Mode</label>
          <select
            className="w-full border rounded px-2 py-1 mt-1 mb-3"
            value={img.fitMode || "cover"}
            onChange={(e) =>
              updateImage(img.id, { fitMode: e.target.value })
            }
          >
            <option value="cover">Cover (fill slot)</option>
            <option value="contain">Contain (show full image)</option>
          </select>

          {/* Border Width */}
          <label className="text-sm text-gray-700">Border Width</label>
          <input
            type="range"
            min="0"
            max="20"
            value={img.border.width}
            onChange={(e) =>
              updateImage(img.id, {
                border: { ...img.border, width: Number(e.target.value) }
              })
            }
            className="w-full mb-3"
          />

          {/* Border Color */}
          <label className="text-sm text-gray-700">Border Color</label>
          <input
            type="color"
            value={img.border.color}
            onChange={(e) =>
              updateImage(img.id, {
                border: { ...img.border, color: e.target.value }
              })
            }
            className="w-full mb-3 mt-1"
          />

          {/* Replace Button */}
          <button
            className="btn w-full mt-2"
            onClick={() => handleReplace(img.id)}
          >
            Replace Image
          </button>
        </div>
      )}

      {/* ================= TEXT PROPERTIES ================= */}
      {txt && (
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Text Settings</h3>

          {/* Content */}
          <label className="text-sm text-gray-700">Text</label>
          <input
            className="w-full border rounded px-2 py-1 mt-1 mb-3"
            value={txt.text}
            onChange={(e) => updateText(txt.id, { text: e.target.value })}
          />

          {/* Font size */}
          <label className="text-sm text-gray-700">Font Size</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1 mt-1 mb-3"
            value={txt.fontSize}
            onChange={(e) =>
              updateText(txt.id, { fontSize: Number(e.target.value) })
            }
          />

          {/* Color */}
          <label className="text-sm text-gray-700">Color</label>
          <input
            type="color"
            className="mt-2 mb-3"
            value={txt.fill}
            onChange={(e) => updateText(txt.id, { fill: e.target.value })}
          />

          <label className="block text-sm">Brightness</label>
<input
  type="range"
  min="-1"
  max="1"
  step="0.05"
  value={img.brightness}
  onChange={(e) => updateImage(img.id, { brightness: Number(e.target.value) })}
/>

<label className="block text-sm mt-2">Contrast</label>
<input
  type="range"
  min="-1"
  max="1"
  step="0.05"
  value={img.contrast}
  onChange={(e) => updateImage(img.id, { contrast: Number(e.target.value) })}
/>

<label className="block text-sm mt-2">Saturation</label>
<input
  type="range"
  min="-1"
  max="1"
  step="0.05"
  value={img.saturation}
  onChange={(e) =>
    updateImage(img.id, { saturation: Number(e.target.value) })
  }
/>

<label className="block text-sm mt-2">Blur</label>
<input
  type="range"
  min="0"
  max="20"
  step="1"
  value={img.blur}
  onChange={(e) => updateImage(img.id, { blur: Number(e.target.value) })}
/>

<div className="flex items-center gap-2 mt-2">
  <input
    type="checkbox"
    checked={img.grayscale}
    onChange={(e) => updateImage(img.id, { grayscale: e.target.checked })}
  />
  <label>Grayscale</label>
</div>

<div className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={img.sepia}
    onChange={(e) => updateImage(img.id, { sepia: e.target.checked })}
  />
  <label>Sepia</label>
</div>

        </div>
      )}
    </div>
  );
}
