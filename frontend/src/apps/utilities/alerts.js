const alerts =  {
    primary : (setAlerts,message)=>{
        setAlerts(alerts.handle('primary',message));
    },
    secondary : (setAlerts,message)=>{
        setAlerts(alerts.handle('secondary',message));
    },
    success : (setAlerts,message)=>{
        setAlerts(alerts.handle('success',message));
    },
    danger : (setAlerts,message)=>{
        setAlerts(alerts.handle('danger',message));
    },
    warning : (setAlerts,message)=>{
        setAlerts(alerts.handle('warning',message));
    },
    info : (setAlerts,message)=>{
        setAlerts(alerts.handle('info',message));
    },
    light : (setAlerts,message)=>{
        setAlerts(alerts.handle('light',message));
    },
    dark : (setAlerts,message)=>{
        setAlerts(alerts.handle('dark',message));
    },
    handle:(type,message)=>{
        return {'class':'text-start alert alert-'+type,'message':message};
    }
};

export default alerts;