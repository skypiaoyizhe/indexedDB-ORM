# indexedDB-ORM
indexedDB-ORM是一个数据库操作类。操作对象为浏览器的indexedDB数据库。

```
// this.$db.name("allMessages").insert(message).then(data => {
        //     console.log("写入数据成功", data)
        // }).catch(error => {
        //     console.log("写入数据失败", error)
        // })

        
        // this.$db.name("allMessages").where({content: 'ttt', status: 'going'}).select().then(data => {
        //     console.log("查询数据成功", data)
        // }).catch(error => {
        //     console.log("查询数据失败", error)
        // })

        // this.$db.name("allMessages").where({content: 'ttt', status: 'going'}).update({
        //     content: "88282828288228"
        // }).then(data => {
        //     console.log("查询数据成功", data)
        // }).catch(error => {
        //     console.log("查询数据失败", error)
        // })

        // this.$db.name("allMessages").where({id: "2c3b0c03-203a-41e9-b6b5-b7ce76f7f883"}).delete().then(data => {
        //     console.log("查询数据成功", data)
        // }).catch(error => {
        //     console.log("查询数据失败", error)
        // })

```
