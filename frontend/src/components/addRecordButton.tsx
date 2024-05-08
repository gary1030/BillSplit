"use client";
import { useState } from "react";
import { MdOutlineAddBox } from "react-icons/md";
import { Button } from "@chakra-ui/react";
import GroupTransactionForm from "./groupTransactionForm";

export default function AddRecordButton() {
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
          bottom: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "none",
          background: "none",
          cursor: "pointer",
          width: "120px",
          height: "150px",
        }}
        onClick={handleOpenModal}
      >
        <MdOutlineAddBox size={40} />
        <span style={{ marginTop: "3px" }}>Add a record</span>
      </Button>
      <GroupTransactionForm
        isOpen={isOpen}
        onClose={handleCloseModal}
        mode="create"
      />
    </>
  );
}
