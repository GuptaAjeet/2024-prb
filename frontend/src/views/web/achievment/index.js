import React, { Fragment, useEffect, useState } from "react";
import InnerBanner from "../../layouts/web/inner-header";
import ComingSoonData from "../../../public/assets/img/coming-soon.png"
import axios from "axios";

const Objective = () => {

    const [ComingSoon, setAboutImg] = useState()
    const [content, setcontent] = useState()

    useEffect(() => {
        // POST request using axios inside useEffect React hook
        const data = { cid: 10 };
        axios.post('http://localhost:4000/api/cms/cmsFindBYId', data)
            .then((response) => {
                setAboutImg(response?.data?.TimelineImage[0].img_icon)
                setcontent(response?.data?.TimelineImage[0].description)
            }).catch(error => {
                console.error('There was an error!', error);
            });

        // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);

    return (
        <Fragment>
            <div>
                <InnerBanner attr={{ 'h2': 'Achievement of the System', 'label': 'PRABANDH' }} />
                {/* <img src={`http://localhost:4000/${ComingSoon?ComingSoon:null}`} style={{height:"600px",width:"100%"}}/> */}
                <div id="content">
                    <div className="container">
                        <div className="about pt-4 pb-4">
                            <h2 className="inner-title"> Achievement of the System</h2>
                            <div>
                                <img src={ComingSoonData} alt="coming soon"></img>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Objective