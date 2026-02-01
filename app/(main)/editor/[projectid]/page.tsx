"use client";
import { CanvasContext } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Monitor } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const Editor = () => {
  const { projectid } = useParams();
  const [canvasEditor, setCanvasEditor] = useState<any>(null);
  const [processingMessage, setProcessingMessage] = useState<string | null>(
    null,
  );
  const [activeTool, setActiveTool] = useState<string>("resize");

  const {
    data: project,
    isLoading,
    error,
  } = useConvexQuery(api.project.getProject, { projectid });

  return (
    <CanvasContext.Provider
      value={{
        canvasEditor,
        setCanvasEditor,
        activeTool,
        processingMessage,
        setProcessingMessage,
        onToolChange: setActiveTool,
      }}
    >
      <div className="flex min-h-screen items-center justify-center text-center lg:hidden">
        <div>
          <Monitor className="mx-auto mb-5 h-16 w-16" />
          <h2 className="text-4xl">Desktop Required</h2>
          <p className="text-sm opacity-80">
            Please use a larger screen to access the full editing experience
          </p>
        </div>
      </div>
      <div className="hidden lg:block">editor {projectid}</div>
    </CanvasContext.Provider>
  );
};

export default Editor;
