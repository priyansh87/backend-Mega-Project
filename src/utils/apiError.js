class ApiError extends Error {
    constructor(
        statusCode, 
        message = "something went wrong" ,
        errors = [] , 
        stack = ""
    ) {
        super(message) ; // to overwrite the message 
        this.statusCode = statusCode ;
        this.data = null ;
        this.message = message ;
        this.success = false ; // since api error is being handled so the success is false
        this.errors = errors

        if(stack){
            this.stack = stack 
        }else{
            Error.captureStackTrace( this , this.constructor )
        }
    }

}


export {ApiError}