import React from "react";
import bannerImage from "app/assets/images/app-banner.jpg";
import styles from "./ImageGallery.module.css";

const ImageGallery = () => {
  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.title}>🖼️ React Image Component</h3>

        <img
          src={bannerImage}
          alt="Banner from React Component"
          className={styles.image}
        />

        <p className={styles.description}>
          Image loaded via React component from src/assets/images/banner.jpg
        </p>
      </div>
    </>
  );
};

export default ImageGallery;
