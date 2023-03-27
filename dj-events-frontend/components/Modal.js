import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import styles from "@/styles/Modal.module.css";
import Link from "next/link";

export default function Modal({ show, onClose, children, title }) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => setIsBrowser(true));

  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <Link href="#" onClick={handleClose}>
            <FaTimes />
          </Link>
        </div>
        {title && <div>{title}</div>}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return createPortal(modalContent, document.getElementById("modal-root"));
  } else {
    return null;
  }
}
