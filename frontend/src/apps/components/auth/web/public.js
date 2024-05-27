import React from 'react';
import Layout from "../../../../views/layouts/web";

function Public(props) {
    return <Layout size={props.size}>{ props.children }</Layout>
}

export default Public