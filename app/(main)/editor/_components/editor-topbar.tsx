"use client";
import UpgradeModel from "@/components/common/upgrade-model";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useCanvas } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { usePlanAccess } from "@/hooks/use-plan-access";
import { Project, ToolId } from "@/utils/types";
import {
  Crop,
  Expand,
  Sliders,
  Palette,
  Maximize2,
  Text,
  Eye,
  ArrowLeft,
  Lock,
  RotateCcw,
  RotateCw,
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, ElementType } from "react";

const TOOLS: {
  id: ToolId;
  label: string;
  icon: ElementType;
  proOnly?: boolean;
}[] = [
  {
    id: "resize",
    label: "Resize",
    icon: Expand,
  },
  {
    id: "crop",
    label: "Crop",
    icon: Crop,
  },
  {
    id: "adjust",
    label: "Adjust",
    icon: Sliders,
  },
  {
    id: "text",
    label: "Text",
    icon: Text,
  },
  {
    id: "background",
    label: "AI Background",
    icon: Palette,
    proOnly: true,
  },
  {
    id: "ai_extender",
    label: "AI Image Extender",
    icon: Maximize2,
    proOnly: true,
  },
  {
    id: "ai_edit",
    label: "AI Editing",
    icon: Eye,
    proOnly: true,
  },
];

const EXPORT_FORMATS = [
  {
    format: "PNG",
    quality: 1.0,
    label: "PNG (High Quality)",
    extension: "png",
  },
  {
    format: "JPEG",
    quality: 0.9,
    label: "JPEG (90% Quality)",
    extension: "jpg",
  },
  {
    format: "JPEG",
    quality: 0.8,
    label: "JPEG (80% Quality)",
    extension: "jpg",
  },
  {
    format: "WEBP",
    quality: 0.9,
    label: "WebP (90% Quality)",
    extension: "webp",
  },
];

const EditorTopbar = ({ project }: { project: Project }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [restrictedTool, setRestrictedTool] = useState<string | null>(null);

  const {
    activeTool,
    onToolChange,
    canvasEditor,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    isSaving,
  } = useCanvas();
  const { hasAccess, canExport, isFree } = usePlanAccess();
  const router = useRouter();

  const { mutate: updateProject, isLoading: isUpdatingProject } = useConvexMutation(
    api.project.updateProject,
  );

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const handleToolChange = (toolId: ToolId) => {
    if (!hasAccess(toolId)) {
      setRestrictedTool(toolId);
      setShowUpgradeModal(true);
      return;
    }
    onToolChange(toolId);
  };


 
  return (
    <>
      <div className="border-b px-6 py-4 dark:bg-neutral-950/80">
        <div className="mb-3 flex items-center justify-between">
          <Button
            variant={"custom"}
            size={"sm"}
            onClick={handleBackToDashboard}
          >
            <ArrowLeft /> All Projects
          </Button>
          <h2 className="capitalize">{project.title}</h2>
          <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={reset}
                          disabled={isSaving || !project.originalImageUrl}
                          className="gap-2"
                        >              <RefreshCcw />
              Reset
            </Button>
            <ModeToggle />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {TOOLS.map((tools) => {
              const Icon = tools.icon;
              const isActive = activeTool === tools.id;
              const hasToolAccess = hasAccess(
                tools.id
              );
              return (
                <Button
                  key={tools.id}
                  variant={isActive ? "default" : "secondary"}
                  size="sm"
                  className={`text-sm ${!hasToolAccess ? "opacity-60" : ""}`}
                  onClick={() => handleToolChange(tools.id)}
                >
                  <Icon />
                  {tools.label}
                  {tools.proOnly && !hasToolAccess && <Lock />}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className={`transition-colors duration-200 hover:bg-neutral-200/90`}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              className={`transition-colors duration-200 hover:bg-neutral-200/50`}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <UpgradeModel
        isOpen={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false);
          setRestrictedTool(null);
        }}
        restrictedTool={restrictedTool || ""}
        reason="This tool is only available for Pro users."
      />
    </>
  );
};

export default EditorTopbar;
