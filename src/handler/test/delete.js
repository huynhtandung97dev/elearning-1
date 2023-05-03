const Test = require("../../model/test");
const BadReqErr = require("../../error/bad-req");
const Submission = require("../../model/submission");

async function deleteTest(req, res, next) {
    try {
        // kiểm tra người tạo
        const test = await Test.findById(req.params.id);
        if (!test.createdBy.equals(req.user.id)) {
            throw new BadReqErr("Bạn không phải người tạo bài thi");
        }

        await Test.findByIdAndDelete(test._id);

        for await (const s of test.submissions) {
            console.log("submission nè: ", s);
            await Submission.findByIdAndDelete(s);
        }

        res.status(204).json({});
    } catch (err) {
        console.log(err);
        next(err);
    }
}

module.exports = deleteTest;
