"use client";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import AddGroupTransactionForm from "./addGroupTransactionForm";
import ReadGroupTransactionForm from "./readGroupTransactionForm";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AddRecordButtonProps {
  name: string;
  members: Array<User>;
  groupId: string;
}

export default function AddRecordButton({
  name,
  members,
  groupId,
}: AddRecordButtonProps) {
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
      {/* <ReadGroupTransactionForm
        isOpen={isOpen}
        onClose={handleCloseModal}
        members={members}
        groupId={groupId}
        name={name}
        transactionId="663f087f64b4714197f67840"
      /> */}
      <AddGroupTransactionForm
        mode="create"
        isOpen={isOpen}
        onClose={handleCloseModal}
        name={name}
        members={members}
        groupId={groupId}
      />
    </>
  );
}
