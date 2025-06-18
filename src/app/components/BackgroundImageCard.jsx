import React from "react";
import styles from "./BackgroundImageCard.module.css";

const BackgroundImageCard = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>🎨 Background Image Component</h3>

      <div className={styles.imageContainer}>
        <div className={styles.overlay}>
          <p className={styles.overlayText}>Background Image via CSS</p>
        </div>
      </div>

      <p className={styles.description}>
        Image used as CSS background-image from app/assets/images/app-banner.jpg
      </p>
    </div>
  );
};

export default BackgroundImageCard;
