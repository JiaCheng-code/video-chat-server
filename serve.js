// 引入模块
const express = require('express')
const socket = require('socket.io')
const cors = require('cors')
const {v4:uuidv4} = require('uuid')

// 服务器初始化
const app = express()
const PORT = process.env.PORT || 5000;

// cors 解决跨域
app.use(cors);

// 监听端口号启动服务器
const server = app.listen(PORT,()=>{
    console.log(`端口号正在${PORT}端口号运行`)
})

// 传递server对象，初始化io实例
const io = socket(server,{
    cors:{
        origin: '*',
        methods: ['GET','POST']
    }
})

//监听客户端socket连接
io.on('connection',(socket)=>{
    socket.emit('connection',null)
    console.log('新用户加入房间')
})