import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const ProjectCard = ({ project, onEdit }: { project: any; onEdit: any }) => {
  const { mutate: deleteProject, isLoading } = useConvexMutation(
    api.project.deleteProjects,
  );

  const lastUpdated = formatDistanceToNow(new Date(project.updatedAt), {
    addSuffix: true,
  });
  const handelDelete = async () => {};

  return (
    <Card className="group relative overflow-hidden pt-0 transition-all duration-200 hover:scale-[1.02] hover:transform hover:border-white/20">
      <div className="relative aspect-video">
        {project.thumbnailUrl && (
          <Image
            src={project.thumbnailUrl}
            width={600}
            height={400}
            alt="projcet"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <CardContent>
        <p className="mb-1 truncate">{project.title}</p>
        <Badge>
          {project.width}x{project.height}
        </Badge>
        <p className="text-muted-foreground mt-2 text-xs">{lastUpdated}</p>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-center gap-3">
          <Button
            onClick={handelDelete}
            disabled={isLoading}
            variant={"destructive"}
          >
            <Trash /> Delete
          </Button>
          <Button onClick={onEdit} variant={"outline"}>
            <Edit /> Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
