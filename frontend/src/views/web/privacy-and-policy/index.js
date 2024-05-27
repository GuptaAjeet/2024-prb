import React from "react";
import InnerBanner from "../../layouts/web/inner-header";

const Index = () => {
    return (
        <div>
            <InnerBanner attr={{ 'h2': 'Privacy & Policy', 'label': 'Privacy & Policy' }} />
            <div id="content" className="inner-bg">
                <div className="w-100 d-flex pb-3 pt-3 inner-white-section">
                    <div className="container">
                        <h2 className="sec-title">Privacy & Policy</h2>
                                                    
                            <p>As a general rule, this website does not collect Personal Information about you when you visit the site. You can generally visit the site without revealing Personal Information, unless you choose to provide such information.</p>

                            <h4 className="sub-head">Site Visit Data:</h4>

                            <p>This website records your visit and logs the following information for statistical purposes your server's address; the name of the top-level domain from which you access the Internet (for example, .gov, .com, .in, etc.); the type of browser you use; the date and time you access the site; the pages you have accessed and the documents downloaded and the previous Internet address from which you linked directly to the site.</p>

                            <h4 className="sub-head">Disclaimer</h4>

                            <p>We will not identify users or their browsing activities, except when a law enforcement agency may exercise a warrant to inspect the service provider's logs.</p>

                            <h4 className="sub-head">Email Management:</h4>

                            <p>Your email address will only be recorded if you choose to send a message. It will only be used for the purpose for which you have provided it and will not be added to a mailing list. Your email address will not be used for any other purpose, and will not be disclosed, without your consent.</p>

                            <h4 className="sub-head">Collection of Personal Information:</h4>

                            <p>If you are asked for any other Personal Information you will be informed how it will be used if you choose to give it. If at any time you believe the principles referred to in this privacy statement have not been followed, or have any other comments on these principles, please notify the webmaster through the contact us page.</p>

                            <h4 className="sub-head">Note:</h4>

                            <p>The use of the term "Personal Information" in this privacy statement refers to any information from which your identity is apparent or can be reasonably ascertained.</p>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;