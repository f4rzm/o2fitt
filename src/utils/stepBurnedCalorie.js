export default stepBurnedCalorie = (steps,weight)=>{
    return(steps * weight * 0.00061809).toFixed(1)
}