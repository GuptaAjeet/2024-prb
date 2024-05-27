const Spinner = ({size = 10}) => {
  return (
    <div
      className="spinner-grow text-info"
      style={{ width: `${size}rem`, height: `${size}rem` }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
