import React from 'react';

// export default (props) => {
//   return (
//     <div
//       className="ag-overlay-loading-center"
//       style={{ backgroundColor: '#b4bebe', height: '9%' }}
//     >
//       <i className="far fa-frown"> {props.noRowsMessageFunc()}</i>
//     </div>
//   );
// };


const customNoRowsOverlay = (props) => {
  return (
        <div
          className="ag-overlay-loading-center"
          style={{ backgroundColor: '#002147', height: '9%',color:"white",letterSpacing:'2px' }}
        >
          <i className="far fa-frown"> No Result Found 
           {/* {props.noRowsMessageFunc()} */}
          </i>
        </div>
      );
}

export default customNoRowsOverlay;