mongosh
use admin
db.createUser({
  user: "adminUser",
  pwd: "StrongAdminPassword",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    "readWriteAnyDatabase"
  ]
});

mongosh -u adminUser -p StrongAdminPassword --authenticationDatabase admin


use myappDB
db.createUser({
  user: "appUser",
  pwd: "securePassword",
  roles: [{ role: "readWrite", db: "myappDB" }]
});

mongosh -u appUser -p securePassword --authenticationDatabase myappDB


use myappDB
db.sample.insertOne({ initialized: true });


show databases


