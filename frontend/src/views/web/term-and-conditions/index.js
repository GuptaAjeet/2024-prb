import React from "react";
import InnerBanner from "../../layouts/web/inner-header";

const Index = () => {
    return (
        <div>
            <InnerBanner attr={{ 'h2': 'Terms & Conditions', 'label': 'Terms & Conditions' }} />
            <div id="content" className="inner-bg">
                <div className="w-100 d-flex pb-3 pt-3 inner-white-section">
                    <div className="container">
                        <h2 className="sec-title">Terms & Conditions</h2>
                        <p>This website is designed, updated and maintained by Ministry of Education (Shiksha Mantralay), Government of India.</p>

                        <p>Though all efforts have been made to ensure the accuracy of the content on this website, the same should not be construed as a statement of law or used for any legal purposes. In case of any ambiguity or doubts, users are advised to verify/check with the Ministry of Education (Shiksha Mantralay) and/or other source(s), and to obtain appropriate professional advice.</p>

                        <p>Under no circumstances will Ministry of Education (Shiksha Mantralay) be liable for any expense, loss or damage including, without limitation, indirect or consequential loss or damage, or any expense, loss or damage whatsoever arising from use, or loss of use, of data, arising out of or in connection with the use of this website.</p>

                        <p>These terms and conditions shall be governed by and construed in accordance with the Indian Laws. Any dispute arising under these terms and conditions shall be subject to the jurisdiction of the courts of India.</p>

                        <p>The information posted on this website could include hypertext links or pointers to information created and maintained by non-Government / private organizations. Ministry of Education (Shiksha Mantralay) is providing these links and pointers solely for your information and convenience. When you select a link to an outside website, you are leaving the Ministry of Education (Shiksha Mantralay) website and are subject to the privacy and security policies of the owners/sponsors of the outside website. Ministry of Education (Shiksha Mantralay), does not guarantee the availability of such linked pages at all times. Ministry of Education (Shiksha Mantralay) cannot authorize the use of copyrighted materials contained in linked websites. Users are advised to request such authorization from the owner of the linked website. Ministry of Education (Shiksha Mantralay), does not guarantee that linked websites comply with Indian Government Web Guidelines.</p>

                        <h2 className="sub-head">Disclaimer</h2>

                        <p>This website of the Ministry of Education (Shiksha Mantralay) is being maintained for information purposes only. Even though every effort is taken to provide accurate and up to date information, officers making use of the circulars posted on the website are advised to get in touch with the Ministry of Education (Shiksha Mantralay) whenever there is any doubt regarding the correctness of the information contained therein. In the event of any conflict between the contents of the circulars on the website and the hard copy of the circulars issued by Ministry of Education (Shiksha Mantralay), the information in the hard copy should be relied upon and the matter shall be brought to the notice of the Ministry of Education (Shiksha Mantralay).</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;