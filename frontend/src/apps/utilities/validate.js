const validate = {
    msgHandler :(method,input,errorMessage,isvalid)=>{        
        validate.errSetter(errorMessage)
        method((preState)=>({
            ...preState,[input.current.name]:{isvalid:isvalid,message:errorMessage}
        }));
    },
    errSetter :(message,isvalid=false)=>{
        return {"status":isvalid,"message":message};
    },
    isFormValid :(elements)=>{
        let i = 0;
        elements.map((element) => {
            if(element.current !== undefined && element.current !== null && element.current.value !== undefined){
                if((element.current.value).trim().length === 0 || element.current.value ==='0'){
                    i++ 
                }
            }
        });
        return (i > 0) ? true:false;
    },
    onlyNumeric : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            return e.target.value = e.target.value.replace(/[^0-9]/g,''); 
        }
        return e.target.value ='';
    },
    onlyAlpha : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            return e.target.value = e.target.value.replace(/[^A-Za-z\s]/g,''); 
        }
        return e.target.value ='';
    },
    onlyAlphaNumSpace : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            return e.target.value = e.target.value.replace(/[^A-Za-z0-9\s]/g,''); 
        }
        return e.target.value ='';
    },
    onlyAlphaNum : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            return e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g,''); 
        }
        return e.target.value ='';
    },
    alphaDecimal : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            return e.target.value = e.target.value.replace(/[^A-Za-z.\s]/g,''); 
        }
        return e.target.value ='';
    },
    passwordCompare :(n,c)=>{
        if(n.target !== undefined && c.target !== undefined){
            return (n.target.value.trim() === c.target.value.trim())? true: false;
        }
        return false;
    },
    isEmpty : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            return (e.target.value).trim().length === 0 ? true : false;
        }
        return false;
    },
    isSelected : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            return (e.target.value.trim() === '0') ? true :false ;
        }

    },
    strLen : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            return e.target.value.trim().length;
        }

    },
    validMobile : (e)=>{        
        if(e.target !== undefined  && e.target.value !== null && e.target.value < 6 ){
            return e.target.value ='';
        }   
        return e.target.value = e.target.value.replace(/[^0-9]/g,''); 
    },
        
    validNriMobile : (e)=>{
        if(e.target !== undefined  && e.target.value !== null ){
            return e.target.value = e.target.value.replace(/[^0-9]/g,'');
        }
        return e.target.value ='';
    },
    emailToLower : (e)=>{
        if(e.target !== undefined  && e.target.value !== null){
            return e.target.value = e.target.value.toLowerCase();
        }
        return e.target.value ='';
    },
    validUdiseCode : (e)=>{  
        if(e.target !== undefined  && e.target.value !== null){
            return e.target.value = e.target.value.replace(/[^0-9A-Za-z]/g,'');
        }
        return e.target.value ='';
    },
    value :(e,length=0)=>{
        if(e.target !== undefined  && e.target.value !== null && e.target.value.trim().length === length){
            return true;
        }
        if(e.target !== undefined  && e.target.value !== null && e.target.value.trim().length < length){
            return true;
        }
        return false;
    },
    isPasswordStrong : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            return regex.test(e.target.value);
        }
        return false;
    },
    removeSpace : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            return e.target.value = e.target.value.replace(/^\s+|\s+$/gm,'');
        }
        return false;
    },
    validEmail : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            const regex = /^(([^<>()\[\]\\.,@"]+(\.[^<>()\[\]\\.,@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
            return regex.test(e.target.value);
        }
        return false;
    },
    validDarpan : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            const regex = /^([A-Z]){2}([0-9]){5}([A-Z]){6}?$/;
            return regex.test(e.target.value);
        }
        return e.target.value ='';
    },
    validPan : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            const regex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/;
            return regex.test(e.target.value);
        }
        return false;
    },
    validUdise : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            const regex = /^([0-9]){4}([A-Z0-9]*){7}?$/;
            return regex.test(e.target.value);
        }
        return false;
    },
    validName : (e)=>{
        if(e.target !== undefined && e.target.value !== null){
            return e.target.value = e.target.value.replace(/[^A-Za-z.\s]/g,''); 
        }
    },
};

export default validate;