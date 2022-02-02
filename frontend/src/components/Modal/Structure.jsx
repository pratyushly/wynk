import React from 'react';
import Modal from "react-modal";
Modal.setAppElement("#root");

const Structure = (props) => {
  return (
    <Modal isOpen={props.isOpen}
    overlayClassName="bg-dark-overlay fixed top-0 left-0 w-full h-full flex justify-center items-center"
    // overlayClassName="bg-dark-overlay fixed top-0 left-0 w-full h-full flex"
    className={`rounded-[3px] bg-dark shadow-modal border border-[#ffffff24] selection:bg-[#2E5565] focus:outline-none ${props.contentBoxAdditionalClasses}`}
    bodyOpenClassName="overflow-hidden"
    contentLabel={props.modalLabel}
    onRequestClose={() => { props.onRequestClose(props.setModalTurnOffState) }}>
        {props.children}
    </Modal>
  );
};

export default Structure;
