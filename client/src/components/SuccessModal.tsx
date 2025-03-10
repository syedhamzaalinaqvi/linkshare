import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center">Success!</DialogTitle>
          <DialogDescription className="text-center">
            Your WhatsApp group has been submitted successfully. It will be reviewed and published shortly.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center sm:justify-center">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
