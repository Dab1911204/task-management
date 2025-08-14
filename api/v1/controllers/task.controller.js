const Task = require('../models/task.model');
const paginationHelper = require('../../../helpers/pagination')
const searchHelper = require('../../../helpers/search')

//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        $or:[
            {createdBy:req.user.id},
            {listUser:req.user.id}
        ],
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status
    }

    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    }

    let objectSearch = searchHelper(req.query)
    if (req.query.keyword) {
        find.title = objectSearch.regex
    }

    //Pagination
    const countTasks = await Task.countDocuments(find)
    const initPagination = {
        currentPage: 1,
        limitItem: 2,
    }
    let objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    )
    console.log(initPagination)
    //End Pagination

    const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skip);

    res.json(tasks)
}

//[GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({
            _id: id,
            deleted: false
        });
        res.json(task)
    } catch (e) {
        res.json("Không tìm thấy!")

    }

}

//[PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status
        await Task.updateOne({
            _id: id
        }, {
            $set: {
                status: status
            }
        })
        res.json({
            code: 200,
            message: "Cập nhật thành công!"
        })
    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại!"
        })
    }
}

//[PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key, value } = req.body

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    $set: {
                        status: value
                    }
                })
                res.json({
                    code: 200,
                    message: "Cập nhật thành công!"
                })
                break;
            case "deleted":
                await Task.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    deleted: true,
                    deleteAt: new Date()
                })
                res.json({
                    code: 200,
                    message: "Xóa thành công!"
                })
                break;
            default:
                res.json({
                    code: 404,
                    message: "Không tồn tại!"
                })
                break;
        }
    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại!"
        })
    }
}

//[POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const task = new Task(req.body);
        const data = await task.save();
        res.json({
            code: 200,
            message: "Thêm mới thành công!",
            data: data
        })
    } catch (error) {
        res.json({
            code: 404,
            message: "Thêm mới Không thành công!"
        })
    }
}

//[PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({ _id: id }, req.body)
        const data = await Task.findOne({ _id: id })
        res.json({
            code: 200,
            message: "Cập nhật thành công!",
            data: data
        })
    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại!"
        })
    }
}

//[delete] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({ _id: id }, {
            deleted: true,
            deleteAt: new Date()
        })
        res.json({
            code: 200,
            message: "Xóa thành công!"
        })
    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại!"
        })
    }
}