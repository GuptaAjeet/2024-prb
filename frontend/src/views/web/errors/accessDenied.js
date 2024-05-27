import React from "react";

const AccessDenied = () => {
  return (
    <div className="container">
      <div className="w3-display-middle text-center" style={{ marginTop: "20%" }}>
        <h1 className="w3-jumbo w3-animate-top w3-center">
          <code>Access Denied</code>
        </h1>
        <hr className="w3-border-white w3-animate-left" style={{ margin: "auto", width: "50%" }}/>
        <h3 className="w3-center w3-animate-right"> You dont have permission to view this site.</h3>
        <h3 className="w3-center w3-animate-zoom">🚫🚫🚫🚫</h3>
        <h6 className="w3-center w3-animate-zoom">error code:403 forbidden</h6>
      </div>
    </div>
  );
};

export default AccessDenied;
