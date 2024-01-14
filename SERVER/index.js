const mongoose = require("mongoose")
const Document = require("./document")
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const sg = require('@sendgrid/mail')
dotenv.config();
const pwd = process.env.PASSWORD;



mongoose.connect("mongodb+srv://raj:"+pwd+"@cluster0.wtliayy.mongodb.net/",{
    connectTimeoutMS: 30000, // Adjust timeout value as needed
    socketTimeoutMS: 30000, // Adjust timeout value as needed
  }).then((v)=>{
    console.log("db connected!")
  })

const io = require('socket.io')(4000,{
    cors:{
        origin:'*',
        method: ['GET','POST'],

    },
});

io.on("connection", socket => {
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId)
    socket.join(documentId)
    console.log(document)
    socket.emit("load-document", document)

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta)
    })
    socket.on("share-document",async email=>{
      

        sg.send({
            from: 'rshah213203@gmail.com',
            to: email ,
            subject: 'SyncWrite Edit Document Invitation',
            text: `Click this : http://localhost:3000/documents/${documentId} \n to edit the SyncWrite Document.\n Happy Editing!\n Team SyncWrite`
        })
    })
    socket.on("save-document", async data => {
      await Document.findOneAndUpdate({_id:documentId}, { data: data })
    })
  })
})



async function findOrCreateDocument(id) {
  if (id == null) return
  const doc = await Document.findById( id)
  if(doc) return doc.data;
  return await Document.create({ _id: id, data: "defaultValue" ,owner:"raj21032003@gmail.com"})
}