
const formatDateTime = ()=>{

    const date = new Date();
    
    let day = date.getDate();
    
    let month = date.getMonth() + 1;
    
    let year = date.getFullYear();
    
    if (day < 10) day = "0" + day;
    
    if (month < 10) month = "0" + month;
    
    let hours = date.getHours();
    
    let minute = date.getMinutes();

    let second = date.getSeconds()
    
    if (hours < 10) hours = "0" + hours;
    
    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = "0" + second;
    return `${day}-${month}-${year} ${hours}:${minute}:${second}`;
}
module.exports = { formatDateTime };
