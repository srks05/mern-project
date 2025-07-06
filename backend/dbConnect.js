const mongoose=require('mongoose')
// const PathURL="mongodb+srv://jhon:dXhyQvx0TkoIgmZS@cluster0.fiyyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const PathURL='mongodb://0.0.0.0:27017/auction';
mongoose.connect(PathURL)
.then(()=>{
    console.info("DB Connected")
})
.catch((e)=>{
    console.info(`DB Error--- ${e}`)
})