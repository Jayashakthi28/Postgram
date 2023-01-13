db.createCollection("user","validator":{$jsonSchema:{"bsonType":"object","description":"Document that stores user data","required":["name","email","password","username"],"properties":{
                "name":{
                    "bsonType":"string",
                    "description":"Name must be a string and is required"
                },
                "email":{
                    "bsonType":"string",
                    "description":"Email must be a string and is required"
                },
                "password":{
                    "bsonType":"string",
                    "description":"Password must be a string and is required"
                },
                "username":{
                    "bsonType":"string",
                    "description":"Username must be a string and is required"
                },
                "phone":{
                    "bsonType":"string",
                    "description":"Phone must be a string"
                },
                "posts":{
                    "bsonType":"array",
                    "description":"Posts must be an array of post ids",
                    "uniqueItems":true,
                    "items":{
                        "bsonType":"string"
                    }
                },
                "comments":{
                    "bsonType":"array",
                    "description":"Comments must be an array of comment ids",
                    "uniqueItems":true,
                    "items":{
                        "bsonType":"string"
                    }
                },
                "likes":{
                    "bsonType":"array",
                    "description":"likes must be an array of post ids",
                    "uniqueItems":true,
                    "items":{
                        "bsonType":"string"
                    }
                },
                "followers":{
                    "bsonType":"array",
                    "description":"Followers must be an array of user ids",
                    "uniqueItems":true,
                    "items":{
                        "bsonType":"string"
                    }
                },
                "following":{
                    "bsonType":"array",
                    "description":"Following must be an array of user ids",
                    "uniqueItems":true,
                    "items":{
                        "bsonType":"string"
                    }
                },
                "notification":{
                    "bsonType":"array",
                    "description":"Notification must be an array of notification ids",
                    "uniqueItems":true,
                    "items":{
                        "bsonType":"string"
                    }
                }
            }
        }
    }
)