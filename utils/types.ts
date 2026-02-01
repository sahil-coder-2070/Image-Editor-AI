import { Dispatch, SetStateAction } from "react";
import { Id } from "../convex/_generated/dataModel";

export type UpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  restrictedTool: string;
  reason: string;
};

export type Project = {
  _id: Id<"project">;
  title: string;
  userId: Id<"users">;
  canvasState: unknown;
  width: number;
  height: number;
  originalImageUrl?: string;
  currentImageUrl?: string;
  thumbnailUrl?: string;
  createdAt: number;
  updatedAt: number;
};

export type User = {
  _id: Id<"users">;
  _creationTime: number; // Convex adds this automatically
  name: string;
  tokenIdentifier: string;
  email: string;
  plan: "free" | "pro";
  projectUsed: number;
  exportProjectThisMonth: number;
  createdAt: number;
  lastActive: number;
  imageUrl?: string; // optional
};

export type UpdateDate = {
  updateAt: number;
  canvasState?: unknown;
  width?: number;
  height?: number;
  currentImageUrl?: string;
  thumbnailUrl?: string;
  activeTransformation?: string;
  backgroundRemove?: boolean;
};



export type CanvasContextType = {
  canvasEditor: any; 
  setCanvasEditor: Dispatch<SetStateAction<any>>;
  activeTool: string;
  processingMessage: string | null;
  setProcessingMessage: Dispatch<SetStateAction<string | null>>;
  onToolChange: Dispatch<SetStateAction<string>>;
};