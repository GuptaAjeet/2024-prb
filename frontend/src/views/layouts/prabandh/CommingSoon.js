// import { useEffect, useRef, useMemo, useState, useCallback } from "react";
// import InnerBanner from "../web/inner-header";
import ComingSoonData from "../../../public/assets/img/coming-soon.png"

const CommingSoon = () => {

    return  (<>
        <div>
            {/* <InnerBanner attr={{ 'h2': 'Achievement of the System', 'label': 'PRABANDH' }} /> */}
            {/* <img src={`http://localhost:4000/${ComingSoon?ComingSoon:null}`} style={{height:"600px",width:"100%"}}/> */}
            <div id="content">
                <div className="container">
                    <div className="about pt-4 pb-4 mt-5">
                        {/* <h2 className="inner-title"> Achievement of the System</h2> */}
                        <div>
                            <img className="aaa" src={ComingSoonData}></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default CommingSoon;