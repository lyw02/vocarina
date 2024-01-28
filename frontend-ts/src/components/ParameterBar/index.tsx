import "./index.css"

const ParameterBar = () => {
  return (
    <div className="param-wrapper">
      <span className="param-item" 
    //   onClick={() => handleIsTimeSigDialogVisible(true)}
      >
        {/* {numerator}/{denominator} */}
        4/4
      </span>
      {/* <span className="param-item" onClick={() => handleIsBpmDialogVisible(true)}>BPM: {bpm}</span> */}
    </div>
  )
}

export default ParameterBar