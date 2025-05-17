import { AppDataSource } from "./data-source";

AppDataSource.initialize().then(()=>{
    console.log("Connected");    
}).catch((error)=>{
    console.log(error);
})