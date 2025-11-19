/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Dot,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

const PRIMARY = "#DC3173";
const BG = "#FFF2F8";
const SHADOW =
  "0px 6px 24px rgba(0,0,0,0.06), inset 0px 0px 10px rgba(0,0,0,0.03)";

// Initial static groups
const STATIC_GROUPS = [
  {
    id: "g1",
    title: "Extra Cheese",
    maxSelect: 1,
    required: false,
    addons: [
      { name: "Cheddar", price: 1.2 },
      { name: "Mozzarella", price: 1.0 },
      { name: "Double Cheese Mix", price: 1.5 },
    ],
  },
  {
    id: "g2",
    title: "Sauces",
    maxSelect: 2,
    required: false,
    addons: [
      { name: "Garlic Mayo", price: 0.5 },
      { name: "Thai Spicy", price: 0.6 },
      { name: "BBQ Sauce", price: 0.4 },
    ],
  },
];

export default function VendorAddonsPage() {
  const [groups, setGroups] = useState(STATIC_GROUPS);
  const [query, setQuery] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newMax, setNewMax] = useState(1);
  const [newRequired, setNewRequired] = useState(false);

  const [addonName, setAddonName] = useState("");
  const [addonPrice, setAddonPrice] = useState("");

  const [activeGroup, setActiveGroup] = useState<any>(null);

  const filtered = groups.filter((g) =>
    g.title.toLowerCase().includes(query.toLowerCase())
  );

  const addGroup = () => {
    if (!newTitle) return;

    setGroups((prev) => [
      ...prev,
      {
        id: "g" + Date.now(),
        title: newTitle,
        maxSelect: newMax,
        required: newRequired,
        addons: [],
      },
    ]);

    setNewTitle("");
    setNewMax(1);
    setNewRequired(false);
  };

  const addAddon = (groupId: string) => {
    if (!addonName || !addonPrice) return;

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              addons: [
                ...g.addons,
                { name: addonName, price: Number(addonPrice) },
              ],
            }
          : g
      )
    );

    setAddonName("");
    setAddonPrice("");
    setActiveGroup(null);
  };

  const deleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-4xl font-extrabold tracking-tight"
              style={{ color: PRIMARY }}
            >
              Addons & Extras
            </h1>
          </div>

          {/* Add Group Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="flex items-center gap-2"
                style={{ background: PRIMARY }}
              >
                <Plus size={18} /> Add Group
              </Button>
            </SheetTrigger>

            <SheetContent className="p-6">
              <SheetHeader>
                <SheetTitle>Add Addon Group</SheetTitle>
              </SheetHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Label>Group Title</Label>
                  <Input
                    placeholder="e.g. Drinks Upgrade"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Max Select</Label>
                  <Input
                    type="number"
                    value={newMax}
                    onChange={(e) => setNewMax(Number(e.target.value))}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRequired}
                    onChange={() => setNewRequired((v) => !v)}
                  />
                  <span>Required selection?</span>
                </div>
              </div>

              <SheetFooter className="mt-6">
                <Button
                  className="w-full"
                  style={{ background: PRIMARY }}
                  onClick={addGroup}
                >
                  Save
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* SEARCH */}
        <Input
          placeholder="Search addon group..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />

        {/* GROUP LIST */}
        <div className="space-y-6 pt-2">
          <AnimatePresence>
            {filtered.map((group) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 170, damping: 16 }}
              >
                <Card
                  className="border bg-white rounded-3xl overflow-hidden"
                  style={{ boxShadow: SHADOW }}
                >
                  <CardContent className="p-0">

                    {/* GROUP HEADER */}
                    <div className="flex items-center justify-between p-5 border-b">
                      <div>
                        <h2 className="text-xl font-bold">{group.title}</h2>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <span>Max:</span>
                          <span className="font-medium text-gray-800">
                            {group.maxSelect}
                          </span>

                          {group.required ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                              Required
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                              Optional
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* ADD ADDON BUTTON */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => setActiveGroup(group)}
                        >
                          <Plus size={16} /> Add Addon
                        </Button>

                        {/* EDIT */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Edit size={16} /> Edit
                        </Button>

                        {/* DELETE */}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => deleteGroup(group.id)}
                        >
                          <Trash2 size={16} /> Delete
                        </Button>
                      </div>
                    </div>

                    {/* ADDONS LIST */}
                    <div className="p-5 space-y-3">
                      {group.addons.map((a, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 rounded-2xl border bg-white"
                          style={{
                            boxShadow:
                              "inset 0px 0px 8px rgba(0,0,0,0.03), 0px 4px 12px rgba(0,0,0,0.04)",
                          }}
                        >
                          <div className="flex items-center gap-2 text-gray-800">
                            <Dot size={24} className="text-gray-400" />
                            <span className="text-base font-medium">
                              {a.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              €{a.price.toFixed(2)}
                            </span>
                            <CheckCircle
                              size={18}
                              className="text-green-500 opacity-70"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ADD ADDON SHEET */}
      <Sheet open={!!activeGroup} onOpenChange={() => setActiveGroup(null)}>
        <SheetContent className="p-6">
          <SheetHeader>
            <SheetTitle>Add Addon to {activeGroup?.title}</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="e.g. Extra Spicy"
                value={addonName}
                onChange={(e) => setAddonName(e.target.value)}
              />
            </div>

            <div>
              <Label>Price (€)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={addonPrice}
                onChange={(e) => setAddonPrice(e.target.value)}
              />
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button
              className="w-full"
              style={{ background: PRIMARY }}
              onClick={() => addAddon(activeGroup.id)}
            >
              Save Addon
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
