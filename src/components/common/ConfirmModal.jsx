import { CircleHelp } from "lucide-react";
import React from "react";

const ConfirmModal = ({ modalId, onConfirm, buttonColor = "red", buttonText = "Confirm" }) => {
    return (
        <dialog id={modalId} className="modal">
            <div className="modal-box">
                <h1 className="font-bold text-lg flex items-center gap-2">
                    <CircleHelp className="w-8 h-8" />
                    Confirmation
                </h1>
                <p className="py-4">This action cannot be undone. Are you sure you want to proceed?</p>
                <div className="modal-action">
                    <form method="dialog" className="flex gap-2">
                        <button className="btn">Cancel</button>
                        <button
                            type="button"
                            className={`btn min-w-[100px] text-white ${buttonColor} border-none`}
                            onClick={onConfirm}
                        >
                            {buttonText}
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default ConfirmModal;
