function getHTMLValue(name){
    let value = document.getElementById(name).value;
    if (!value) {
        return null;
    }

    return value;
}

function convertToInteger(value) {
    if (value === null) {
        return null; 
      }

      const number = parseInt(value, 10);
      if (!isNaN(number)) {
        return number;
      } else {
        return null; 
      }
}

function convertToFloat(value) {
    if (value === null) {
        return null; 
    }

    const val = parseFloat(value.toString());
    if (!isNaN(val)) {
        return val;
    } else {
        throw new Error('The string cannot be converted to a float.');
    }
}

function convertToBoolean(value) {
    if (value === null) {
        return null; 
    }

    if (value.toLowerCase() === 'true') {
      return true;
    } else if (value.toLowerCase() === 'false') {
      return false;
    } else {
      throw new Error('The string cannot be converted to a boolean.');
    }
}


function areAllValuesValid(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) { 
            let value = obj[key];
            if (value === undefined || value === null || value === "") {
                return false; 
            }
            
        }
    }
    return true;
}

function changeButtonContent() {
    let btn = document.getElementById('submitBtn'); 
    btn.innerHTML = '<span>Actualizar Encuesta</span> '; 
}
