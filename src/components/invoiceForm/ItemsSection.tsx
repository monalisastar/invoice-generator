"use client";

import React from "react";
import { X, Plus } from "lucide-react";
import { LineItem } from "./index"; // ✅ correct import

interface Props {
  items: LineItem[];
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, updated: Partial<LineItem>) => void;
  currency?: string;
}

export default function ItemsSection({
  items,
  addItem,
  removeItem,
  updateItem,
  currency = "KES",
}: Props) {
  return (
    <section className="border border-gray-200 rounded-2xl p-5 space-y-4 bg-white/60 backdrop-blur-md shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">🧾 Items</h2>

      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row md:items-center gap-3"
        >
          {/* Description */}
          <input
            type="text"
            placeholder="Description"
            value={item.description}
            onChange={(e) =>
              updateItem(index, { description: e.target.value })
            }
            className="border p-2 rounded w-full md:flex-1"
          />

          {/* Quantity */}
          <input
            type="number"
            min={1}
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) =>
              updateItem(index, { quantity: Number(e.target.value) })
            }
            className="border p-2 rounded w-full md:w-24"
          />

          {/* Price */}
          <input
            type="number"
            min={0}
            placeholder={`Price (${currency})`}
            value={item.price}
            onChange={(e) =>
              updateItem(index, { price: Number(e.target.value) })
            }
            className="border p-2 rounded w-full md:w-32"
          />

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
          >
            <X size={14} /> Remove
          </button>
        </div>
      ))}

      {/* Add Item Button */}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center justify-center gap-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        <Plus size={16} /> Add Item
      </button>
    </section>
  );
}
