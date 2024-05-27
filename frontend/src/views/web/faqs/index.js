import React from "react";
import InnerBanner from "../../layouts/web/inner-header";

const Index = () => {
    return (
        <div>
            <InnerBanner attr={{ 'h2': "FAQ's", 'label': "FAQ's" }} />
            <div id="content" className="inner-bg">
                <div className="w-100 d-flex pb-3 pt-3 inner-white-section">
                    <div className="container">
                        <h2 className="sec-title">FAQ's</h2>
                        <div className="faq">
                            <div className="accordion">
                                <strong className="accTrigger">What is PRABANDH?</strong>
                                <div className="accordDetail">
                                    <p>PRABANDH is an initiative led by Ministry of Education (Shiksha Mantralay) to provide non-educational practices (through volunteers) to the students. This initiative would connect school student with varied volunteers from the Indian diaspora namely (but not limited to) Retired teachers, Retired Government officials, Retired professional women etc. Apart from enabling mentors to directly interact with institutions and impart relevant knowledge and skill set, PRABANDH platform also allows the volunteers/citizens/alumni’s etc. to contribute services at schools and their management through various categories of contribution namely ICT, Construction, school facilities like furniture, amenities etc.</p>
                                </div>
                                <strong className="accTrigger">Is there a Mobile Application as well for PRABANDH?</strong>
                                <div className="accordDetail">
                                    <p>The multi-platform mobile application for PRABANDH supports both Android and iOS platform. The mobile application is available on Google Play Store and iTunes Store. Smartphone users can download the app from respective stores.</p>
                                </div>
                                <strong className="accTrigger">What are the Benefits/Salient Features of PRABANDH?</strong>
                                <div className="accordDetail">
                                    <p>PRABANDH initiative aims to ensure that this citizen government collaboration provide concrete outcomes and tangible results. Following are the salient features of the platform: <br /><br />
                                        1. Create an interface between volunteers and schools to bridge the gap between them <br /><br />
                                        2. Help school students in getting exposure other than academic activities <br /><br />
                                        3. Platform for schools to share their activities for Volunteer-ship, where volunteers can participate by performing various activities <br /><br />
                                        4. Platform for Ministry to view various reports like Schools on-boarded, Volunteers, Activities performed etc. <br /><br />
                                        5. Platform for participation of Citizens/Volunteers/Alumni’s to contribute services at schools and their management
                                    </p>
                                </div>
                                <strong className="accTrigger">What is the process for School Registration?</strong>
                                <div className="accordDetail">
                                    <p>
                                        Schools would be registered dynamically with school profiles and activity management through web application. Below are the steps of this process: <br /><br />
                                        1. School will register through UDISE code (Details of the school would be fetched from the UDISE database) <br /><br />
                                        2. Basic information like name of school, school address, type of school, contact details of school etc. must be filled in School registration page<br /><br />
                                        3. After filling the details of school for registration, school will receive communication/notification on registered email Id and mobile number<br /><br />
                                        4. The school requires to fill the details of the form and submit the request to the Block resource center <br /><br />
                                        5. Schools registration request will be approved/disapproved by BRC <br /><br />
                                        6. Registration approved schools will get email for Login with the application.
                                    </p>
                                </div>
                                <strong className="accTrigger">What activities would be covered under the PRABANDH initiative</strong>
                                <div className="accordDetail">
                                    <p>
                                        Below are few sample activity categories in which volunteer can add as preference and school can create requirement for volunteer:  <br /><br />
                                        1. Reading/pronunciation for Children <br /><br />
                                        2. Helping Children with Creative Writing <br /><br />
                                        3. Public Speaking <br /><br />
                                        4. Play Acting <br /><br />
                                        5. Preparing Story Books with Children <br /><br />
                                        6. Model Making <br /><br />
                                        7. Counseling for academics, life-skills <br /><br />
                                        8. Music and dance <br /><br />
                                        9. Swachhta In Schools etc.
                                    </p>
                                    <p> <strong>*This is an indicative list of activities. Activities masters will be managed by Ministry of Education (Shiksha Mantralay) only. </strong> </p>
                                </div>
                                <strong className="accTrigger">What is the process of contribution for the Volunteer/Citizen/Alumni?</strong>
                                <div className="accordDetail">
                                    <p>
                                        Volunteers/citizens/alumni who wish to contribute services to school and their management would follow the below steps: <br /><br />
                                        1. Login the portal as volunteer/public/alumni <br /><br />
                                        2. Select school for contribution <br /><br />
                                        3. Select type of contribution <br /><br />
                                        4. Fill the details <br /><br />
                                        5. Submit the form
                                    </p>
                                    <p>After request submission, respective school can view Contribution request and can make further call. The volunteer would be able to see status of his request. </p>
                                </div>
                                <strong className="accTrigger">Is there a provision for Feedback and Rating?</strong>
                                <div className="accordDetail">
                                    <p>On Completion of activity, both schools and volunteers would be prompted to share as well as view feedback and rating regarding the activities performed. <br /><br />
                                        <b>You may take reference from the UDISE+ FAQs page. Link below:</b>
                                    </p>
                                    <p><a href="https://udiseplus.gov.in/#/page/faqs" target="_BLACK">Click Here</a></p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;