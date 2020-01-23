module.exports= {
    createNewSocketId: 
        function()
        {
            var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;

            let tmpStamp = [year, month, day].join('');
            let split = tmpStamp.split("")
            split.splice(0,1)
            split.splice(0,1)
            for (let x = 0; x < 10; x++)
            {
                let num = Math.floor(Math.random() * (+9 - +0)) + +0
                split.push(num)
            }
            let trueStamp = split.join("")
            return trueStamp
        },
}