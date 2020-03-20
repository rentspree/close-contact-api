design graphql
```
{
  me : User {
   id
   name
   contacts: [User] { //distinct
       id
       name
       makeContact()
   }
   transactions [CloseContact] {
     id 
     name
     time
     type // met, be met, 
   }
  }

  notifications [Notification] {
   //filter
  }
  
  markInfect() // send noti to all user related
  markCure() // send noti to all user related

}
```