
create user
```
mutation {
  userCreate(record:{facebookId:"1",name:"myName"}) {
    recordId
    record {
      facebookId
      email
      name
      status
      hasAcceptedTerm
      updatedAt
      createdAt
    }
  }
}
```

update user
```
mutation {
 userUpdate(filter:{_id:"5e74aee2fdcb63389ae85e06"},record:{name:"green1"}) {
  recordId
  record {
    facebookId
    email
    name
    status
    hasAcceptedTerm
    updatedAt
    createdAt
  }
 }
}
```

find user
```
mutation {
  userCreate(record:{
    facebookId:"facebook_1",
    name:"sorasak"
  })
}
```



findAll user
```
{
  users  {
    facebookId
    email
    name
    status
    hasAcceptedTerm
    updatedAt
    createdAt
  }
}
```

filter user
```
{
  users (filter:{facebookId:"fb_1"}) {
    facebookId
    email
    name
    status
    hasAcceptedTerm
    updatedAt
    createdAt
  }
}
```