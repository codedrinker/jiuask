const util = {
  formatTime: function(timestamp) {
    var date = new Date(timestamp); 
    var year = date.getFullYear(); 
    var month = date.getMonth() + 1 ;
    var day = date.getDate()

     
    var hour = date.getHours(); 
    var minute = date.getMinutes(); 
    var second = date.getSeconds(); 
    return [month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute].map(this.formatNumber).join(':')
  },
  formatNumber: function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
}
export default util;