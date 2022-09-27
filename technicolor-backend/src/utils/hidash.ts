import {BadRequestError} from "../errors/RequestErrorCollection";

export default {
    clean:(obj: any)=>{
        let propNames = Object.getOwnPropertyNames(obj);
        for (let i = 0; i < propNames.length; i++) {
            let propName = propNames[i];
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
        return obj
    },
    cleanUndefined:(obj: any)=>{
        let propNames = Object.getOwnPropertyNames(obj);
        for (let i = 0; i < propNames.length; i++) {
            let propName = propNames[i];
            if (obj[propName] === undefined) {
                delete obj[propName];
            }
        }
        return obj
    },
    getJsonObjectOrIgnoreIfAlreadyJSON : (thing: any) => {
        if(typeof thing === "object"){
            return thing
        } else {
            return JSON.parse(thing)
        }
    },
    checkProperty: (thing:any, object_name:string, ...property:string[])=>{

        for(let key of property){
                if(thing[key] == null) //null or undefined
                    return (new BadRequestError(`New ${key} for new ${object_name} is missing`, "MISSING_INFO"))
        }
        return thing
    }
}
