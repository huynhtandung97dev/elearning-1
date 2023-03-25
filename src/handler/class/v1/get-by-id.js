const NotFoundErr = require("../../../error/not-found");
const Class = require("../../../model/class");

async function getClass(req, res, next) {
  try {
    const _class = await Class.findById(
      req.params.id
    ).populate([
      {
        path: "users",
        populate: [
          {
            path: "role",
            populate: [
              {
                path: "permissions",
              },
            ],
          },
        ],
      },
    ]);
    if (!_class) {
      throw new NotFoundErr("Không tìm thấy lớp học");
    }

    res.json({
      class: _class,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

module.exports = getClass;
