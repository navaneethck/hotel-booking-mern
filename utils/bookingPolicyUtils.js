function checkingPolicy(booking,hotel){
    const now = new Date();
    const checkInDate = new Date(booking.checkInDate);

    const timeDiff = checkInDate - now;
    const hoursDiff = timeDiff / (1000 * 3600);

    if(hoursDiff <hotel.freeCancellationHours){

        let refundPercentage = 0;

        for(let rule of hotel.refundRules){
            if(hoursDiff >= rule.hoursBeforeCheckIn){
                refundPercentage = rule.refundPercentage;
                break
            }
        }

        return {
            canCancel:refundPercentage>0,
            refundPercentage
        }
    }

    return{
        canCancel:true,
        refundPercentage:100
    }

}

module.exports = {checkingPolicy};