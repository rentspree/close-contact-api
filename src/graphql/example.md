
```
mutation {
  userCreateOne(record:{facebookId:"1"}) {
    recordId
  }
}
```


```
{
  userOne(filter:{
    facebookId:"1"
  }) {
    facebookId
    email
    status
    hasAcceptedTerm
    updatedAt
    createdAt
  }
}
```