
var interval


function init(redis){
    //Create interval
}

function updateData(redis){
    redis.keys(`ranking/chart/${getmonth()}`, function(err, keys){
        if(keys.length == 0){
            redis.exists(`ranking/xp/${getmonth()}`, function(err, exists){
                if(exists){
                    //create xp cp = xpmonth
                    redis.zrevrange(`ranking/xp/${getmonth()}`, 0, -1, 'WITHSCORES', function (err, reply) {
                        redis.zset
                    })

                    //create/update save file
                    createSaveFile(redis)
                }else{
                    //Waiting for an update
                }
            })
        }else{
            //create xp cp = xpmonth - save


            //update save file
            createSaveFile(redis)
        }
    })
}

function stop(redis){
    //Stop interval
    //Last updateData
}

function createSaveFile(redis){

}


function getMonth(){
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    if(month<10){
        month = '0' + month
    }
    return(`${year}/${month}`)
}


exports.init = init
exports.stop = stop