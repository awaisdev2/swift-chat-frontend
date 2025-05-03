import React from "react";
import { X } from "lucide-react";

interface GenericModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  showCloseIcon?: boolean;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const modalWidth = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
};

const GenericModal: React.FC<GenericModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  showCloseIcon = true,
  footer,
  size = "md",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`bg-white rounded-lg shadow-lg w-full ${modalWidth[size]}`}
      >
        {(title || showCloseIcon) && (
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {showCloseIcon && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-900"
              >
                <X />
              </button>
            )}
          </div>
        )}

        <div className="p-4">{children}</div>

        {footer && <div className="p-4 border-t border-gray-200">{footer}</div>}
      </div>
    </div>
  );
};

export default GenericModal;
