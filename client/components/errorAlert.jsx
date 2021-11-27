const ErrorAlert = ({errMsg, setErrMsg}) => {

    const resetErrorMsg = () => {
        setErrMsg("")
    }

    return (
        <>
            {
                errMsg && <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <p className="text-center m-0" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{errMsg}</p>
                    <button type="button" className="btn-close" aria-label="Close" onClick={resetErrorMsg}></button>
                </div>
            }
        </>
    )
}

export default ErrorAlert