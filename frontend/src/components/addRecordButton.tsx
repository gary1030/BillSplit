"use client";

import { MdOutlineAddBox } from "react-icons/md";
import { Button } from "@chakra-ui/react";

export default function AddRecordButton() {
  return (
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
    >
      <MdOutlineAddBox size={40} />
      <span style={{ marginTop: "3px" }}>Add a record</span>
    </Button>
  );
}
