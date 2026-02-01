"use client";
import { useCanvas } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { Project } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";

const CanvasEditor = ({ project }: { project: Project }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { canvasEditor, setCanvasEditor, activeTool, onToolChange } =
    useCanvas();

  const { mutate: updateProject } = useConvexMutation(
    api.project.updateProject,
  );

  const calculateViewportScale = () => {
    if (!containerRef.current || !project) return 1;
    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;
    const scaleX = containerWidth / project.width;
    const scaleY = containerHeight / project.height;
    return Math.min(scaleX, scaleY, 1);
  };

  useEffect(() => {
    if (!canvasRef.current || !project || canvasEditor) return;

    const initilizeCanvas = async () => {
      setIsLoading(true);

      const viewportscale = calculateViewportScale();

      const canvas = new Canvas(canvasRef.current!, {
        width: project.width,
        height: project.height,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
        controlsAboveOverlay: true,
        selection: true,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
        allowTouchScrolling: false,
        renderOnAddRemove: true,
        skipTargetFind: false,
      });
      canvas.setDimensions(
        {
          width: project.width * viewportscale,
          height: project.height * viewportscale,
        },
        { backstoreOnly: false },
      );

      canvas.setZoom(viewportscale);
    };
  }, [project]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #64748b 25%, transparent 25%),
            linear-gradient(-45deg, #64748b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #64748b 75%),
            linear-gradient(-45deg, transparent 75%, #64748b 75%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-800/80">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-400"></div>
            <p className="text-sm text-white/70">Loading Canvas</p>
          </div>
        </div>
      )}
      <div className="px-5">
        <canvas id="canvas" className="border" ref={canvasRef} />
      </div>
    </div>
  );
};

export default CanvasEditor;
