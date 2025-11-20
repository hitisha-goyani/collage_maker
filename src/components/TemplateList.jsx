// src/components/TemplateList.jsx
import React from "react";

export default function TemplateList({
  templates,
  activeTemplateId,
  activeCategory,
  onSelectCategory,
  onSelectTemplate
}) {
  // derive categories from templates to keep it dynamic
  const categories = Array.from(
    new Set(templates.map((t) => t.category || "others"))
  );

  return (
    <div>
      {/* Category buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1 rounded-lg text-sm ${
              activeCategory === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 gap-3">
        {templates
          .filter((t) => t.category === activeCategory)
          .map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTemplate(t.id)}
              className={`w-full text-left p-2 border rounded-lg hover:shadow-md flex items-center gap-3 ${
                activeTemplateId === t.id ? "ring-2 ring-blue-400" : ""
              }`}
            >
              {/* Simple thumbnail: show a small grid box using first 3 slots */}
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                {/* render tiny preview rectangles using inline styles */}
                {t.slots.slice(0, 4).map((s, i) => {
                  const left = `${s.x * 0.8 * 100}%`;
                  const top = `${s.y * 0.8 * 100}%`;
                  const w = `${s.width * 0.8 * 100}%`;
                  const h = `${s.height * 0.8 * 100}%`;
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left,
                        top,
                        width: w,
                        height: h,
                        background: "#ddd",
                        borderRadius: 4,
                        boxSizing: "border-box",
                        border: "1px solid rgba(255,255,255,0.6)"
                      }}
                    />
                  );
                })}
              </div>

              <div>
                <div className="text-sm font-medium">{t.title}</div>
                <div className="text-xs text-gray-500">{t.slots.length} slots</div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
