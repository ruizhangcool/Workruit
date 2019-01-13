angular.module('mdo-angular-cryptography', [])
    .provider('$crypto', function CryptoKeyProvider() {
        var cryptoKey;

        this.setCryptographyKey = function(value) {
            cryptoKey = value;
        };


         var arrayBites = ['0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00'];
       // var iv = CryptoJS.lib.WordArray.random(16);
      //var iv = CryptoJS.enc.Base64.parse(arrayBites);
      var iv = CryptoJS.enc.Hex.parse(0x00);
        this.$get = [function(){
            return {
                getCryptoKey: function() {
                    return  CryptoJS.enc.Latin1.parse(CryptoJS.enc.Latin1.stringify(CryptoJS.SHA256(cryptoKey)))
                },

                encrypt: function(message, key) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }

                    return CryptoJS.AES.encrypt(message, CryptoJS.enc.Latin1.parse(CryptoJS.enc.Latin1.stringify(CryptoJS.SHA256(key))),{ iv: iv }).toString();
                },

                decrypt: function(message, key) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }

                    return CryptoJS.AES.decrypt(message, CryptoJS.enc.Latin1.parse(CryptoJS.enc.Latin1.stringify(CryptoJS.SHA256(key))),{ iv: iv}).toString(CryptoJS.enc.Utf8)
                }
            }
        }];
    });
