const NotFoundErr = require("../../error/not-found");
const Test = require("../../model/test");

async function myTest(req, res, next) {
    try {
        const testList = await Test.find({
            createdBy: req.user.id,
        }).sort({ createdAt: -1 });
        if (!testList.length) {
            throw new NotFoundErr("Danh sách bài thi trống");
        }

        res.status(201).json({
            testList,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

module.exports = myTest;
