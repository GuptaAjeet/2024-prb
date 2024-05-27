const Accordian = ({id,title, children, ...props}) => {
    return (<div className="accordion-item">
    <h2 className="accordion-header" id={`flush-heading${id}`} {...props}>
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${id}`} aria-expanded="false" aria-controls={`flush-collapse${id}`}>
        {title}
      </button>
    </h2>
    <div id={`flush-collapse${id}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading${id}`} data-bs-parent="#accordionFlush">
      <div className="accordion-body text-black mob-padding-0 m-t-10 " style={{fontSize:"16px"}}>{children}</div>
    </div>
  </div>)
};
export default Accordian;