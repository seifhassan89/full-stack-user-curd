import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteUserDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending
}: DeleteUserDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="modal-fade-in">
        <AlertDialogHeader className="flex flex-row items-start space-x-4">
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <AlertDialogTitle>Delete user</AlertDialogTitle>
            <AlertDialogDescription className="mt-2">
              Are you sure you want to delete this user? All of their data will be permanently removed.
              This action cannot be undone.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
