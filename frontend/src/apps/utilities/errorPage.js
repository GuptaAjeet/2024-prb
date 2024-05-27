import React from "react";

const ErrorPage = ({ error, resetErrorBoundary }) => {
  return (
    <div class="alert alert-danger m-5" role="alert">
      <h4 class="alert-heading">ERROR OCCURRED!</h4>
      <p style={{ fontSize: "large" }}>
        Sorry, an error occurred. This may be due to a temporary issue with our
        system. Our team has been notified and is working to resolve it as soon
        as possible. In the meantime, please feel free to contact the system
        administrator for further assistance.
      </p>
      <hr />
      <p class="mb-0">
        {error?.message && (
          <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
        )}
        <button className="btn btn-primary" onClick={resetErrorBoundary}>
          Try again
        </button>
      </p>
    </div>
  );
};
export default ErrorPage;
