import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  disableBtns?: boolean;
  showCloseIcon?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  disableBtns = false,
  showCloseIcon = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {showCloseIcon && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X />
            </button>
          )}
        </div>
        <div className="px-6 py-4 text-sm text-gray-600">{description}</div>
        <div className="flex justify-end px-6 py-4 space-x-2 border-t border-gray-200">
          <Button className='bg-gray-400 hover:bg-gray-300 transition-all hover:text-black text-white' onClick={onCancel} disabled={disableBtns}>
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={disableBtns}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
