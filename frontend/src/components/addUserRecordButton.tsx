"use client";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import AddPersonalTransactionForm from "./addPersonalTransactionForm";
import ReadPersonalTransactionForm from "./readPersonalTransactionForm";

interface AddRecordButtonProps {
  userId: string;
}

export default function AddRecordButton({ userId }: AddRecordButtonProps) {
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
          bottom: "50px",
          right: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "none",
          background: "none",
          cursor: "pointer",
          width: "100px",
          height: "70px",
          padding: "0",
        }}
        onClick={handleOpenModal}
      >
        <FiPlusCircle size={40} />
        <span style={{ marginTop: "3px" }}>Add a record</span>
      </Button>
      <AddPersonalTransactionForm
        mode="create"
        isOpen={isOpen}
        onClose={handleCloseModal}
        userId={userId}
      />
    </>
  );
}
