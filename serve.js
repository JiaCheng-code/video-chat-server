// 引入模块
const express = require('express')
const socket = require('socket.io')
const cors = require('cors')
const {v4: uuidv4} = require('uuid')

// 服务器初始化
const app = express()
const PORT = process.env.PORT || 8000;

// cors 解决跨域
app.use(cors);

// 监听端口号启动服务器
const server = app.listen(PORT, () => {
    console.log(`端口号正在${PORT}端口号运行`)
})

// 传递server对象，初始化io实例
const io = socket(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

let peers = [] // 初始化对等连接数组
const broadcastEventType = {
    ACTIVE_USERS: 'ACTIVE_USERS',
    GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS'
}
//监听客户端socket连接
io.on('connection', (socket) => {
    socket.emit('connection', null)
    console.log('新用户加入房间')
    // 注册新用户
    socket.on('register-mew-user', (data) => {

        peers.push({
            username: data.username,
            socketId: data.socketId
        })
        console.log('注册新用户', peers)
        // 向所有连接到客户端的用户广播活跃用户
        io.sockets.emit('broadcast', {
            event: broadcastEventType.ACTIVE_USERS,
            activeUsers:peers
        })
    })
    // 断开连接移除用户
    socket.on('disconnect',()=>{
        console.log('用户下线')
        peers = peers.filter((peer)=>{
            return peer.socketId !== socket.id
        })
        // 向所有连接到客户端的用户广播活跃用户
        io.sockets.emit('broadcast', {
            event: broadcastEventType.ACTIVE_USERS,
            activeUsers:peers
        })
    })

})
