"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Wand2,
  Info,
  Sparkles,
  User,
  Mountain,
  CheckCircle,
  AlertTriangle,
  Camera,
} from "lucide-react";
import { useCanvas } from "@/context/context";
import fabric, { FabricImage } from "fabric";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Project } from "@/utils/types";

const RETOUCH_PRESETS = [
  {
    key: "ai_retouch",
    label: "AI Retouch",
    description: "Improve image quality with AI",
    icon: Sparkles,
    transform: "e-retouch",
    recommended: true,
  },
  {
    key: "ai_upscale",
    label: "AI Upscale",
    description: "Increase resolution to 16MP",
    icon: User,
    transform: "e-upscale",
    recommended: false,
  },
  {
    key: "enhance_sharpen",
    label: "Enhance & Sharpen",
    description: "AI retouch + contrast + sharpening",
    icon: Mountain,
    transform: "e-retouch,e-contrast,e-sharpen",
    recommended: false,
  },
  {
    key: "premium_quality",
    label: "Premium Quality",
    description: "AI retouch + upscale + enhancements",
    icon: Camera,
    transform: "e-retouch,e-upscale,e-contrast,e-sharpen",
    recommended: false,
  },
];

export function AIEdit({ project }: { project: Project }) {
  const { canvasEditor, setProcessingMessage } = useCanvas();
  const [selectedPreset, setSelectedPreset] = useState("ai_retouch"); // Fixed default
  const { mutate: updateProject } = useConvexMutation(
    api.project.updateProject,
  );

  const getMainImage = (): fabric.Image | null =>
    (canvasEditor
      ?.getObjects()
      .find((obj: fabric.Object) => obj.type === "image") as fabric.Image) ||
    null;

  const buildRetouchUrl = (imageUrl: string, presetKey: string) => {
    const preset = RETOUCH_PRESETS.find((p) => p.key === presetKey);
    if (!imageUrl || !preset) return imageUrl;

    const [baseUrl, existingQuery] = imageUrl.split("?");

    if (existingQuery) {
      const params = new URLSearchParams(existingQuery);
      const existingTr = params.get("tr");

      if (existingTr) {
        // Append retouch to existing transformations
        return `${baseUrl}?tr=${existingTr},${preset.transform}`;
      }
    }

    // No existing transformations, create new
    return `${baseUrl}?tr=${preset.transform}`;
  };

  const applyRetouch = async () => {
    const mainImage = getMainImage();
    const selectedPresetData = RETOUCH_PRESETS.find(
      (p) => p.key === selectedPreset,
    );

    if (!mainImage || !project || !selectedPresetData) return;

    setProcessingMessage(`Enhancing image with ${selectedPresetData.label}...`);

    try {
      const currentImageUrl =
        mainImage.getSrc() || (mainImage as any)._element?.src;
      if (!currentImageUrl) {
        throw new Error("Could not get image source URL.");
      }
      const retouchedUrl = buildRetouchUrl(currentImageUrl, selectedPreset);

      const retouchedImage = await FabricImage.fromURL(retouchedUrl, {
        crossOrigin: "anonymous",
      });

      // Preserve current image properties
      const imageProps = {
        left: mainImage.left,
        top: mainImage.top,
        originX: mainImage.originX,
        originY: mainImage.originY,
        angle: mainImage.angle,
        scaleX: mainImage.scaleX,
        scaleY: mainImage.scaleY,
        selectable: true,
        evented: true,
      };

      // Replace image
      canvasEditor.remove(mainImage);
      retouchedImage.set(imageProps);
      canvasEditor.add(retouchedImage);
      retouchedImage.setCoords();
      canvasEditor.setActiveObject(retouchedImage);
      canvasEditor.requestRenderAll();

      // Update project
      await updateProject({
        projectId: project._id,
        currentImageUrl: retouchedUrl,
        canvasState: canvasEditor.toJSON(),
        activeTransformation: selectedPresetData.transform,
      });
    } catch (error) {
      console.error("Error retouching image:", error);
      alert("Failed to retouch image. Please try again.");
    } finally {
      setProcessingMessage(null);
    }
  };

  // Early returns
  if (!canvasEditor) {
    return <div className="p-4 text-sm text-white/70">Canvas not ready</div>;
  }

  const mainImage = getMainImage();
  if (!mainImage) {
    return (
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <h3 className="mb-1 font-medium text-amber-400">No Image Found</h3>
            <p className="text-sm text-amber-300/80">
              Please add an image to the canvas first to use AI retouching.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasActiveTransformations =
    project?.activeTransformation?.includes("e-retouch");
  const selectedPresetData = RETOUCH_PRESETS.find(
    (p) => p.key === selectedPreset,
  );

  return (
    <div className="space-y-6">
      {/* Status Indicator */}
      {hasActiveTransformations && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
            <div>
              <h3 className="mb-1 font-medium text-green-400">
                Image Enhanced
              </h3>
              <p className="text-sm text-green-300/80">
                AI enhancements have been applied to this image
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preset Selection */}
      <div>
        <h3 className="mb-3 text-sm font-medium">Choose Enhancement Style</h3>
        <div className="grid grid-cols-2 gap-3">
          {RETOUCH_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedPreset === preset.key;

            return (
              <div
                key={preset.key}
                className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                  isSelected
                    ? "border-primary bg-neutral-400/10"
                    : "border-black/15 bg-white hover:border-white/40 dark:border-white/20 dark:bg-neutral-900/30"
                }`}
                onClick={() => setSelectedPreset(preset.key)}
              >
                <div className="flex flex-col items-center text-center">
                  <Icon className="text-primary mb-2 h-8 w-8" />
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="text-sm font-medium">{preset.label}</h4>
                    {preset.recommended && (
                      <span className="bg-primary rounded-full px-1.5 py-0.5 text-xs text-white dark:text-black">
                        ★
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-70">{preset.description}</p>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="h-3 w-3 rounded-full bg-cyan-400"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Apply Button */}
      <Button onClick={applyRetouch} className="w-full" variant="default">
        <Wand2 className="mr-2 h-4 w-4" />
        Apply {selectedPresetData?.label}
      </Button>

      {/* Information */}
      <div className="rounded-lg border-transparent bg-neutral-200/40 p-4 ring ring-black/10 dark:bg-slate-700/30">
        <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Info className="h-4 w-4" />
          How AI Retouch Works
        </h4>
        <div className="space-y-2 text-xs opacity-70">
          <p>
            • <strong>AI Retouch:</strong> AI analyzes and applies optimal
            improvements
          </p>
          <p>
            • <strong>Smart Processing:</strong> Preserves details while
            enhancing quality
          </p>
          <p>
            • <strong>Multiple Styles:</strong> Choose enhancement that fits
            your image
          </p>
          <p>
            • <strong>Instant Results:</strong> See improvements in seconds
          </p>
        </div>
      </div>
    </div>
  );
}
