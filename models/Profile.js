const mongoose=require("mongoose");

const ProfileSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:false
    },
    
    // company:{type:String},
    squat:{type:String},
    bench:{type:String},
    deadlift:{type:String},
    location:{
        
            type:String
        

    },
    
    skills:{
        type:[String], required:false
    },
    bio:{
        type: String,
        required:false
    },
    trainer:{
        type:Boolean
    },
    competitions:[{
        title:{
            type:String
        },
        represented:{type:String},
        squat:{type:String},
        bench:{type:String},
        deadlift:{type:String},
        snatch:{type:String},
        cnj:{type:String},
        position:{type:String},
        location:{type:String},
        from:{type:String},
        to:{type:String},
        description:{type:String}
    }
    ]
    ,
    
    social:
        {
            youtube: { type: String, required: false },
            facebook: { type: String, required: false },
            twitter: { type: String, required: false },
            linkedin: { type: String, required: false },
            instagram: { type: String, required: false },
        },
    
    followers:[{type: mongoose.Schema.Types.ObjectId, ref:"user"}],
    following:[{type: mongoose.Schema.Types.ObjectId, ref:"user"}],
    },
    {timestamps:true}
)

const Profile=mongoose.model("profile", ProfileSchema);
module.exports=Profile;