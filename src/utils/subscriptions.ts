import { User } from "../entities/User";
import { Subscription } from "../entities/Subscriptions";
import { AppDataSource } from "../data-source";


const saveSubscription=async(userId:string,subscription:Subscription)=>{
     if (!subscription) {
    console.error(" Subscription object is missing!");
  }
  if (!subscription.endpoint) {
    console.error(" Subscription endpoint is missing!", subscription);
  }

  const sub = await AppDataSource.getRepository(Subscription).findOne({
    where: {
      endpoint: subscription.endpoint,
    },
  })
  if(sub){
    sub.auth=subscription.auth;
    sub.p256dh=subscription.p256dh;
    await AppDataSource.getRepository(Subscription).save(sub);
  }
  return sub; 
  
}

const getSubscriptions=async(userId:string)=>{
    const user = await AppDataSource.getRepository(User).findOne({
        where: {
        id: userId,
        },
        relations: ["subscriptions"],
    });
    if (!user) {
        console.error("User not found!");
        return null;
    }
    return user.subscriptions;
}

export {saveSubscription,getSubscriptions}