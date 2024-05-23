"use client";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import AddGroupTransactionForm from "./addGroupTransactionForm";

interface AddRecordButtonProps {
  groupId: string;
}

export default function AddRecordButton({ groupId }: AddRecordButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        style={{
          position: "fixed",
          bottom: "58px",
          right: "15px",
          border: "none",
          background: "none",
          cursor: "pointer",
          padding: "0",
        }}
        onClick={handleOpenModal}
      >
        <FiPlusCircle size={45} />
      </Button>
      <AddGroupTransactionForm
        mode="create"
        isOpen={isOpen}
        onClose={handleCloseModal}
        groupId={groupId}
      />
    </>
  );
}
