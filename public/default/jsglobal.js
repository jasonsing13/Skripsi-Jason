$(document).ready(function () {
    $(".dataTables").dataTable({
        "order": []
    });
});

// AUTONUMERIC
function initAutoNumeric(id = '', type){
    let anElement
    // Inisialisasi AutoNumeric KALAU ADA
        if(AutoNumeric.getAutoNumericElement(id)){
            anElement = AutoNumeric.getAutoNumericElement(id);
            
        }
    // KALAU BELUM DIINISIALISASI
    else{
        switch(type){
            case "currency":
                anElement = new AutoNumeric(id, { 
                    currencySymbol: "Rp ",
                    currencySymbolPlacement: "p",
                    decimalCharacter: ",",
                    digitGroupSeparator: ".",
                    allowDecimalPadding: "floats",
                    outputFormat: "string",
                    unformatOnSubmit: true
                });
                break;
            case "qty":
                anElement = new AutoNumeric(id, { 
                    decimalCharacter: ",",
                    digitGroupSeparator: ".",
                    allowDecimalPadding: "floats",
                    outputFormat: "string",
                    unformatOnSubmit: true
                });
                break;
            case "qtyPercent":
                anElement = new AutoNumeric(id, { 
                    alwaysAllowDecimalCharacter: true,
                    currencySymbol: "%",
                    currencySymbolPlacement: "s",
                    decimalCharacter: ",",
                    decimalPlacesRawValue: 2,
                    digitGroupSeparator: ".",
                    outputFormat: "string",
                    unformatOnSubmit: true
                });
                break;
        }
    }

    return anElement
}

function initAutoNumericAll(){
    // document.addEventListener('DOMContentLoaded', function() {
        var currencyElements = document.querySelectorAll('.currency');
        var currencyQty = document.querySelectorAll('.qty');
        var currencyQtyPercent = document.querySelectorAll('.qtyPercent');

        currencyElements.forEach(function(element) {
            // Periksa apakah elemen tersebut sudah diinisialisasi sebelumnya
            if (!AutoNumeric.getAutoNumericElement(element)) {
                new AutoNumeric(element, { 
                    currencySymbol: "Rp ",
                    currencySymbolPlacement: "p",
                    decimalCharacter: ",",
                    digitGroupSeparator: ".",
                    allowDecimalPadding: "floats",
                    outputFormat: "string",
                    unformatOnSubmit: true
                });
            }
        });

        currencyQty.forEach(function(element) {
            // Periksa apakah elemen tersebut sudah diinisialisasi sebelumnya
            if (!AutoNumeric.getAutoNumericElement(element)) {
                new AutoNumeric(element, { 
                    decimalCharacter: ",",
                    digitGroupSeparator: ".",
                    allowDecimalPadding: "floats",
                    outputFormat: "string",
                    unformatOnSubmit: true
                });
            }
        });

        currencyQtyPercent.forEach(function(element) {
            // Periksa apakah elemen tersebut sudah diinisialisasi sebelumnya
            if (!AutoNumeric.getAutoNumericElement(element)) {
                new AutoNumeric(element, { 
                    alwaysAllowDecimalCharacter: true,
                    currencySymbol: "%",
                    currencySymbolPlacement: "s",
                    decimalCharacter: ",",
                    decimalPlacesRawValue: 2,
                    digitGroupSeparator: ".",
                    outputFormat: "string",
                    unformatOnSubmit: true
                });
            }
        });

        document.body.addEventListener('focus', function(event) {
            if (event.target.classList.contains('currency')) {
                // Periksa apakah elemen tersebut sudah diinisialisasi sebelumnya
                if (!AutoNumeric.getAutoNumericElement(event.target)) {
                    new AutoNumeric(event.target, { 
                        currencySymbol: "Rp ",
                        decimalCharacter: ",",
                        digitGroupSeparator: ".",
                        decimalPlacesRawValue: 0,
                        allowDecimalPadding: "floats",
                        outputFormat: "string",
                        unformatOnSubmit: true
                    });
                }
            }

            if (event.target.classList.contains('qty')) {
                // Periksa apakah elemen tersebut sudah diinisialisasi sebelumnya
                if (!AutoNumeric.getAutoNumericElement(event.target)) {
                    new AutoNumeric(event.target, { 
                        decimalCharacter: ",",
                        digitGroupSeparator: ".",
                        allowDecimalPadding: "floats",
                        outputFormat: "string",
                        unformatOnSubmit: true
                    });
                }
            }

            if (event.target.classList.contains('qtyPercent')) {
                // Periksa apakah elemen tersebut sudah diinisialisasi sebelumnya
                if (!AutoNumeric.getAutoNumericElement(event.target)) {
                    new AutoNumeric(event.target, { 
                        alwaysAllowDecimalCharacter: true,
                        currencySymbol: "%",
                        currencySymbolPlacement: "s",
                        decimalCharacter: ",",
                        decimalPlacesRawValue: 2,
                        digitGroupSeparator: ".",
                        outputFormat: "string",
                        unformatOnSubmit: true
                    });
                }
            }
        }, true);
    // });
}

document.addEventListener('DOMContentLoaded', function() {
    var currencyElements = document.querySelectorAll('.currency');
    var currencyQty = document.querySelectorAll('.qty');
    var currencyQtyPercent = document.querySelectorAll('.qtyPercent');

    currencyElements.forEach(function(element) {
        // Periksa apakah elemen tersebut sudah diinisialisasi sebelumnya
        if (!AutoNumeric.getAutoNumericElement(element)) {
            new AutoNumeric(element, { 
                currencySymbol: "Rp ",
                currencySymbolPlacement: "p",
                decimalCharacter: ",",
                digitGroupSeparator: ".",
                allowDecimalPadding: "floats",
                outputFormat: "string",
                unformatOnSubmit: true
            });
        }
    });

    currencyQty.forEach(function(element) {
        // Periksa apakah elemen tersebut sudah diinisialisasi sebelumnya
        if (!AutoNumeric.getAutoNumericElement(element)) {
            new AutoNumeric(element, { 
                decimalCharacter: ",",
                digitGroupSeparator: ".",
                allowDecimalPadding: "floats",
                outputFormat: "string",
                unformatOnSubmit: true
            });
        }
    });

    currencyQtyPercent.forEach(function(element) {
        // Periksa apakah elemen tersebut sudah diinisialisasi sebelumnya
        if (!AutoNumeric.getAutoNumericElement(element)) {
            new AutoNumeric(element, { 
                alwaysAllowDecimalCharacter: true,
                currencySymbol: "%",
                currencySymbolPlacement: "s",
                decimalCharacter: ",",
                decimalPlacesRawValue: 2,
                digitGroupSeparator: ".",
                outputFormat: "string",
                unformatOnSubmit: true
            });
        }
    });

    document.body.addEventListener('focus', function(event) {
        if (event.target.classList.contains('currency')) {
            // Periksa apakah elemen tersebut sudah diinisialisasi sebelumnya
            if (!AutoNumeric.getAutoNumericElement(event.target)) {
                new AutoNumeric(event.target, { 
                    currencySymbol: "Rp ",
                    decimalCharacter: ",",
                    digitGroupSeparator: ".",
                    decimalPlacesRawValue: 0,
                    allowDecimalPadding: "floats",
                    outputFormat: "string",
                    unformatOnSubmit: true
                });
            }
        }

        if (event.target.classList.contains('qty')) {
            // Periksa apakah elemen tersebut sudah diinisialisasi sebelumnya
            if (!AutoNumeric.getAutoNumericElement(event.target)) {
                new AutoNumeric(event.target, { 
                    decimalCharacter: ",",
                    digitGroupSeparator: ".",
                    allowDecimalPadding: "floats",
                    outputFormat: "string",
                    unformatOnSubmit: true
                });
            }
        }

        if (event.target.classList.contains('qtyPercent')) {
            // Periksa apakah elemen tersebut sudah diinisialisasi sebelumnya
            if (!AutoNumeric.getAutoNumericElement(event.target)) {
                new AutoNumeric(event.target, { 
                    alwaysAllowDecimalCharacter: true,
                    currencySymbol: "%",
                    currencySymbolPlacement: "s",
                    decimalCharacter: ",",
                    decimalPlacesRawValue: 2,
                    digitGroupSeparator: ".",
                    outputFormat: "string",
                    unformatOnSubmit: true
                });
            }
        }
    }, true);
});

function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
  }