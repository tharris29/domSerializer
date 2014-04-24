function domSerializer(){
    var _self = this;
    _self.resultJson = {};
    _self.circularReferenceStack = [];
    _self.circularReferenceExceptions = ["className", "_self.resultJson"];
    _self.serialize = function (domElement) {

        try{
            _serializeLowerLevel(domElement, "_self.resultJson");

            return _self.resultJson;
        }
        catch(e)
        {
            console.log(e);
        }
    };

    function _serializeLowerLevel(domElement, parentJSONName) {

        var valueProperty = true;
        var bCircularReference = false;
        if (!$.isArray(domElement)) {

            for (var object in domElement) {

                valueProperty = false;
                if (_circularReference(object)) {
                    _addSubObject(parentJSONName, "potentialCircularReference_" + object);
                    bCircularReference = true;
                    break;
                }

                _serializeLowerLevel(domElement[object], _addSubObject(parentJSONName, object));
            }
        }
         
        if (valueProperty && !bCircularReference)
        {
            _addPropertyValue(parentJSONName, domElement);
        }
        else if (valueProperty && bCircularReference)
        {
            _addPropertyValue(parentJSONName, " Potential circular reference item was skipped");
        }

 

    }

    function _circularReference(objectName) {

     
        if (!isNaN(objectName)) {
            objectName = "data_" + objectName
        }

        if (_self.circularReferenceStack[objectName]) {
            for (var exeception in _self.circularReferenceExceptions)
            {
                if (_self.circularReferenceExceptions[exeception] == objectName)
                {
                    return false;
                }
            }
            return true;
        }
        _self.circularReferenceStack[objectName] = true;
        return false;
      
    }

    function _addPropertyValue(jsonObjectName,domValue)
    {
        try {

            switch(typeof domValue)
            {                
                case "string":
                    eval(jsonObjectName + " = decodeURIComponent('" + encodeURIComponent(domValue) + "')");
                    break;             
                default:
                    eval(jsonObjectName + " =  domValue");
                    break;
            }

        }catch(e)
        {
            throw new Error("Unable to add object value '" + domValue + "', the error throw was '" + e.message + "'.");
        }
    }

    function _addSubObject(jsonObject,subObjectName) {

        try{
            if (!isNaN(subObjectName)) {
                subObjectName = "data_" + subObjectName;
            }
            //todo improve regex
            subObjectName = subObjectName.replace(/-/g, "").replace(/\./g, "");

            var newObjectName = jsonObject + "." + subObjectName;
            eval(newObjectName + "= {}");

            return newObjectName;
        }
        catch(e)
        {
            throw new Error("Unable to build object with name '" + subObjectName + "', the error throw was '" + e.message + "'.");
        }
    }
}
