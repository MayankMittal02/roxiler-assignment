function monthNameToDoubleDigit(monthName) {
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
  
    const monthIndex = months.findIndex(month => month.toLowerCase() === monthName.toLowerCase());
  
    const monthNumber = monthIndex !== -1 ? monthIndex + 1 : null;
  
    // Converting the month number to a double digit
    return monthNumber !== null ? monthNumber.toString().padStart(2, '0') : null;
  }

  // colors for pie graph
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

module.exports={
    monthNameToDoubleDigit,getRandomColor
}