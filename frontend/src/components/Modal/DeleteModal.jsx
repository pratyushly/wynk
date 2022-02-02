import React from 'react';
import ModalStructure from "./Structure";
import Cancel from "../Buttons/Cancel";
import Delete from "../Buttons/Delete";

const DeleteModal = (props) => {
    return (
        <ModalStructure
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            setModalTurnOffState={props.setModalTurnOffState}
            modalLabel={props.modalLabel}>
            <div className="flex flex-col space-y-8 p-8 text-darkwhite font-open">
                <span className="text-xl">Are you sure you want to delete?</span>
                <div className="flex justify-end space-x-4">
                    <Cancel onClick={props.onCancel}/>
                    <Delete onClick={props.onDelete} deleteMessage="Delete"/>
                </div>
            </div>
        </ModalStructure>
    );
};

export default DeleteModal;
