import Swal from "sweetalert2";

const sweetAlert = {
  done: (data) => {
    const swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: true,
      confirmButtonColor: "#255e06",
      cancelButtonColor: "#d33",
    });
    swalWithBootstrapButtons.fire("Success!", data.msg, "success");
  },
  warning: (data) => {
    const swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: true,
      confirmButtonColor: "#255e06",
      cancelButtonColor: "#d33",
    });
    swalWithBootstrapButtons.fire({
      icon: "warning",
      html: data,
    });
  },
  error: (data) => {
    const swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: true,
      confirmButtonColor: "#255e06",
      cancelButtonColor: "#d33",
    });
    swalWithBootstrapButtons.fire("Error!", data.msg, "error");
  },
  simulate: (data) => {
    const swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: true,
      confirmButtonColor: "#255e06",
      cancelButtonColor: "#d33",
    });
    swalWithBootstrapButtons
      .fire({
        text: data.msg,
        icon: "success",
        showCancelButton: data?.noBtnText,
        confirmButtonText: data?.yesBtnText,
        cancelButtonText: data?.noBtnText,
        reverseButtons: true,
        timer: 15000,
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (data?.redirect) {
            window.location.href = data.redirect;
          }
        }
      });
  },
  confirmation: (data) => {
    const swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: true,
      confirmButtonColor: "#255e06",
      cancelButtonColor: "#d33",
    });
    swalWithBootstrapButtons
      .fire({
        title: data.title,
        html: data.msg,
        icon: "warning",
        showCancelButton: data?.noBtnText,
        confirmButtonText: data?.yesBtnText,
        cancelButtonText: data?.noBtnText,
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (data.callback) {
            data.callback();
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          if (data.cancelCallback) {
            data.cancelCallback();
          }
        }
      });
  },
  // delete : ($url,callback)=>{
  //     const swalWithBootstrapButtons = Swal.mixin({
  //         buttonsStyling: true,
  //         confirmButtonColor: '#255e06',
  //         cancelButtonColor: '#d33'
  //     });
  //     swalWithBootstrapButtons.fire({
  //         title: 'Are you sure?',
  //         text: "You won't be able to revert this!",
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Delete',
  //         cancelButtonText: 'Close',
  //         reverseButtons: true,
  //         timer:15000
  //     }).then((result) => {
  //         if(result.isConfirmed) {
  //             api.delete($url,null,(response) => {
  //                 if (response.status === true) {
  //                     swalWithBootstrapButtons.fire('Deleted!',response.message,'success');
  //                     callback(response);
  //                 }else{
  //                     swalWithBootstrapButtons.fire('Error!',response.message,'danger')
  //                 }
  //             });
  //         }
  //     });
  // },
  // openSchoolLogin : ($url,data,callback)=>{
  //     const swalWithBootstrapButtons = Swal.mixin({
  //         buttonsStyling: true,
  //         confirmButtonColor: '#255e06',
  //         cancelButtonColor: '#d33'
  //     });
  //     swalWithBootstrapButtons.fire({
  //         text: "Are you sure?, want to "+data+" school login.",
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Submit',
  //         cancelButtonText: 'Close',
  //         reverseButtons: true,
  //         timer:15000
  //     }).then((result) => {
  //         if(result.isConfirmed) {
  //             api.post($url,null,(response) => {
  //                 if (response.status === true) {
  //                     swalWithBootstrapButtons.fire('Success!',response.message,'success');
  //                     callback(response);
  //                 }else{
  //                     swalWithBootstrapButtons.fire('Error!',response.message,'danger')
  //                 }
  //             });
  //         }
  //     });
  // },
  // userActivateAndSendMail : ($url,data,callback)=>{
  //     const swalWithBootstrapButtons = Swal.mixin({
  //         buttonsStyling: true,
  //         confirmButtonColor: '#255e06',
  //         cancelButtonColor: '#d33'
  //     });

  //     const request   =   JSON.parse(data);
  //     const status    =   (request.status === '1') ? 'deactivate' : 'activate';

  //     swalWithBootstrapButtons.fire({
  //         text: `Are you sure?, you want to ${status} ${request.state}?`,
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Submit',
  //         cancelButtonText: 'Close',
  //         reverseButtons: true,
  //         timer:15000
  //     }).then((result) => {
  //         if(result.isConfirmed) {
  //             api.post($url,data,(response) => {
  //                 if (response.status === true) {
  //                     swalWithBootstrapButtons.fire('Success!',response.message,'success');
  //                     callback(response);
  //                 }else{
  //                     swalWithBootstrapButtons.fire('Error!',response.message,'danger')
  //                 }
  //             });
  //         }
  //     });
  // },

  // enableSchool : ($url,data,callback)=>{
  //     const swalWithBootstrapButtons = Swal.mixin({
  //         buttonsStyling: true,
  //         confirmButtonColor: '#255e06',
  //         cancelButtonColor: '#d33'
  //     });

  //     swalWithBootstrapButtons.fire({
  //         text: `Are you sure?, you want to make enable school ?`,
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Submit',
  //         cancelButtonText: 'Close',
  //         reverseButtons: true,
  //         timer:15000
  //     }).then((result) => {
  //         if(result.isConfirmed) {
  //             api.post($url,data,(response) => {
  //                 if (response.status === true) {
  //                     swalWithBootstrapButtons.fire('Success!',response.message,'success');
  //                     callback(response);
  //                 }else{
  //                     swalWithBootstrapButtons.fire('Error!',response.message,'danger')
  //                 }
  //             });
  //         }
  //     });
  // },
  // makeCorrection : ($url,data,callback)=>{
  //     const swalWithBootstrapButtons = Swal.mixin({
  //         buttonsStyling: true,
  //         confirmButtonColor: '#255e06',
  //         cancelButtonColor: '#d33',
  //     });
  //     swalWithBootstrapButtons.fire({
  //         text: "Are you sure to give permission to school for making corrections?",
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Submit',
  //         cancelButtonText: 'Close',
  //         reverseButtons: true,
  //         timer:15000
  //     }).then((result) => {
  //         if(result.isConfirmed) {
  //             api.post($url,data,(response) => {
  //                 if (response.status === true) {
  //                     swalWithBootstrapButtons.fire('Success!',response.message,'success');
  //                     callback(response);
  //                 }else{
  //                     swalWithBootstrapButtons.fire('Error!',response.message,'danger')
  //                 }
  //             });
  //         }
  //     });
  // },
  // reOpen : ($url,data,callback)=>{
  //     const swalWithBootstrapButtons = Swal.mixin({
  //         buttonsStyling: true,
  //         confirmButtonColor: '#255e06',
  //         cancelButtonColor: '#d33'
  //     });
  //     swalWithBootstrapButtons.fire({
  //         text: "Are you sure, you want to modify the record?",
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Submit',
  //         cancelButtonText: 'Close',
  //         reverseButtons: true,
  //         timer:15000
  //     }).then((result) => {
  //         if(result.isConfirmed) {
  //             api.post($url,data,(response) => {
  //                 if (response.status === true) {
  //                     swalWithBootstrapButtons.fire('Success!',response.message,'success');
  //                     callback(response);
  //                 }else{
  //                     swalWithBootstrapButtons.fire('Error!',response.message,'danger')
  //                 }
  //             });
  //         }
  //     });
  // },
  // freeze : ($url,data,callback)=>{
  //     const swalWithBootstrapButtons = Swal.mixin({
  //         buttonsStyling: true,
  //         confirmButtonColor: '#255e06',
  //         cancelButtonColor: '#d33'
  //     });
  //     swalWithBootstrapButtons.fire({
  //         text: "Are you sure, you want to freeze? you will not be able to make any changes after freezing schools.",
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Submit',
  //         cancelButtonText: 'Close',
  //         reverseButtons: true,
  //         timer:15000
  //     }).then((result) => {
  //         if(result.isConfirmed) {
  //             api.post($url,data,(response) => {
  //                 if (response.status === true) {
  //                     swalWithBootstrapButtons.fire('Success!',response.message,'success');
  //                     callback(response);
  //                 }else{
  //                     swalWithBootstrapButtons.fire('Error!',response.message,'danger')
  //                 }
  //             });
  //         }
  //     });
  // },
  // freezeByStates : ($url,data,callback)=>{
  //     const swalWithBootstrapButtons = Swal.mixin({
  //         buttonsStyling: true,
  //         confirmButtonColor: '#255e06',
  //         cancelButtonColor: '#d33'
  //     });
  //     swalWithBootstrapButtons.fire({
  //         text: "Are you sure, you want to freeze? you will not be able to make any changes after freezing schools.",
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Submit',
  //         cancelButtonText: 'Close',
  //         reverseButtons: true,
  //         timer:15000
  //     }).then((result) => {
  //         if(result.isConfirmed) {
  //             api.post($url,data,(response) => {
  //                 if (response.status === true) {
  //                     swalWithBootstrapButtons.fire('Success!',response.message,'success');
  //                     callback(response);
  //                 }else{
  //                     swalWithBootstrapButtons.fire('Error!',response.message,'danger')
  //                 }
  //             });
  //         }
  //     });
  // },
  // freezeStateByNational : ($url,data,callback)=>{
  //     const swalWithBootstrapButtons = Swal.mixin({
  //         buttonsStyling: true,
  //         confirmButtonColor: '#255e06',
  //         cancelButtonColor: '#d33'
  //     });
  //     const request   =   JSON.parse(data);
  //     const freeze    =   (request.flag === '0') ? 'unfreeze' : 'freeze';
  //     swalWithBootstrapButtons.fire({
  //         text: `Are you sure, you want to ${freeze} ${request.state}?`,
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Submit',
  //         cancelButtonText: 'Close',
  //         reverseButtons: true,
  //         timer:15000
  //     }).then((result) => {
  //         if(result.isConfirmed) {
  //             api.post($url,data,(response) => {
  //                 if (response.status === true) {
  //                     swalWithBootstrapButtons.fire('Success!',response.message,'success');
  //                     callback(response);
  //                 }else{
  //                     swalWithBootstrapButtons.fire('Error!',response.message,'danger')
  //                 }
  //             });
  //         }
  //     });
  // },
  // freezeState : ($url,data,callback)=>{
  //     const swalWithBootstrapButtons = Swal.mixin({
  //         buttonsStyling: true,
  //         confirmButtonColor: '#255e06',
  //         cancelButtonColor: '#d33'
  //     });
  //     const request   =   JSON.parse(data);
  //     const freeze    =   (request.flag === '0') ? 'unfreeze' : 'freeze';
  //     swalWithBootstrapButtons.fire({
  //         text: `Are you sure, you want to ${freeze} ${request.state}?`,
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Submit',
  //         cancelButtonText: 'Close',
  //         reverseButtons: true,
  //         timer:15000
  //     }).then((result) => {
  //         if(result.isConfirmed) {
  //             api.post($url,data,(response) => {
  //                 if (response.status === true) {
  //                     swalWithBootstrapButtons.fire('Success!',response.message,'success');
  //                     callback(response);
  //                 }else{
  //                     swalWithBootstrapButtons.fire('Error!',response.message,'danger')
  //                 }
  //             });
  //         }
  //     });
  // },
  // freezeStateDistrict : ($url,data,callback)=>{
  //     const swalWithBootstrapButtons = Swal.mixin({
  //         buttonsStyling: true,
  //         confirmButtonColor: '#255e06',
  //         cancelButtonColor: '#d33'
  //     });
  //     const request   =   JSON.parse(data);
  //     const freeze    =   (request.flag === '0') ? 'unfreeze' : 'freeze';
  //     swalWithBootstrapButtons.fire({
  //         text: `Are you sure, you want to ${freeze} ${request.district}?`,
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Submit',
  //         cancelButtonText: 'Close',
  //         reverseButtons: true,
  //         timer:15000
  //     }).then((result) => {
  //         if(result.isConfirmed) {
  //             api.post($url,data,(response) => {
  //                 if (response.status === true) {
  //                     swalWithBootstrapButtons.fire('Success!',response.message,'success');
  //                     callback(response);
  //                 }else{
  //                     swalWithBootstrapButtons.fire('Error!',response.message,'danger')
  //                 }
  //             });
  //         }
  //     });
  // },
  // finalSave : ($url,data,callback)=>{
  //     const swalWithBootstrapButtons = Swal.mixin({
  //         buttonsStyling: true,
  //         confirmButtonColor: '#255e06',
  //         cancelButtonColor: '#d33'
  //     });
  //     swalWithBootstrapButtons.fire({
  //         text: "After submit,You won't be able to revert this!",
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Save',
  //         cancelButtonText: 'Close',
  //         reverseButtons: true,
  //         timer:15000
  //     }).then((result) => {
  //         if(result.isConfirmed) {
  //             api.post($url,data,(response) => {
  //                 if (response.status === true) {
  //                     swalWithBootstrapButtons.fire('Success!',response.message,'success');
  //                     callback(response);
  //                 }else{
  //                     swalWithBootstrapButtons.fire('Error!',response.message,'danger')
  //                 }
  //             });
  //         }
  //     });
  // },

  // info : (message)=>{
  //     let timerInterval
  //     Swal.fire({
  //         //title: 'Auto close alert!',
  //         html: message,
  //         timer: 2000,
  //         timerProgressBar: true,
  //         didOpen: () => {
  //             Swal.showLoading()
  //             const b = Swal.getHtmlContainer().querySelector('b')
  //             timerInterval = setInterval(() => {
  //                 b.textContent = Swal.getTimerLeft()
  //             }, 100)
  //         },
  //         willClose: () => {
  //             clearInterval(timerInterval)
  //         }
  //     }).then((result) => {
  //         if (result.dismiss === Swal.DismissReason.timer) {
  //         }
  //     })
  // }
};

export default sweetAlert;
