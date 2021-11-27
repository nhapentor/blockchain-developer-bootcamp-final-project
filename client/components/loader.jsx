const LoadingPage = () => {
    return (
        <div>
            <div className="loader-overlay"></div>
            <div className="loader-spanner">
                <div className="loader-wrapper">
                <div className="loader"></div>
                <p>Processing your request, please be patient.</p>
                </div>
            </div>
        </div>
    )
}

export default LoadingPage