const BadReqErr = require("../../error/bad-req");
const Submission = require("../../model/submission");
const Test = require("../../model/test");

async function changeTest(req, res, next) {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            throw new BadReqErr("Không tồn tại bài thi");
        }

        await test.updateOne({
            ...req.body,
            members: req.body.memberIds,
            class: req.body.classId,
        });

        //check member đã được thêm submission chưa, nếu chưa tiến hành add
        for await (const m of test.members) {
            const newSubmission = new Submission({
                user: m,
                test: test.id,
                totalQuestion: req.body.questions.length || 0,
            });
            await newSubmission.save();

            // Thêm bài nộp vào bài kiểm tra để tiện populate
            await test.updateOne({
                ...req.body,
                members: req.body.memberIds,
                class: req.body.classId,
            });
        }

        await Submission.updateMany(
            {
                test: test._id,
            },
            {
                $set: {
                    totalQuestion: req.body.questions.length || 0,
                },
            }
        );

        const detail = await Test.findById(req.params.id);

        res.json({
            test: detail,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

module.exports = changeTest;
