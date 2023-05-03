const BadReqErr = require("../../../error/bad-req");
const Role = require("../../../model/role");
const User = require("../../../model/user");

async function newManyUser(req, res, next) {
    const { users, roleId } = req.body;

    try {
        // Kiểm tra username
        const extUsers = await User.find({
            username: { $in: users.map((u) => u.username) },
        });
        if (extUsers.length > 0) {
            throw new BadReqErr("Tên Người Dùng Đã Tồn Tại");
        }

        // Kiểm tra roleId
        const role = await Role.findById(roleId);
        if (!role) {
            throw new BadReqErr("Vai trò không tồn tại");
        }

        // Tạo nhiều user
        let flag = true;
        let userList = [];

        //dữ liệu chuẩn bị insert
        const insertUser = users.map((item) => ({ ...item, role: role._id }));

        console.log("dữ liệu User: ", users);
        const data = await User.insertMany(insertUser);
        // for await (const {
        //   username,
        //   password,
        //   fullName,
        //   gender,
        //   dob,
        //   email,
        //   phone,
        //   provinceId,
        //   districtId,
        //   wardId,
        //   street,
        //   hasAccess,
        // } of users) {
        //   try {
        //     const user = User.build({
        //       username,
        //       password,
        //       profile: {
        //         fullName,
        //         gender,
        //         dob,
        //         email,
        //         phone,
        //         address: {
        //           provinceId,
        //           districtId,
        //           wardId,
        //           street,
        //         },
        //       },
        //       role: role._id,
        //       hasAccess,
        //     });
        //     userList.push(user);
        //   } catch (err) {
        //     console.log(err);
        //     flag = false;
        //   }
        // }

        // Tiến hành tạo lưu những user đã tạo
        // if (flag) {
        //   for await (const u of userList) {
        //     await u.save();
        //   }
        // } else {
        //   throw new BadReqErr("Tạo Nhiều Người Dùng Thất Bại");
        // }

        res.status(201).json({
            message: "Tạo Thành Công",
            data,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

module.exports = newManyUser;
