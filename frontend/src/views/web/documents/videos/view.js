import React from "react";
import { Modal } from "../../../../apps/components/elements";

const ViewVideo = (props) => {
    return (
        <Modal>
            <div className="row p-3">
                <div className="mb-2 col-md-12">
                    <iframe width="100%" height="600" src={`https://www.youtube.com/embed/${props.code}?rel=0`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
        </Modal>
    )
}

export default ViewVideo