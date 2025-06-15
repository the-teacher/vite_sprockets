// Asset helper similar to Rails Sprockets
class AssetHelper {
  constructor() {
    this.manifest = null;
    this.isDevelopment = import.meta.env.DEV;
  }

  // Load manifest in production (similar to Rails asset manifest)
  async loadManifest() {
    if (this.isDevelopment) return;

    try {
      const response = await fetch("/manifest.json");
      this.manifest = await response.json();
    } catch (error) {
      console.warn("Manifest not found, using fallback paths");
    }
  }

  // Get asset path (similar to Rails asset_path helper)
  assetPath(filename) {
    if (this.isDevelopment) {
      // In development, use direct public folder paths
      return `/assets/images/${filename}`;
    }

    // In production, use manifest paths
    if (this.manifest && this.manifest[`assets/images/${filename}`]) {
      return this.manifest[`assets/images/${filename}`].file;
    }

    // Fallback
    return `/assets/images/${filename}`;
  }

  // Get image tag (similar to Rails image_tag helper)
  imageTag(filename, options = {}) {
    const img = document.createElement("img");
    img.src = this.assetPath(filename);
    img.alt = options.alt || filename;

    // Apply CSS classes
    if (options.class) {
      img.className = options.class;
    }

    // Apply inline styles
    if (options.style) {
      Object.assign(img.style, options.style);
    }

    // Apply other attributes
    Object.keys(options).forEach((key) => {
      if (!["class", "style", "alt"].includes(key)) {
        img.setAttribute(key, options[key]);
      }
    });

    return img;
  }

  // Get all available images (scan public/assets/images folder)
  getAvailableImages() {
    const images = [
      "logo.png",
      "banner.jpg",
      "test1.jpg",
      "test2.jpeg",
      "test3.png",
      "test4.gif",
      "test5.svg",
      "test6.webp",
      "icon.svg",
    ];

    return images.map((filename) => ({
      filename,
      name: this.formatImageName(filename),
      type: filename.split(".").pop().toUpperCase(),
      path: this.assetPath(filename),
    }));
  }

  // Format image name for display
  formatImageName(filename) {
    const nameWithoutExt = filename.split(".")[0];
    return nameWithoutExt
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  // Initialize helper (call this on page load)
  async init() {
    await this.loadManifest();
  }
}

// Export singleton instance (like Rails helpers)
export const assetHelper = new AssetHelper();
