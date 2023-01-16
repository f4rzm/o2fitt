export default sleepBurnedCalorie = (gender,weight,height,age,duration)=>{
    
    const h = parseFloat(height)
    const w = parseFloat(weight)
    const a = parseFloat(age)
    const d = parseFloat(duration)
    console.log(h , w ,a ,d)
        
    return parseInt(0.01575 * w * d)
}