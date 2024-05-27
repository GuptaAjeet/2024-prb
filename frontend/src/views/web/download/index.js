import React, { Fragment, useEffect, useState, } from "react";
//import AboutImg from "../../../public/web/images/Volunteering-bro.png";
import InnerBanner from "../../layouts/web/inner-header";
//import ComingSoonData from "../../../public/assets/img/coming-soon.png"
import axios from "axios";
//import { useLocation } from "react-router-dom";

const Download = () => {

    // const location = useLocation();
    const [, setAboutImg] = useState()
    const [, setcontent] = useState();
    useEffect(() => {
        const data = { cid: 10 };
        axios.post('http://localhost:4000/api/cms/cmsFindBYId', data).then((response) => {
                setAboutImg(response?.data?.TimelineImage[0].img_icon)
                setcontent(response?.data?.TimelineImage[0].description)
            }
            ). catch(error => {
                console.error('There was an error!', error);
            });
    }, []);





    const handleDownload = () => {
        // Replace the file path with your actual file path
        const filePath = '/Samagra Siksha Norms Elementary Secondary and Teacher Education for NIC.xls';

        // Create an anchor element
        const anchor = document.createElement('a');

        // Set the href attribute to the file path
        anchor.href = filePath;

        // Set the download attribute with the desired file name
        anchor.download = 'Samagra Siksha Norms Elementary Secondary and Teacher Education for NIC.xls';

        // Append the anchor to the document body
        document.body.appendChild(anchor);

        // Trigger a click on the anchor to start the download
        anchor.click();

        // Remove the anchor from the document body
        document.body.removeChild(anchor);
    };


    // const path = location.pathname;

    return (
        <Fragment>
            <div>
                <InnerBanner attr={{ 'h2': 'Download of the System', 'label': 'PRABANDH' }} />
                {/* <img src={`http://localhost:4000/${ComingSoon?ComingSoon:null}`} style={{height:"600px",width:"100%"}}/> */}
                <div id="content">
                    <div className="container">
                        <div className="about pt-4 pb-4">
                            <button
                                className={`btn btn-primary`}
                                onClick={handleDownload}
                                to="#"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Download