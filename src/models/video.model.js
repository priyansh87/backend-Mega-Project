import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = Schema(
    {
        videoFile : {
            type : String , // url from cloudinary 
            required : [true , "video file should be provided ! "]
        }, 
        thumbnail : {
            type : String , 
            required : [true , "thumbnail should be provided ! "]
        }, 
        title : {
            type : String , 
            required : [true , "title should be provided ! "]
        }, 
        description : {
            type : String , 
            required : [true , "description should be provided ! "]
        }, 
        duration : {
            type : Number , 
            required : true ,
        },
        views : {
            type : Number , 
            default : 0 ,
        }, 
        isPublished : {
            type : Boolean, 
            default : true , 
        }, 
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }


    } 
, {timestamps : true }
)

videoSchema.plugin( mongooseAggregatePaginate )

export const Video = mongoose.model( "Video" , videoSchema) ;