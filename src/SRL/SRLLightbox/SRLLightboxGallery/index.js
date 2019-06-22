import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { SRLLightboxGalleryStage } from "./styles";
import SRLLightboxSlideComponent from "./SRLLightboxSlide";
import SRLLightboxControls from "./SRLLightboxControls";
let _findIndex = require("lodash/findIndex");
let _find = require("lodash/find");

const SRLLightboxGallery = ({
  isOpened,
  handleCloseLightbox,
  overlaycolor,
  images,
  selectedImage,
  showthumbnails,
  showcaption
}) => {
  const [currentImage, setCurrentImage] = useState(selectedImage);
  const [imagesGallery, setimagesGallery] = useState(images);

  useEffect(() => {
    // SET THE CURRENT IMAGE TO THE BE THE FIRST IMAGE
    // This is crucial in case the user uses the provided method to open the lightbox from a link or a button etc...
    if (selectedImage.id === undefined) {
      setCurrentImage({
        source: imagesGallery[0].src,
        caption: imagesGallery[0].alt,
        id: imagesGallery[0].id,
        width: imagesGallery[0].width,
        height: imagesGallery[0].height
      });
    }
    // Add a class to the body to remove the overflow and compensate for the scroll-bar margin
    if (isOpened) {
      document.body.classList.add("SRLOpened");
      document.addEventListener("keydown", handleLightboxWithKeys, false);
    }

    // Clean up function to remove the class from the body
    return function cleanUp() {
      document.body.classList.remove("SRLOpened");
      document.removeEventListener("keydown", handleLightboxWithKeys, false);
    };
  }, [handleLightboxWithKeys, imagesGallery, isOpened, selectedImage.id]);

  // Handle Current Image
  function handleCurrentImage(id) {
    const selectedImage = _find(imagesGallery, function(i) {
      return i.id === id;
    });
    setCurrentImage({
      source: selectedImage.src,
      caption: selectedImage.alt,
      id: selectedImage.id,
      width: selectedImage.width,
      height: selectedImage.height
    });
  }

  // Handle Next Image
  function handleNextImage(id) {
    /* We receive the ID of the current image and we want the image after that.
    Let's find the current position of the current image in the array */
    const currentPosition = _findIndex(imagesGallery, function(i) {
      return i.id === id;
    });
    /* The next image will be the next item in the array but it could be "undefined". If it's undefined we know we have reached the end and we go back to he first image */
    const nextImage = imagesGallery[currentPosition + 1] || imagesGallery[0];
    setCurrentImage({
      source: nextImage.src,
      caption: nextImage.alt,
      id: nextImage.id,
      width: nextImage.width,
      height: nextImage.height
    });
  }

  // Handle Next Image
  function handlePrevImage(id) {
    /* We receive the ID of the current image and we want the image after that.
      Let's find the current position of the current image in the array */
    // const currentPosition = imagesGallery.findIndex(i => i.id === id);
    const currentPosition = _findIndex(imagesGallery, function(i) {
      return i.id === id;
    });
    /* The prev image will be the prev item in the array but it could be "undefined" as it goes negative. If it does we need to start from the last image. */
    const prevImage =
      imagesGallery[currentPosition - 1] ||
      imagesGallery[imagesGallery.length - 1];
    setCurrentImage({
      source: prevImage.src,
      caption: prevImage.alt,
      id: prevImage.id,
      width: prevImage.width,
      height: prevImage.height
    });
  }

  // Handle Lightbox with keys
  function handleLightboxWithKeys(event) {
    if (event.keyCode === 39) {
      handleNextImage(currentImage.id);
    } else if (event.keyCode === 37) {
      handlePrevImage(currentImage.id);
    } else if (event.keyCode === 27) {
      handleCloseLightbox();
    }
  }

  const controls = {
    currentImageId: currentImage.id,
    handleCurrentImage,
    handleNextImage,
    handlePrevImage,
    handleCloseLightbox
  };

  return (
    <SRLLightboxGalleryStage overlaycolor={overlaycolor}>
      <SRLLightboxControls {...controls} />
      <SRLLightboxSlideComponent
        showthumbnails={showthumbnails}
        showcaption={showcaption}
        handleCloseLightbox={controls.handleCloseLightbox}
        handleCurrentImage={controls.handleCurrentImage}
        images={images}
        {...currentImage}
      />
    </SRLLightboxGalleryStage>
  );
};

SRLLightboxGallery.propTypes = {
  isOpened: PropTypes.bool,
  images: PropTypes.array,
  overlaycolor: PropTypes.string,
  showthumbnails: PropTypes.bool,
  showcaption: PropTypes.bool,
  selectedImage: PropTypes.object,
  handleCloseLightbox: PropTypes.func
};

export default SRLLightboxGallery;
