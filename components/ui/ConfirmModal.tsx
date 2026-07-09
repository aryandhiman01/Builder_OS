"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

interface ConfirmModalProps {
  open: boolean;

  title: string;

  description: string;

  confirmText?: string;

  cancelText?: string;

  loading?: boolean;

  danger?: boolean;

  onConfirm: () => void;

  onClose: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  danger = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {

  const modalRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!open) return;

    function handleKeyDown(
      event: KeyboardEvent
    ) {

      if (
        event.key === "Escape" &&
        !loading
      ) {
        onClose();
      }

    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [open, loading, onClose]);

  if (!open) {
    return null;
  }

  function handleBackdropClick(
    event: React.MouseEvent<HTMLDivElement>
  ) {

    if (
      modalRef.current === event.target &&
      !loading
    ) {
      onClose();
    }

  }

    return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/70
      backdrop-blur-sm
      "
    >

      <div
        className="
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/10
        bg-[#090909]
        p-8
        shadow-2xl
        "
      >

        {/* Header */}

        <div className="flex items-start justify-between">

          <div className="flex items-start gap-4">

            <div
              className={`
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl

              ${
                danger
                  ? "bg-red-500/10 text-red-400"
                  : "bg-blue-500/10 text-blue-400"
              }
              `}
            >

              <AlertTriangle size={22} />

            </div>

            <div>

              <h2
                className="
                text-xl
                font-bold
                text-white
                "
              >
                {title}
              </h2>

              <p
                className="
                mt-2
                text-sm
                leading-6
                text-zinc-500
                "
              >
                {description}
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="
            rounded-xl
            p-2
            text-zinc-500
            transition
            hover:bg-white/5
            hover:text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
            "
          >
            <X size={18} />
          </button>

        </div>

                {/* Footer */}

        <div
          className="
          mt-8
          flex
          justify-end
          gap-4
          "
        >

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
            rounded-2xl
            border
            border-white/10
            px-5
            py-3
            font-medium
            text-zinc-300
            transition
            hover:bg-white/5
            disabled:cursor-not-allowed
            disabled:opacity-50
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            px-6
            py-3
            font-semibold
            transition
            disabled:cursor-not-allowed
            disabled:opacity-50

            ${
              danger
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white text-black hover:bg-zinc-200"
            }
            `}
          >

            {loading ? (

              <>

                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Processing...

              </>

            ) : (

              confirmText

            )}

          </button>

        </div>

      </div>

    </div>
  );
}