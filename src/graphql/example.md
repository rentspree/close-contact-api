
```
mutation {
  userCreateOne(record:{facebookId:"1"}) {
    recordId
  }
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